import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  drift: number;
}

export default function AmbientParticles({ count = 15 }: { count?: number }) {
  const particles = useMemo<Particle[]>(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 5,
      drift: (Math.random() - 0.5) * 40,
      color: i % 5 === 0
        ? 'hsla(40, 70%, 50%, 0.3)'
        : i % 5 === 1
        ? 'hsla(350, 60%, 45%, 0.2)'
        : i % 5 === 2
        ? 'hsla(270, 30%, 60%, 0.15)'
        : i % 5 === 3
        ? 'hsla(20, 80%, 50%, 0.2)'
        : 'hsla(220, 30%, 75%, 0.15)',
    })),
    [count],
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden" aria-hidden>
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
          animate={{
            y: [0, -60, -20, -80, 0],
            x: [0, p.drift, -p.drift / 2, p.drift / 3, 0],
            opacity: [0, 0.6, 0.3, 0.7, 0],
            scale: [0.5, 1.2, 0.8, 1, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
