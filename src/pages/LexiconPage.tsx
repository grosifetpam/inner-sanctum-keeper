import { useSystem } from '@/contexts/SystemContext';
import { BookOpen, Search, BookOpenCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import PageHeader from '@/components/PageHeader';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8, filter: 'blur(3px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function LexiconPage() {
  const { data } = useSystem();
  const [search, setSearch] = useState('');

  const publicEntries = useMemo(() =>
    data.lexicon.filter(e => e.isPublic), [data.lexicon]);

  const filtered = useMemo(() => {
    if (!search.trim()) return publicEntries;
    const q = search.toLowerCase();
    return publicEntries.filter(e =>
      e.term.toLowerCase().includes(q) || e.definition.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)
    );
  }, [publicEntries, search]);

  const categories = useMemo(() =>
    [...new Set(filtered.map(e => e.category))].sort(), [filtered]);

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Lexique" subtitle="Glossaire des termes inscrits dans ce grimoire" icon={BookOpenCheck} chapter="Chapitre VIII" />

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un terme…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card/60 backdrop-blur-sm border border-border/30 rounded font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold/30 focus:ring-1 focus:ring-gold/20 transition-colors"
          />
        </div>
      </motion.div>

      {/* Entries */}
      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <BookOpen className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground font-body italic">
            {search ? 'Aucun terme trouvé pour cette recherche.' : 'Le lexique est vide pour le moment.'}
          </p>
        </motion.div>
      ) : (
        categories.map((cat, catIdx) => (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + catIdx * 0.1, duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="font-display text-lg text-gold mb-4 capitalize">{cat}</h2>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
              {filtered.filter(e => e.category === cat).sort((a, b) => a.term.localeCompare(b.term)).map(entry => (
                <motion.div
                  key={entry.id}
                  variants={itemVariants}
                  whileHover={{ x: 6, transition: { duration: 0.2 } }}
                  className="card-grimoire rune-corners p-4 hover-ember"
                >
                  <h3 className="font-display text-foreground text-sm tracking-wide mb-1">{entry.term}</h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">{entry.definition}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ))
      )}
    </div>
  );
}
