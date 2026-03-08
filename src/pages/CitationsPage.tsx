import { useSystem } from '@/contexts/SystemContext';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/PageHeader';

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
      <PageHeader title="Citations" subtitle="Paroles inscrites dans l'encre du grimoire" icon={Quote} chapter="Chapitre IV" />

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        {publicCitations.map(c => (
          <motion.div key={c.id} variants={itemVariants} whileHover={{ scale: 1.01, transition: { duration: 0.2 } }} className="card-grimoire rune-corners p-6 text-center hover-ember relative">
            {/* Decorative quote marks */}
            <div className="absolute top-3 left-4 text-gold/8 font-display text-4xl leading-none">«</div>
            <div className="absolute bottom-3 right-4 text-gold/8 font-display text-4xl leading-none">»</div>
            
            <Quote className="w-5 h-5 text-primary/30 mx-auto mb-3" />
            <blockquote className="text-lg font-body italic text-foreground/80 mb-2 px-6">« {c.text} »</blockquote>
            <div className="w-12 h-px mx-auto my-3" style={{ background: 'linear-gradient(90deg, transparent, hsla(350, 60%, 45%, 0.3), transparent)' }} />
            <p className="text-sm text-muted-foreground font-ui">— {getAlterName(c.alterId)} • {c.date}</p>
          </motion.div>
        ))}
        {publicCitations.length === 0 && (
          <div className="text-center py-12">
            <Quote className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground font-body italic">Aucune parole n'a encore été inscrite…</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
