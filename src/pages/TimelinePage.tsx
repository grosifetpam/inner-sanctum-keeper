import { useSystem } from '@/contexts/SystemContext';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

export default function TimelinePage() {
  const { data, getAlterName } = useSystem();
  const publicEvents = data.timeline
    .filter(t => t.isPublic)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Chronologie" subtitle="Les événements gravés dans le temps" icon={Clock} chapter="Chapitre V" />

      <div className="relative">
        {/* Timeline spine with rune markers */}
        <motion.div
          className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px"
          style={{ background: 'linear-gradient(180deg, transparent, hsla(40, 70%, 50%, 0.3), hsla(350, 60%, 45%, 0.2), hsla(40, 70%, 50%, 0.15), transparent)', transformOrigin: 'top' }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
        />

        {publicEvents.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20, filter: 'blur(3px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
            className={`relative flex mb-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
          >
            {/* Timeline dot with glow */}
            <motion.div
              className="absolute left-4 md:left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1.5 mt-5 z-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 300 }}
              style={{ boxShadow: '0 0 12px hsla(350, 60%, 45%, 0.5), 0 0 4px hsla(40, 70%, 50%, 0.3)' }}
            />
            <div className={`ml-10 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-10' : 'md:pl-10'}`}>
              <motion.div
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="card-grimoire rune-corners p-4 hover-ember"
              >
                <p className="text-xs font-ui text-gold mb-1">{event.date}</p>
                <h3 className="font-display text-foreground mb-1">{event.title}</h3>
                <p className="text-sm font-body text-foreground/70 leading-relaxed">{event.description}</p>
                {event.alterId && (
                  <p className="text-xs font-ui text-muted-foreground mt-2">Alter : {getAlterName(event.alterId)}</p>
                )}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {publicEvents.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground font-body italic">La chronique n'a pas encore été écrite…</p>
        </div>
      )}
    </div>
  );
}
