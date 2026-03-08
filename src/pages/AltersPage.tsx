import { useState } from 'react';
import { useSystem } from '@/contexts/SystemContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Alter } from '@/types/system';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.3 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: 'easeOut' as const } },
};

function AlterCard({ alter, onClick }: { alter: Alter; onClick: () => void }) {
  const roleColors: Record<string, string> = {
    'hôte': 'bg-moonlight/20 text-moonlight',
    'protecteur': 'bg-ember/20 text-ember',
    'persécuteur': 'bg-destructive/20 text-destructive',
    'gardien': 'bg-gold/20 text-gold',
    'observateur': 'bg-accent text-accent-foreground',
    'trauma holder': 'bg-night-violet/40 text-secondary-foreground',
    'autre': 'bg-muted text-muted-foreground',
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="card-grimoire p-5 cursor-pointer transition-all hover:border-primary/30 hover-ember"
    >
      <div className="flex items-center gap-3 mb-3">
        {alter.avatar ? (
          <img src={alter.avatar} alt={alter.name} className="w-12 h-12 rounded-full object-cover border border-primary/20" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-display text-lg text-primary">
            {alter.name[0]}
          </div>
        )}
        <div>
          <h3 className="font-display text-foreground">{alter.name}</h3>
          <p className="text-xs font-ui text-muted-foreground">{alter.pronouns} • {alter.apparentAge || '?'} ans</p>
        </div>
      </div>
      <span className={`inline-block px-2 py-0.5 text-xs font-ui rounded ${roleColors[alter.roleType] || roleColors['autre']}`}>
        {alter.roleType}
      </span>
      <p className="text-sm text-muted-foreground font-ui mt-2">{alter.role}</p>
    </motion.div>
  );
}

function AlterModal({ alter, onClose, getAlterName }: { alter: Alter; onClose: () => void; getAlterName: (id: string) => string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scaleY: 0.1, scaleX: 0.85 }}
        animate={{ opacity: 1, scaleY: 1, scaleX: 1 }}
        exit={{ opacity: 0, scaleY: 0.1, scaleX: 0.85 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'top center' }}
        className="card-grimoire p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto scrollbar-dark relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Top seal line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent, hsla(40, 70%, 50%, 0.4), hsla(350, 60%, 45%, 0.3), hsla(40, 70%, 50%, 0.4), transparent)' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />

        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            {alter.avatar ? (
              <img src={alter.avatar} alt={alter.name} className="w-14 h-14 rounded-full object-cover border border-primary/20" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center font-display text-2xl text-primary">
                {alter.name[0]}
              </div>
            )}
            <div>
              <h2 className="font-display text-xl text-foreground text-glow">{alter.name}</h2>
              <p className="text-sm font-ui text-muted-foreground">{alter.pronouns} • {alter.apparentAge || '?'} ans</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>

        <div className="divider-ornate mb-4" />

        <div className="space-y-4">
          {[
            ['Rôle', alter.role],
            ['Type', alter.roleType],
            ['Personnalité', alter.personality],
            ['Forces', alter.strengths],
            ['Difficultés', alter.difficulties],
            ['Relations', alter.relations],
          ].map(([label, value], i) => value ? (
            <motion.div
              key={label as string}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.3 }}
            >
              <h4 className="text-xs font-ui text-gold uppercase tracking-widest mb-1">{label}</h4>
              <p className="text-sm font-body text-foreground/80">{value}</p>
            </motion.div>
          ) : null)}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AltersPage() {
  const { data, getAlterName } = useSystem();
  const [selectedAlter, setSelectedAlter] = useState<Alter | null>(null);
  const publicAlters = data.alters.filter(a => a.isPublic);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-display text-glow tracking-wider mb-2 animate-quill">Les Alters</h1>
        <motion.div className="divider-ornate w-32 mx-auto mb-2" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.6 }} />
        <motion.div className="flex justify-center mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <span className="text-[8px] text-gold/30 tracking-[0.5em] font-display">✦ ✦ ✦</span>
        </motion.div>
        <p className="text-muted-foreground font-body">Les voix qui composent notre système</p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {publicAlters.map(alter => (
          <AlterCard key={alter.id} alter={alter} onClick={() => setSelectedAlter(alter)} />
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedAlter && (
          <AlterModal alter={selectedAlter} onClose={() => setSelectedAlter(null)} getAlterName={getAlterName} />
        )}
      </AnimatePresence>
    </div>
  );
}
