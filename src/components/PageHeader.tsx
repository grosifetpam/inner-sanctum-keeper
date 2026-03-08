import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  chapter?: string;
}

/**
 * Reusable grimoire-styled page header with chapter number, 
 * mystical ornaments, and animated reveals.
 */
export default function PageHeader({ title, subtitle, icon: Icon, chapter }: PageHeaderProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10 relative">
      {/* Rune corner decorations */}
      <div className="absolute -top-2 left-0 text-gold/10 font-display text-xs select-none">᛭</div>
      <div className="absolute -top-2 right-0 text-gold/10 font-display text-xs select-none">᛭</div>

      {/* Chapter marker */}
      {chapter && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[9px] font-display text-gold/30 tracking-[0.6em] uppercase mb-3"
        >
          — {chapter} —
        </motion.p>
      )}

      {/* Icon */}
      {Icon && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mx-auto mb-3 w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center"
          style={{ boxShadow: '0 0 20px hsla(40, 70%, 50%, 0.1)' }}
        >
          <Icon className="w-5 h-5 text-gold/60" />
        </motion.div>
      )}

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-display text-glow tracking-wider mb-2 animate-quill">{title}</h1>

      {/* Ornate divider with moon phases */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <motion.div
          className="h-px w-16"
          style={{ background: 'linear-gradient(90deg, transparent, hsla(40, 70%, 50%, 0.4))' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        />
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="text-[10px] text-gold/30 tracking-[0.3em] font-display"
        >
          🌑 ✦ 🌕 ✦ 🌑
        </motion.span>
        <motion.div
          className="h-px w-16"
          style={{ background: 'linear-gradient(90deg, hsla(40, 70%, 50%, 0.4), transparent)' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        />
      </div>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-muted-foreground font-body italic"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
