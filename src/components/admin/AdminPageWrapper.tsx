import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10, filter: 'blur(3px)' },
  visible: {
    opacity: 1, x: 0, filter: 'blur(0px)',
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export { containerVariants, itemVariants };

/** Animated page title — like a chapter heading with quill reveal */
export function AdminPageHeader({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children?: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
          >
            <Icon className="w-5 h-5 text-gold" />
          </motion.div>
          <motion.h1
            className="text-2xl font-display text-foreground text-glow animate-quill"
          >
            {title}
          </motion.h1>
        </div>
        {children && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </div>
      {/* Ornamental divider under title */}
      <motion.div
        className="mt-3 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, hsla(40, 70%, 50%, 0.3), hsla(350, 60%, 45%, 0.2), transparent)' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
      />
      <motion.div
        className="flex justify-center mt-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span className="text-[8px] text-gold/30 tracking-[0.5em] font-display">✦ ✦ ✦</span>
      </motion.div>
    </motion.div>
  );
}

/** Animated list — items appear like ink spreading on parchment */
export function AdminList({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-2"
    >
      {children}
    </motion.div>
  );
}

/** Single list item — ink-spread with hover ember glow */
export function AdminListItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ x: 6, transition: { duration: 0.2 } }}
      className={`card-grimoire p-4 relative overflow-hidden group hover-ember cursor-default ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

/** Form card — opens like breaking a wax seal */
export function AdminFormCard({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0.1, scaleX: 0.85 }}
      animate={{ opacity: 1, scaleY: 1, scaleX: 1 }}
      exit={{ opacity: 0, scaleY: 0.1, scaleX: 0.85 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: 'top center' }}
      className="card-grimoire p-6 mb-6 relative overflow-hidden"
    >
      {/* Top ornamental seal line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: 'linear-gradient(90deg, transparent, hsla(40, 70%, 50%, 0.4), hsla(350, 60%, 45%, 0.3), hsla(40, 70%, 50%, 0.4), transparent)' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      />
      {/* Corner rune marks */}
      <motion.span
        className="absolute top-2 right-3 text-[10px] text-gold/20 font-display"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        ◆
      </motion.span>
      <motion.span
        className="absolute bottom-2 left-3 text-[10px] text-gold/20 font-display"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        ◆
      </motion.span>
      {children}
    </motion.div>
  );
}

/** Section card — for charts, maps, featured content */
export function AdminSectionCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`card-grimoire p-6 mb-6 relative overflow-hidden grimoire-corners ${className}`}
    >
      {/* Bottom ornamental line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, hsla(40, 70%, 50%, 0.2), transparent)' }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      />
      {children}
    </motion.div>
  );
}
