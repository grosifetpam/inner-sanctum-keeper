import { useSystem } from '@/contexts/SystemContext';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

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
      <PageHeader title={systemInfo.name} subtitle={systemInfo.description} icon={Heart} chapter="Le Système" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="card-grimoire rune-corners p-6 hover-ember aura-glow"
      >
        <h2 className="font-display text-gold text-lg mb-4">Statistiques des rôles</h2>
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(roleStats).map(([role, count]) => (
            <motion.div key={role} variants={itemVariants} whileHover={{ scale: 1.04, transition: { duration: 0.2 } }} className="bg-muted/30 rounded p-3 text-center border border-border/30">
              <p className="text-2xl font-display text-foreground">{count}</p>
              <p className="text-xs font-ui text-muted-foreground uppercase tracking-wider">{role}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <div className="divider-serpent" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="card-grimoire rune-corners p-6 hover-ember border-l-2 border-rose-noir"
      >
        <h2 className="font-display text-gold text-lg mb-2">Alter au front</h2>
        <p className="text-xl font-body text-foreground text-glow">{getAlterName(systemInfo.currentFrontAlterId)}</p>
        <p className="text-sm text-muted-foreground font-ui mt-1">Humeur : {systemInfo.moodOfDay}</p>
      </motion.div>
    </div>
  );
}
