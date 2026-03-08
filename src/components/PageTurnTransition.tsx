import { ReactNode, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTurnTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Realistic grimoire page-turn transition.
 * Uses a 3D flip with shadow & fold effect.
 */
export default function PageTurnTransition({ children, className = '' }: PageTurnTransitionProps) {
  const location = useLocation();
  const [direction, setDirection] = useState<1 | -1>(1);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    // Determine flip direction based on simple heuristic
    const prev = prevPath.current;
    const next = location.pathname;
    setDirection(next > prev ? 1 : -1);
    prevPath.current = next;
  }, [location.pathname]);

  return (
    <div className={`relative ${className}`} style={{ perspective: '2000px' }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial="enter"
          animate="center"
          exit="exit"
          variants={{
            enter: {
              rotateY: direction > 0 ? -90 : 90,
              opacity: 0,
              scale: 0.95,
              boxShadow: '0 0 0px rgba(0,0,0,0)',
            },
            center: {
              rotateY: 0,
              opacity: 1,
              scale: 1,
              boxShadow: '0 0 0px rgba(0,0,0,0)',
              transition: {
                rotateY: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.4, ease: 'easeOut' },
                scale: { duration: 0.5, ease: 'easeOut' },
              },
            },
            exit: {
              rotateY: direction > 0 ? 45 : -45,
              opacity: 0,
              scale: 0.97,
              boxShadow: direction > 0
                ? '-30px 0 60px -10px rgba(0,0,0,0.4)'
                : '30px 0 60px -10px rgba(0,0,0,0.4)',
              transition: {
                rotateY: { duration: 0.5, ease: [0.55, 0, 1, 0.45] },
                opacity: { duration: 0.35, delay: 0.1 },
                scale: { duration: 0.4 },
                boxShadow: { duration: 0.5 },
              },
            },
          }}
          style={{
            transformOrigin: direction > 0 ? 'left center' : 'right center',
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
          }}
          className="w-full"
        >
          {/* Page fold shadow overlay during animation */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-10 rounded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            exit={{
              opacity: 1,
              transition: { duration: 0.3 },
            }}
            style={{
              background: direction > 0
                ? 'linear-gradient(to left, transparent 70%, rgba(0,0,0,0.15) 100%)'
                : 'linear-gradient(to right, transparent 70%, rgba(0,0,0,0.15) 100%)',
            }}
          />
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
