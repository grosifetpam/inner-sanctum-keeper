import { useSystem } from '@/contexts/SystemContext';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, filter: 'blur(3px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function CitationsPage() {
  const { data, getAlterName } = useSystem();
  const publicCitations = data.citations.filter(c => c.isPublic);

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
        <h1 className="text-3xl font-display text-glow tracking-wider mb-2 animate-quill">Citations</h1>
        <motion.div className="divider-ornate w-32 mx-auto mb-2" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.6 }} />
        <motion.div className="flex justify-center mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <span className="text-[8px] text-gold/30 tracking-[0.5em] font-display">✦ ✦ ✦</span>
        </motion.div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        {publicCitations.map(c => (
          <motion.div key={c.id} variants={itemVariants} whileHover={{ scale: 1.01, transition: { duration: 0.2 } }} className="card-grimoire p-6 text-center hover-ember">
            <Quote className="w-5 h-5 text-primary/30 mx-auto mb-3" />
            <blockquote className="text-lg font-body italic text-foreground/80 mb-2 animate-quill">"{c.text}"</blockquote>
            <p className="text-sm text-muted-foreground font-ui">— {getAlterName(c.alterId)} • {c.date}</p>
          </motion.div>
        ))}
        {publicCitations.length === 0 && (
          <p className="text-center text-muted-foreground font-body py-12">Aucune citation pour le moment.</p>
        )}
      </motion.div>
    </div>
  );
}
