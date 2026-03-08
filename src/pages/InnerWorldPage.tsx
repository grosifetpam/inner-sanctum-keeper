import { useState } from 'react';
import { useSystem } from '@/contexts/SystemContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin } from 'lucide-react';
import type { InnerWorldPlace } from '@/types/system';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function InnerWorldPage() {
  const { data, getAlterName } = useSystem();
  const [selectedPlace, setSelectedPlace] = useState<InnerWorldPlace | null>(null);
  const publicPlaces = data.innerWorld.filter(p => p.isPublic);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
        <h1 className="text-3xl font-display text-glow tracking-wider mb-2 animate-quill">Monde Intérieur</h1>
        <motion.div className="divider-ornate w-32 mx-auto mb-2" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.6 }} />
        <motion.div className="flex justify-center mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <span className="text-[8px] text-gold/30 tracking-[0.5em] font-display">✦ ✦ ✦</span>
        </motion.div>
        <p className="text-muted-foreground font-body">Les lieux qui composent notre paysage intérieur</p>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {publicPlaces.map(place => (
          <motion.div
            key={place.id}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            onClick={() => setSelectedPlace(place)}
            className="card-grimoire overflow-hidden cursor-pointer hover:border-primary/30 transition-all hover-ember"
          >
            {place.image && (
              <img src={place.image} alt={place.name} className="w-full h-40 object-cover" />
            )}
            <div className="p-5">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-display text-foreground mb-1">{place.name}</h3>
                  <p className="text-sm font-body text-foreground/60 line-clamp-2">{place.description}</p>
                  <div className="flex gap-1 mt-2">
                    {place.linkedAlterIds.map(id => (
                      <span key={id} className="text-xs font-ui bg-primary/10 text-primary px-2 py-0.5 rounded">
                        {getAlterName(id)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedPlace && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedPlace(null)}
          >
            <motion.div
              initial={{ opacity: 0, scaleY: 0.1, scaleX: 0.85 }}
              animate={{ opacity: 1, scaleY: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleY: 0.1, scaleX: 0.85 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'top center' }}
              className="card-grimoire overflow-hidden max-w-lg w-full relative"
              onClick={e => e.stopPropagation()}
            >
              <motion.div
                className="absolute top-0 left-0 right-0 h-[2px] z-10"
                style={{ background: 'linear-gradient(90deg, transparent, hsla(40, 70%, 50%, 0.4), hsla(350, 60%, 45%, 0.3), hsla(40, 70%, 50%, 0.4), transparent)' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              />
              {selectedPlace.image && (
                <img src={selectedPlace.image} alt={selectedPlace.name} className="w-full h-48 object-cover" />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="font-display text-xl text-foreground text-glow">{selectedPlace.name}</h2>
                  <button onClick={() => setSelectedPlace(null)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
                </div>
                <div className="divider-ornate mb-4" />
                <p className="font-body text-foreground/80 mb-4">{selectedPlace.description}</p>
                <h4 className="text-xs font-ui text-gold uppercase tracking-widest mb-1">Signification</h4>
                <p className="text-sm font-body text-foreground/70 mb-4">{selectedPlace.significance}</p>
                <h4 className="text-xs font-ui text-gold uppercase tracking-widest mb-1">Alters liés</h4>
                <div className="flex gap-2">
                  {selectedPlace.linkedAlterIds.map(id => (
                    <span key={id} className="text-sm font-ui text-primary">{getAlterName(id)}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
