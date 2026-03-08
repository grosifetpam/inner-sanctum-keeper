import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpenCheck, Settings } from 'lucide-react';
import { playBookOpen } from '@/lib/sounds';

type Phase = 'cover' | 'opening' | 'open';

interface GrimoireOpeningProps {
  /** Unique key for sessionStorage persistence */
  storageKey: string;
  /** Title shown on the cover */
  title?: string;
  /** Subtitle below the title */
  subtitle?: string;
  /** Icon on the cover: 'book' or 'settings' */
  icon?: 'book' | 'settings';
  /** Children rendered once the grimoire is open */
  children: React.ReactNode;
}

// Particle positions are randomized once per mount
function useParticles(count: number) {
  return useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: 30 + Math.random() * 40,
      top: 30 + Math.random() * 40,
      dx: (Math.random() - 0.5) * 260,
      dy: (Math.random() - 0.5) * 260,
      color: i % 4 === 0
        ? 'hsla(40, 70%, 50%, 0.7)'
        : i % 4 === 1
        ? 'hsla(350, 60%, 45%, 0.5)'
        : i % 4 === 2
        ? 'hsla(270, 30%, 60%, 0.4)'
        : 'hsla(20, 80%, 50%, 0.3)',
      size: 1 + Math.random() * 2,
      delay: 0.2 + i * 0.06,
    })),
    [count],
  );
}

export default function GrimoireOpening({
  storageKey,
  title = 'GRIMOIRE',
  subtitle,
  icon = 'book',
  children,
}: GrimoireOpeningProps) {
  const alreadyOpened = sessionStorage.getItem(storageKey) === '1';
  const [phase, setPhase] = useState<Phase>(alreadyOpened ? 'open' : 'cover');

  const particles = useParticles(20);
  const IconComp = icon === 'settings' ? Settings : BookOpenCheck;

  const handleOpen = useCallback(() => {
    setPhase('opening');
    playBookOpen();
    setTimeout(() => {
      setPhase('open');
      sessionStorage.setItem(storageKey, '1');
    }, 2400);
  }, [storageKey]);

  // ── COVER ──
  if (phase === 'cover') {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-background">
        <div className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0" style={{ backgroundImage: "url('/images/bg-main.png')" }} />
        <div className="fixed inset-0 bg-overlay z-0" />

        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 cursor-pointer group"
          onClick={handleOpen}
          style={{ perspective: '1200px' }}
        >
          {/* Full book with visible spine */}
          <div className="relative flex">
            {/* Spine */}
            <div
              className="w-5 sm:w-6 shrink-0 rounded-l"
              style={{
                background: 'linear-gradient(180deg, hsla(40, 70%, 30%, 0.4), hsla(270, 15%, 10%, 0.9), hsla(40, 70%, 30%, 0.3))',
                borderRight: '1px solid hsla(40, 70%, 50%, 0.15)',
                boxShadow: 'inset -2px 0 8px hsla(0,0%,0%,0.3)',
              }}
            />

            {/* Front cover */}
            <div className="grimoire-cover w-[280px] sm:w-[360px] md:w-[420px] aspect-[3/4] flex flex-col items-center justify-center p-8 relative" style={{ borderLeft: 'none', borderRadius: '0 12px 12px 0' }}>
              {/* Ornamental corners */}
              <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-gold/20" />
              <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-gold/20" />
              <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-gold/20" />
              <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-gold/20" />

              {/* Inner frame */}
              <div className="absolute inset-8 border border-gold/8 rounded pointer-events-none" />

              {/* Central emblem */}
              <motion.div
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="mb-4"
              >
                <IconComp className="w-12 h-12 text-gold drop-shadow-[0_0_20px_hsla(40,70%,50%,0.5)]" />
              </motion.div>

              {/* Ornamental line */}
              <div className="w-28 h-px mb-3" style={{ background: 'linear-gradient(90deg, transparent, hsla(40, 70%, 50%, 0.6), transparent)' }} />

              <h1 className="font-display text-xl sm:text-2xl md:text-3xl text-gold tracking-[0.35em] text-center text-glow mb-1">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[10px] text-primary/50 font-display tracking-[0.4em] uppercase">{subtitle}</p>
              )}

              <div className="w-28 h-px mt-3 mb-4" style={{ background: 'linear-gradient(90deg, transparent, hsla(350, 60%, 45%, 0.4), transparent)' }} />

              {/* Seal emblem */}
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="mb-4 opacity-20"
              >
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="18" stroke="hsla(40, 70%, 50%, 0.5)" strokeWidth="0.5" />
                  <circle cx="20" cy="20" r="14" stroke="hsla(40, 70%, 50%, 0.3)" strokeWidth="0.5" />
                  <path d="M20 2 L22 18 L20 20 L18 18 Z" fill="hsla(40, 70%, 50%, 0.3)" />
                  <path d="M38 20 L22 22 L20 20 L22 18 Z" fill="hsla(40, 70%, 50%, 0.3)" />
                  <path d="M20 38 L18 22 L20 20 L22 22 Z" fill="hsla(40, 70%, 50%, 0.3)" />
                  <path d="M2 20 L18 18 L20 20 L18 22 Z" fill="hsla(40, 70%, 50%, 0.3)" />
                </svg>
              </motion.div>

              <span className="text-[8px] text-gold/20 font-display tracking-[0.5em] mb-6">✦ ✦ ✦</span>

              {/* Clasp */}
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="flex flex-col items-center"
              >
                <div className="w-8 h-1 rounded-full mb-1.5" style={{ background: 'linear-gradient(90deg, transparent, hsla(40, 70%, 50%, 0.4), transparent)' }} />
                <p className="text-[11px] text-gold/40 font-body italic tracking-wider">
                  Touchez pour ouvrir…
                </p>
              </motion.div>

              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-r-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ boxShadow: '0 0 80px hsla(40, 70%, 50%, 0.12), 0 0 40px hsla(350, 60%, 45%, 0.08), inset 0 0 60px hsla(40, 70%, 50%, 0.04)' }}
              />
            </div>
          </div>

          {/* Shadow under the book */}
          <div
            className="absolute -bottom-4 left-4 right-4 h-8 rounded-full"
            style={{ background: 'radial-gradient(ellipse, hsla(0,0%,0%,0.5) 0%, transparent 70%)', filter: 'blur(8px)' }}
          />
        </motion.div>
      </div>
    );
  }

  // ── OPENING ANIMATION ──
  if (phase === 'opening') {
    return (
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-background">
        <div className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0" style={{ backgroundImage: "url('/images/bg-main.png')" }} />
        <div className="fixed inset-0 bg-overlay z-0" />

        <div className="relative z-10 flex items-center justify-center" style={{ perspective: '1400px' }}>
          {/* ── LEFT COVER swings open ── */}
          <motion.div
            initial={{ rotateY: 0 }}
            animate={{ rotateY: -170 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
            className="grimoire-cover w-[200px] sm:w-[260px] md:w-[300px] aspect-[3/4] absolute flex items-center justify-center z-30"
          >
            {/* Front face */}
            <div style={{ backfaceVisibility: 'hidden' }} className="absolute inset-0 flex flex-col items-center justify-center rounded-r-xl">
              <IconComp className="w-8 h-8 text-gold/50" />
              <div className="w-12 h-px mt-3" style={{ background: 'linear-gradient(90deg, transparent, hsla(40, 70%, 50%, 0.3), transparent)' }} />
            </div>
            {/* Back face (inner cover) */}
            <div
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              className="absolute inset-0 rounded-l-xl"
            >
              <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, hsla(30, 20%, 15%, 1), hsla(30, 15%, 12%, 1))' }} />
            </div>
          </motion.div>

          {/* ── PAGES flipping ── */}
          {[0, 1, 2].map(i => (
            <motion.div
              key={`page-${i}`}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: -160 + i * 5 }}
              transition={{ duration: 1.3, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
              className="absolute w-[190px] sm:w-[248px] md:w-[288px] aspect-[3/4] z-20 rounded-r"
              aria-hidden
            >
              <div
                style={{ backfaceVisibility: 'hidden' }}
                className="absolute inset-0 rounded-r"
              >
                <div className="w-full h-full rounded-r" style={{
                  background: `linear-gradient(135deg, hsla(30, 12%, ${16 + i * 2}%, 0.95), hsla(30, 8%, ${13 + i * 2}%, 0.95))`,
                  borderRight: '1px solid hsla(40, 70%, 50%, 0.05)',
                }}>
                  {/* Fake text lines */}
                  <div className="p-6 pt-10 space-y-3 opacity-20">
                    {Array.from({ length: 6 + i }, (_, j) => (
                      <div key={j} className="h-px" style={{
                        width: `${50 + Math.random() * 40}%`,
                        background: 'hsla(40, 30%, 50%, 0.3)',
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* ── REVEALED PAGE (right page) ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 1.2, ease: 'easeOut' }}
            className="relative z-10 w-[190px] sm:w-[248px] md:w-[288px] aspect-[3/4] rounded-r-xl flex flex-col items-center justify-center"
            style={{ background: 'linear-gradient(135deg, hsla(30, 12%, 14%, 0.9), hsla(30, 8%, 11%, 0.9))' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6, ease: 'easeOut' }}
              className="text-center px-6"
            >
              <span className="text-[8px] text-gold/30 font-display tracking-[0.5em]">✦ ✦ ✦</span>
              <p className="text-gold/60 font-display text-base sm:text-lg tracking-[0.15em] mt-3 mb-2">
                Le grimoire s'ouvre…
              </p>
              <div className="w-20 h-px mx-auto" style={{ background: 'linear-gradient(90deg, transparent, hsla(40, 70%, 50%, 0.3), transparent)' }} />
            </motion.div>

            {/* Loading indicator */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 1.6, ease: 'easeInOut' }}
              className="absolute bottom-8 left-8 right-8 h-px origin-left"
              style={{ background: 'linear-gradient(90deg, hsla(40, 70%, 50%, 0.3), hsla(350, 60%, 45%, 0.2), transparent)' }}
            />
          </motion.div>
        </div>

        {/* ── PARTICLES ── */}
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute rounded-full z-40 pointer-events-none"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              background: p.color,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 2, 0],
              x: p.dx,
              y: p.dy,
            }}
            transition={{ delay: p.delay, duration: 1.5, ease: 'easeOut' }}
          />
        ))}

        {/* ── LIGHT RAYS ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.15, 0] }}
          transition={{ delay: 0.4, duration: 2 }}
          className="fixed inset-0 z-20 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, hsla(40, 70%, 50%, 0.1) 0%, transparent 60%)',
          }}
        />
      </div>
    );
  }

  // ── OPEN → render children ──
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="grimoire-open"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
