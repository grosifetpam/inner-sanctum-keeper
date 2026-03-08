import { useSystem } from '@/contexts/SystemContext';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function SystemPage() {
  const { data, getAlterName } = useSystem();
  const { systemInfo, alters } = data;
  const publicAlters = alters.filter(a => a.isPublic);

  const roleStats = publicAlters.reduce((acc, a) => {
    acc[a.roleType] = (acc[a.roleType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
        <h1 className="text-3xl md:text-4xl font-display text-glow tracking-wider mb-2 animate-quill">{systemInfo.name}</h1>
        <motion.div className="divider-ornate w-32 mx-auto mb-2" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.6 }} />
        <motion.div className="flex justify-center mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <span className="text-[8px] text-gold/30 tracking-[0.5em] font-display">✦ ✦ ✦</span>
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="font-body text-lg text-foreground/80">
          {systemInfo.description}
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="card-grimoire p-6 hover-ember"
      >
        <h2 className="font-display text-gold text-lg mb-4">Statistiques des rôles</h2>
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(roleStats).map(([role, count]) => (
            <motion.div key={role} variants={itemVariants} whileHover={{ scale: 1.04, transition: { duration: 0.2 } }} className="bg-muted/30 rounded p-3 text-center">
              <p className="text-2xl font-display text-foreground">{count}</p>
              <p className="text-xs font-ui text-muted-foreground uppercase tracking-wider">{role}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="card-grimoire p-6 hover-ember"
      >
        <h2 className="font-display text-gold text-lg mb-2">Alter au front</h2>
        <p className="text-xl font-body text-foreground text-glow">{getAlterName(systemInfo.currentFrontAlterId)}</p>
        <p className="text-sm text-muted-foreground font-ui">Humeur : {systemInfo.moodOfDay}</p>
      </motion.div>
    </div>
  );
}
