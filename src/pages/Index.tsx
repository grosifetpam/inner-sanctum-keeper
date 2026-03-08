import { Link } from 'react-router-dom';
import { useSystem } from '@/contexts/SystemContext';
import { motion } from 'framer-motion';
import { Users, BookOpen, Map, Quote } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, filter: 'blur(3px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: 'easeOut' as const } },
};

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
      {/* Floating embers */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full pointer-events-none"
          style={{
            left: `${15 + i * 18}%`,
            top: `${20 + i * 8}%`,
            background: i % 2 === 0 ? 'hsla(40, 70%, 50%, 0.25)' : 'hsla(350, 60%, 45%, 0.2)',
          }}
          animate={{ y: [0, -30, 0], opacity: [0.1, 0.5, 0.1], scale: [1, 1.8, 1] }}
          transition={{ duration: 4 + i * 0.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
        />
      ))}

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center py-12"
      >
        <motion.h1
          className="text-4xl md:text-6xl font-display text-glow tracking-wider mb-4 animate-quill"
        >
          {systemInfo.name}
        </motion.h1>
        <motion.div
          className="divider-ornate w-48 mx-auto mb-2"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        />
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span className="text-[8px] text-gold/30 tracking-[0.5em] font-display">✦ ✦ ✦</span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-lg text-foreground/80 font-body max-w-xl mx-auto leading-relaxed"
        >
          {systemInfo.description}
        </motion.p>
      </motion.div>

      {/* Stats row */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Alters', value: publicAlters.length, icon: Users },
          { label: 'Au front', value: frontAlter?.name || '—', icon: null },
          { label: 'Humeur', value: systemInfo.moodOfDay, icon: null },
          { label: 'Entrées', value: publicJournal.length, icon: BookOpen },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="card-grimoire p-4 text-center hover-ember"
          >
            <p className="text-xs font-ui text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-xl font-display text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Last journal entry */}
      {lastEntry && (
        <motion.div
          initial={{ opacity: 0, x: -12, filter: 'blur(3px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="card-grimoire p-6 hover-ember"
        >
          <h2 className="font-display text-lg text-gold mb-3">Dernière entrée du journal</h2>
          <h3 className="font-body text-xl text-foreground mb-1">{lastEntry.title}</h3>
          <p className="text-sm text-muted-foreground font-ui mb-2">{lastEntry.date} • {getAlterName(lastEntry.alterId)}</p>
          <p className="text-foreground/70 font-body line-clamp-3">{lastEntry.content}</p>
        </motion.div>
      )}

      {/* Citation */}
      {lastCitation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center py-6"
        >
          <Quote className="w-6 h-6 text-primary/40 mx-auto mb-3" />
          <blockquote className="text-xl font-body italic text-foreground/80 max-w-lg mx-auto animate-quill">
            "{lastCitation.text}"
          </blockquote>
          <p className="text-sm text-muted-foreground font-ui mt-2">— {getAlterName(lastCitation.alterId)}</p>
        </motion.div>
      )}

      {/* Ornamental divider */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <div className="flex-1 divider-ornate" />
        <span className="text-[10px] text-gold/40 font-display tracking-widest">EXPLORER</span>
        <div className="flex-1 divider-ornate" />
      </motion.div>

      {/* Action buttons */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap justify-center gap-4"
      >
        {[
          { to: '/alters', icon: Users, label: 'Voir les alters' },
          { to: '/journal', icon: BookOpen, label: 'Lire le journal' },
          { to: '/monde-interieur', icon: Map, label: 'Explorer le monde intérieur' },
        ].map(btn => (
          <motion.div key={btn.to} variants={itemVariants}>
            <Link to={btn.to} className="btn-grimoire flex items-center gap-2">
              <btn.icon className="w-4 h-4" /> {btn.label}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
