import { useSystem } from '@/contexts/SystemContext';
import PsychologicalMap from '@/components/PsychologicalMap';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

export default function CartographyPage() {
  const { data } = useSystem();
  const publicAlters = data.alters.filter(a => a.isPublic);
  const publicRelations = data.relations.filter(r =>
    publicAlters.some(a => a.id === r.fromAlterId) && publicAlters.some(a => a.id === r.toAlterId)
  );

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader title="Cartographie du Système" subtitle="Explorez les rôles, influences et relations entre les alters" icon={Brain} chapter="Chapitre VII" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="card-grimoire rune-corners p-6 aura-glow"
      >
        {publicAlters.length > 0 ? (
          <PsychologicalMap alters={publicAlters} relations={publicRelations} />
        ) : (
          <div className="text-center py-12">
            <Brain className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground font-body italic">La carte reste à dessiner…</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
