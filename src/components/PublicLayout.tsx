import { ReactNode, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTurnTransition from '@/components/PageTurnTransition';
import { Moon, BookOpen, Users, Map, Heart, Quote, Library, Clock, Brain, BookOpenCheck, Volume2, VolumeX, Shield, Menu, X, ScrollText, ShieldAlert } from 'lucide-react';
import { playPageTurn, isSoundEnabled, toggleSound } from '@/lib/sounds';
import GrimoireOpening from '@/components/GrimoireOpening';
import AmbientParticles from '@/components/AmbientParticles';

const navItems = [
  { path: '/', label: 'Accueil', icon: Moon },
  { path: '/systeme', label: 'Le Système', icon: Heart },
  { path: '/alters', label: 'Les Alters', icon: Users },
  { path: '/journal', label: 'Journal', icon: BookOpen },
  { path: '/monde-interieur', label: 'Monde Intérieur', icon: Map },
  { path: '/citations', label: 'Citations', icon: Quote },
  { path: '/ressources', label: 'Ressources', icon: Library },
  { path: '/lexique', label: 'Lexique', icon: BookOpenCheck },
  { path: '/chronologie', label: 'Chronologie', icon: Clock },
  { path: '/cartographie', label: 'Cartographie', icon: Brain },
  { path: '/reglement', label: 'Règlement', icon: ScrollText },
];

export default function PublicLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isFirstRender = useRef(true);
  const [soundOn, setSoundOn] = useState(isSoundEnabled);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    playPageTurn();
  }, [location.pathname]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <GrimoireOpening storageKey="grimoire-opened" title="GRIMOIRE" icon="book">
      <div className="min-h-screen relative flex flex-col">
        {/* Background */}
        <div className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0" style={{ backgroundImage: "url('/images/bg-main.png')" }} />
        <div className="fixed inset-0 bg-overlay z-0" />
        <AmbientParticles count={18} />

        {/* Book container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 flex-1 flex items-start justify-center px-2 sm:px-4 py-4 md:py-8"
        >
          <div className="w-full max-w-7xl flex flex-col lg:flex-row grimoire-book relative">
            {/* Ornamental gold corners */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-gold/20 rounded-tl pointer-events-none z-20" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-gold/20 rounded-tr pointer-events-none z-20" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-gold/20 rounded-bl pointer-events-none z-20" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-gold/20 rounded-br pointer-events-none z-20" />
            <div className="absolute inset-6 border border-gold/5 rounded pointer-events-none z-20" />

            {/* ═══ BOOK SPINE — left navigation ═══ */}
            <aside className="hidden lg:flex flex-col w-64 shrink-0 grimoire-spine-panel">
              <div className="p-5 border-b border-gold/10">
                <Link to="/" className="flex items-center gap-2.5 group">
                  <motion.div
                    animate={{ rotateY: [0, 180, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <BookOpenCheck className="w-5 h-5 text-gold" />
                  </motion.div>
                  <span className="font-display text-base text-gold tracking-[0.2em] group-hover:text-gold/80 transition-colors">
                    GRIMOIRE
                  </span>
                </Link>
                <div className="mt-3 h-px" style={{ background: 'linear-gradient(90deg, hsla(40, 70%, 50%, 0.3), transparent)' }} />
              </div>

              <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto scrollbar-dark">
                <p className="text-[9px] text-gold/30 font-display tracking-[0.4em] uppercase px-2 mb-3">Sommaire</p>
                {navItems.map((item, i) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.04, duration: 0.3 }}
                    >
                      <Link
                        to={item.path}
                        className={`grimoire-toc-link flex items-center gap-2.5 px-3 py-2 rounded text-sm font-body transition-all duration-300 ${
                          isActive
                            ? 'text-gold bg-gold/8 border-l-2 border-gold/40'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/20 border-l-2 border-transparent'
                        }`}
                      >
                        <item.icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-gold' : ''}`} />
                        <span className="tracking-wide">{item.label}</span>
                        {isActive && (
                          <motion.span layoutId="toc-marker" className="ml-auto text-[8px] text-gold/40 font-display">✦</motion.span>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-gold/10 flex items-center gap-3">
                <button onClick={() => setSoundOn(toggleSound())} className="text-muted-foreground hover:text-gold transition-colors" title={soundOn ? 'Couper les sons' : 'Activer les sons'}>
                  {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>
                <Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                  <Shield className="w-3.5 h-3.5" />
                </Link>
                <span className="ml-auto text-[7px] text-gold/15 font-display tracking-[0.3em]">✦✦✦</span>
              </div>
            </aside>

            {/* ═══ BOOK PAGE — main content ═══ */}
            <div className="flex-1 flex flex-col grimoire-page-panel">
              {/* Mobile header */}
              <div className="lg:hidden flex items-center justify-between p-3 border-b border-border/30">
                <Link to="/" className="flex items-center gap-2">
                  <BookOpenCheck className="w-4 h-4 text-gold" />
                  <span className="font-display text-sm text-gold tracking-[0.2em]">GRIMOIRE</span>
                </Link>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSoundOn(toggleSound())} className="text-muted-foreground hover:text-gold transition-colors p-1">
                    {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                  <Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors p-1">
                    <Shield className="w-4 h-4" />
                  </Link>
                  <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                    {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Mobile nav dropdown */}
              <AnimatePresence>
                {mobileNavOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="lg:hidden overflow-hidden border-b border-border/30 bg-card/60 backdrop-blur-sm"
                  >
                    <div className="p-3 grid grid-cols-2 gap-1">
                      {navItems.map(item => {
                        const isActive = location.pathname === item.path;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-2 px-3 py-2 text-xs font-body rounded transition-colors ${
                              isActive ? 'text-gold bg-gold/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
                            }`}
                          >
                            <item.icon className="w-3.5 h-3.5 shrink-0" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="hidden lg:block h-px" style={{ background: 'linear-gradient(90deg, hsla(40, 70%, 50%, 0.2), hsla(40, 70%, 50%, 0.05) 50%, transparent)' }} />

              <PageTurnTransition className="flex-1 overflow-y-auto">
                <div className="p-4 md:p-8">
                  {children}
                </div>
              </PageTurnTransition>

              <div className="border-t border-border/20 py-4 px-6">
                <div className="h-px mb-3" style={{ background: 'linear-gradient(90deg, transparent, hsla(40, 70%, 50%, 0.1), transparent)' }} />
                <div className="text-center">
                  <span className="text-[7px] text-gold/15 tracking-[0.5em] font-display">✦ ✦ ✦</span>
                  <p className="text-xs text-muted-foreground/50 font-ui mt-1">Grimoire du Système • Documenté avec soin</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </GrimoireOpening>
  );
}
