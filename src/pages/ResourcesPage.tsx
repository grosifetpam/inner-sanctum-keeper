import { useSystem } from '@/contexts/SystemContext';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const categoryLabels: Record<string, string> = {
  livres: '📚 Livres',
  films: '🎬 Films',
  séries: '📺 Séries',
  musique: '🎵 Musique',
  articles: '📰 Articles',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10, filter: 'blur(3px)' },
  visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function ResourcesPage() {
  const { data } = useSystem();
  const publicResources = data.resources.filter(r => r.isPublic);
  const categories = [...new Set(publicResources.map(r => r.category))];

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
        <h1 className="text-3xl font-display text-glow tracking-wider mb-2 animate-quill">Ressources</h1>
        <motion.div className="divider-ornate w-32 mx-auto mb-2" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.6 }} />
        <motion.div className="flex justify-center mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <span className="text-[8px] text-gold/30 tracking-[0.5em] font-display">✦ ✦ ✦</span>
        </motion.div>
      </motion.div>

      {categories.map((cat, catIndex) => (
        <motion.div
          key={cat}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + catIndex * 0.15, duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="font-display text-lg text-gold mb-4">{categoryLabels[cat] || cat}</h2>
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
            {publicResources.filter(r => r.category === cat).map(r => (
              <motion.div key={r.id} variants={itemVariants} whileHover={{ x: 6, transition: { duration: 0.2 } }} className="card-grimoire p-4 flex items-center justify-between hover-ember">
                <div>
                  <h3 className="font-body text-foreground">{r.title}</h3>
                  <p className="text-sm text-muted-foreground font-ui">{r.description}</p>
                </div>
                {r.link && (
                  <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 ml-4">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
