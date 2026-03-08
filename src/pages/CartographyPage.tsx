import { useSystem } from '@/contexts/SystemContext';
import PsychologicalMap from '@/components/PsychologicalMap';
import { motion } from 'framer-motion';

export default function CartographyPage() {
  const { data } = useSystem();
  const publicAlters = data.alters.filter(a => a.isPublic);
  const publicRelations = data.relations.filter(r =>
    publicAlters.some(a => a.id === r.fromAlterId) && publicAlters.some(a => a.id === r.toAlterId)
  );

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 text-center">
        <h1 className="text-3xl font-display text-glow tracking-wider mb-2 animate-quill">Cartographie du Système</h1>
        <motion.div className="divider-ornate w-32 mx-auto mb-2" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.6 }} />
        <motion.div className="flex justify-center mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <span className="text-[8px] text-gold/30 tracking-[0.5em] font-display">✦ ✦ ✦</span>
        </motion.div>
        <p className="text-muted-foreground text-sm">Explorez les rôles, influences et relations entre les alters</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="card-grimoire p-6 grimoire-corners"
      >
        {publicAlters.length > 0 ? (
          <PsychologicalMap alters={publicAlters} relations={publicRelations} />
        ) : (
          <p className="text-center text-muted-foreground py-12">Aucun alter public à afficher.</p>
        )}
      </motion.div>
    </div>
  );
}
