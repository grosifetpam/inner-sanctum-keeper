import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

export { containerVariants, itemVariants };

/** Animated page title with icon */
export function AdminPageHeader({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children?: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between mb-6"
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Icon className="w-5 h-5 text-primary" />
        </motion.div>
        <h1 className="text-2xl font-display text-foreground text-glow">{title}</h1>
      </div>
      {children}
    </motion.div>
  );
}

/** Animated list of items with stagger */
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

/** Single animated list item with hover effect */
export function AdminListItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.01, x: 4 }}
      className={`card-grimoire p-4 relative overflow-hidden group ${className}`}
    >
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

/** Animated form card */
export function AdminFormCard({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="card-grimoire p-6 mb-6 relative overflow-hidden"
    >
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      />
      {children}
    </motion.div>
  );
}

/** Animated section card (for charts, graphs, etc.) */
export function AdminSectionCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={`card-grimoire p-6 mb-6 relative overflow-hidden ${className}`}
    >
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      />
      {children}
    </motion.div>
  );
}
