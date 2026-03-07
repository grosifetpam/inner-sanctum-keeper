import { Link } from 'react-router-dom';
import { useSystem } from '@/contexts/SystemContext';
import { motion } from 'framer-motion';
import { Users, BookOpen, Map, Quote } from 'lucide-react';

export default function HomePage() {
  const { data, getAlterName } = useSystem();
  const { systemInfo, alters, journal, citations } = data;

  const publicAlters = alters.filter(a => a.isPublic);
  const publicJournal = journal.filter(j => j.isPublic && !j.isPrivateAlterJournal);
  const lastEntry = publicJournal[publicJournal.length - 1];
  const publicCitations = citations.filter(c => c.isPublic);
  const lastCitation = publicCitations[publicCitations.length - 1];
  const frontAlter = alters.find(a => a.id === systemInfo.currentFrontAlterId);

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-12"
      >
        <h1 className="text-4xl md:text-6xl font-display text-glow tracking-wider mb-4">
          {systemInfo.name}
        </h1>
        <div className="divider-ornate w-48 mx-auto mb-6" />
        <p className="text-lg text-foreground/80 font-body max-w-xl mx-auto leading-relaxed">
          {systemInfo.description}
        </p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Alters', value: publicAlters.length, icon: Users },
          { label: 'Au front', value: frontAlter?.name || '—', icon: null },
          { label: 'Humeur', value: systemInfo.moodOfDay, icon: null },
          { label: 'Entrées', value: publicJournal.length, icon: BookOpen },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="card-grimoire p-4 text-center"
          >
            <p className="text-xs font-ui text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-xl font-display text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Last journal entry */}
      {lastEntry && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="card-grimoire p-6">
          <h2 className="font-display text-lg text-gold mb-3">Dernière entrée du journal</h2>
          <h3 className="font-body text-xl text-foreground mb-1">{lastEntry.title}</h3>
          <p className="text-sm text-muted-foreground font-ui mb-2">{lastEntry.date} • {getAlterName(lastEntry.alterId)}</p>
          <p className="text-foreground/70 font-body line-clamp-3">{lastEntry.content}</p>
        </motion.div>
      )}

      {/* Citation */}
      {lastCitation && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-center py-6">
          <Quote className="w-6 h-6 text-primary/40 mx-auto mb-3" />
          <blockquote className="text-xl font-body italic text-foreground/80 max-w-lg mx-auto">
            "{lastCitation.text}"
          </blockquote>
          <p className="text-sm text-muted-foreground font-ui mt-2">— {getAlterName(lastCitation.alterId)}</p>
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/alters" className="btn-grimoire flex items-center gap-2">
          <Users className="w-4 h-4" /> Voir les alters
        </Link>
        <Link to="/journal" className="btn-grimoire flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> Lire le journal
        </Link>
        <Link to="/monde-interieur" className="btn-grimoire flex items-center gap-2">
          <Map className="w-4 h-4" /> Explorer le monde intérieur
        </Link>
      </div>
    </div>
  );
}
