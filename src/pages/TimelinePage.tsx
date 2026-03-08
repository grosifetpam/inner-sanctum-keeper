import { useSystem } from '@/contexts/SystemContext';
import { motion } from 'framer-motion';

export default function TimelinePage() {
  const { data, getAlterName } = useSystem();
  const publicEvents = data.timeline
    .filter(t => t.isPublic)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
        <h1 className="text-3xl font-display text-glow tracking-wider mb-2 animate-quill">Chronologie</h1>
        <motion.div className="divider-ornate w-32 mx-auto mb-2" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.6 }} />
        <motion.div className="flex justify-center mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <span className="text-[8px] text-gold/30 tracking-[0.5em] font-display">✦ ✦ ✦</span>
        </motion.div>
      </motion.div>

      <div className="relative">
        {/* Timeline spine */}
        <motion.div
          className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px"
          style={{ background: 'linear-gradient(180deg, transparent, hsla(40, 70%, 50%, 0.3), hsla(350, 60%, 45%, 0.2), transparent)' }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
          style-={{ transformOrigin: 'top' }}
        />

        {publicEvents.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20, filter: 'blur(3px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
            className={`relative flex mb-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
          >
            {/* Timeline dot */}
            <motion.div
              className="absolute left-4 md:left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1.5 mt-5 z-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 300 }}
              style={{ boxShadow: '0 0 10px hsla(350, 60%, 45%, 0.4)' }}
            />
            <div className={`ml-10 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-10' : 'md:pl-10'}`}>
              <motion.div
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="card-grimoire p-4 hover-ember"
              >
                <p className="text-xs font-ui text-gold mb-1">{event.date}</p>
                <h3 className="font-display text-foreground mb-1">{event.title}</h3>
                <p className="text-sm font-body text-foreground/70">{event.description}</p>
                {event.alterId && (
                  <p className="text-xs font-ui text-muted-foreground mt-2">Alter : {getAlterName(event.alterId)}</p>
                )}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
