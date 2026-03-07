import { useSystem } from '@/contexts/SystemContext';
import { motion } from 'framer-motion';

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
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-display text-glow tracking-wider mb-2">{systemInfo.name}</h1>
        <div className="divider-ornate w-32 mx-auto mb-4" />
        <p className="font-body text-lg text-foreground/80">{systemInfo.description}</p>
      </div>

      <div className="card-grimoire p-6">
        <h2 className="font-display text-gold text-lg mb-4">Statistiques des rôles</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(roleStats).map(([role, count]) => (
            <motion.div key={role} whileHover={{ scale: 1.02 }} className="bg-muted/30 rounded p-3 text-center">
              <p className="text-2xl font-display text-foreground">{count}</p>
              <p className="text-xs font-ui text-muted-foreground uppercase tracking-wider">{role}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="card-grimoire p-6">
        <h2 className="font-display text-gold text-lg mb-2">Alter au front</h2>
        <p className="text-xl font-body text-foreground">{getAlterName(systemInfo.currentFrontAlterId)}</p>
        <p className="text-sm text-muted-foreground font-ui">Humeur : {systemInfo.moodOfDay}</p>
      </div>
    </div>
  );
}
