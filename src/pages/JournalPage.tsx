import { useState } from 'react';
import { useSystem } from '@/contexts/SystemContext';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10, filter: 'blur(3px)' },
  visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function JournalPage() {
  const { data, getAlterName } = useSystem();
  const [filterAlterId, setFilterAlterId] = useState('all');

  const publicEntries = data.journal
    .filter(j => j.isPublic && !j.isPrivateAlterJournal)
    .filter(j => filterAlterId === 'all' || j.alterId === filterAlterId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const publicAlters = data.alters.filter(a => a.isPublic);

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Journal" subtitle="Les pages inscrites dans ce grimoire" icon={BookOpen} chapter="Chapitre II" />

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-6">
        <select
          value={filterAlterId}
          onChange={e => setFilterAlterId(e.target.value)}
          className="bg-card/60 backdrop-blur-sm border border-border/30 rounded px-3 py-2 text-sm font-ui text-foreground focus:border-gold/30 focus:ring-1 focus:ring-gold/20 transition-colors"
        >
          <option value="all">Tous les alters</option>
          {publicAlters.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        {publicEntries.map((entry, i) => (
          <motion.div key={entry.id} variants={itemVariants} whileHover={{ x: 6, transition: { duration: 0.2 } }} className="card-grimoire rune-corners p-6 hover-ember relative">
            {/* Page number decoration */}
            <div className="absolute top-3 right-4 text-[8px] font-display text-gold/15">{i + 1}</div>
            
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-lg text-foreground">{entry.title}</h2>
              <span className="text-xs font-ui text-muted-foreground">{entry.date}</span>
            </div>
            <p className="text-xs font-ui text-gold mb-3">Par {getAlterName(entry.alterId)}</p>
            <p className="font-body text-foreground/80 leading-relaxed whitespace-pre-wrap">{entry.content}</p>
            {entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {entry.tags.map(tag => (
                  <span key={tag} className="text-xs font-ui bg-accent/30 text-accent-foreground px-2 py-0.5 rounded">#{tag}</span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
        {publicEntries.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground font-body italic">Les pages de ce chapitre sont encore vierges…</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
