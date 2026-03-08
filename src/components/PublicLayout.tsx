import { ReactNode, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, BookOpen, Users, Map, Heart, Quote, Library, Clock, Shield, Brain, BookOpenCheck } from 'lucide-react';
import { playPageTurn } from '@/lib/sounds';

const navItems = [
  { path: '/', label: 'Accueil', icon: Moon },
  { path: '/systeme', label: 'Le Système', icon: Heart },
  { path: '/alters', label: 'Les Alters', icon: Users },
  { path: '/journal', label: 'Journal', icon: BookOpen },
  { path: '/monde-interieur', label: 'Monde Intérieur', icon: Map },
  { path: '/citations', label: 'Citations', icon: Quote },
  { path: '/ressources', label: 'Ressources', icon: Library },
  { path: '/chronologie', label: 'Chronologie', icon: Clock },
  { path: '/cartographie', label: 'Cartographie', icon: Brain },
];

export default function PublicLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    playPageTurn();
  }, [location.pathname]);

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/images/bg-main.png')" }}
      />
      <div className="fixed inset-0 bg-overlay z-0" />

      {/* Navigation — Grimoire header */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 border-b border-border/50 backdrop-blur-md bg-background/40"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <motion.div
                animate={{ rotateY: [0, 180, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <BookOpenCheck className="w-4 h-4 text-gold" />
              </motion.div>
              <span className="font-display text-lg text-gold tracking-[0.2em]">
                GRIMOIRE
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.04, duration: 0.3 }}
                >
                  <Link
                    to={item.path}
                    className={`grimoire-nav-link px-3 py-2 text-sm font-ui tracking-wide transition-all duration-300 rounded ${
                      location.pathname === item.path
                        ? 'active text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors">
              <Shield className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile nav */}
          <div className="lg:hidden flex overflow-x-auto gap-1 pb-3 scrollbar-dark">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-ui whitespace-nowrap rounded transition-colors ${
                  location.pathname === item.path
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        {/* Bottom ornamental line */}
        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, hsla(40, 70%, 50%, 0.15), transparent)' }} />
      </motion.nav>

      {/* Content — page unfurl */}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, rotateY: -5, scale: 0.97 }}
          animate={{ opacity: 1, rotateY: 0, scale: 1 }}
          exit={{ opacity: 0, rotateY: 3, scale: 0.98 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ perspective: '1000px', transformOrigin: 'left center' }}
          className="relative z-10 container mx-auto px-4 py-8"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 py-6 mt-12">
        <div className="h-px mb-6" style={{ background: 'linear-gradient(90deg, transparent, hsla(40, 70%, 50%, 0.1), transparent)' }} />
        <div className="container mx-auto px-4 text-center">
          <span className="text-[8px] text-gold/20 tracking-[0.5em] font-display">✦ ✦ ✦</span>
          <p className="text-sm text-muted-foreground font-ui mt-2">Grimoire du Système • Documenté avec soin</p>
        </div>
      </footer>
    </div>
  );
}
