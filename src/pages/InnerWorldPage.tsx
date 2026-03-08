import { useState } from 'react';
import { useSystem } from '@/contexts/SystemContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin } from 'lucide-react';
import type { InnerWorldPlace } from '@/types/system';

export default function InnerWorldPage() {
  const { data, getAlterName } = useSystem();
  const [selectedPlace, setSelectedPlace] = useState<InnerWorldPlace | null>(null);
  const publicPlaces = data.innerWorld.filter(p => p.isPublic);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display text-glow tracking-wider mb-2">Monde Intérieur</h1>
        <div className="divider-ornate w-32 mx-auto mb-4" />
        <p className="text-muted-foreground font-body">Les lieux qui composent notre paysage intérieur</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {publicPlaces.map(place => (
          <motion.div
            key={place.id}
            whileHover={{ y: -4 }}
            onClick={() => setSelectedPlace(place)}
            className="card-grimoire overflow-hidden cursor-pointer hover:border-primary/30 transition-all"
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
      </div>

      <AnimatePresence>
        {selectedPlace && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedPlace(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="card-grimoire overflow-hidden max-w-lg w-full"
              onClick={e => e.stopPropagation()}
            >
              {selectedPlace.image && (
                <img src={selectedPlace.image} alt={selectedPlace.name} className="w-full h-48 object-cover" />
              )}
              <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="font-display text-xl text-foreground">{selectedPlace.name}</h2>
                <button onClick={() => setSelectedPlace(null)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
              </div>
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
