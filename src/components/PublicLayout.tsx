import { ReactNode, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, BookOpen, Users, Map, Heart, Quote, Library, Clock, Brain, BookOpenCheck, Volume2, VolumeX, Shield, Menu, X } from 'lucide-react';
import { playPageTurn, playBookOpen, isSoundEnabled, toggleSound } from '@/lib/sounds';

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
];

type OpenPhase = 'cover' | 'opening' | 'open';

export default function PublicLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isFirstRender = useRef(true);
  const [soundOn, setSoundOn] = useState(isSoundEnabled);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Check if the grimoire was already opened this session
  const alreadyOpened = sessionStorage.getItem('grimoire-opened') === '1';
  const [phase, setPhase] = useState<OpenPhase>(alreadyOpened ? 'open' : 'cover');

  const handleOpenGrimoire = () => {
    setPhase('opening');
    playBookOpen();
    setTimeout(() => {
      setPhase('open');
      sessionStorage.setItem('grimoire-opened', '1');
    }, 1800);
  };

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

  // ═══════════════════════════════════════
  // COVER — closed grimoire
  // ═══════════════════════════════════════
  if (phase === 'cover') {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: "url('/images/bg-main.png')" }}
        />
        <div className="fixed inset-0 bg-overlay z-0" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 cursor-pointer group"
          onClick={handleOpenGrimoire}
        >
          {/* Book cover */}
          <div className="grimoire-cover w-[320px] sm:w-[400px] md:w-[480px] aspect-[3/4] flex flex-col items-center justify-center p-10 relative">
            {/* Ornamental corners */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t border-l border-gold/30" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t border-r border-gold/30" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b border-l border-gold/30" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b border-r border-gold/30" />

            {/* Central emblem */}
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="mb-6"
            >
              <BookOpenCheck className="w-12 h-12 text-gold drop-shadow-[0_0_15px_hsla(40,70%,50%,0.4)]" />
            </motion.div>

            {/* Ornamental divider */}
            <div className="w-24 h-px mb-4" style={{ background: 'linear-gradient(90deg, transparent, hsla(40, 70%, 50%, 0.5), transparent)' }} />

            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-gold tracking-[0.3em] text-center text-glow mb-2">
              GRIMOIRE
            </h1>

            <div className="w-24 h-px mt-2 mb-6" style={{ background: 'linear-gradient(90deg, transparent, hsla(40, 70%, 50%, 0.5), transparent)' }} />

            <span className="text-[8px] text-gold/25 font-display tracking-[0.5em] mb-8">✦ ✦ ✦</span>

            {/* Open prompt */}
            <motion.p
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="text-xs text-gold/50 font-body italic tracking-wider"
            >
              Touchez pour ouvrir…
            </motion.p>

            {/* Hover glow */}
            <div className="absolute inset-0 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{ boxShadow: '0 0 60px hsla(40, 70%, 50%, 0.15), inset 0 0 60px hsla(40, 70%, 50%, 0.05)' }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════
  // OPENING ANIMATION
  // ═══════════════════════════════════════
  if (phase === 'opening') {
    return (
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: "url('/images/bg-main.png')" }}
        />
        <div className="fixed inset-0 bg-overlay z-0" />

        <div className="relative z-10 flex items-center justify-center" style={{ perspective: '1200px' }}>
          {/* Left cover — swings open to the left */}
          <motion.div
            initial={{ rotateY: 0 }}
            animate={{ rotateY: -160 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
            className="grimoire-cover w-[240px] sm:w-[300px] aspect-[3/4] absolute flex items-center justify-center"
          >
            <div style={{ backfaceVisibility: 'hidden' }} className="absolute inset-0 flex items-center justify-center rounded">
              <BookOpenCheck className="w-10 h-10 text-gold/60" />
            </div>
          </motion.div>

          {/* Revealed pages — fade in */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 1.0, ease: 'easeOut' }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              <span className="text-[8px] text-gold/30 font-display tracking-[0.5em]">✦ ✦ ✦</span>
              <p className="text-gold/60 font-display text-lg tracking-[0.2em] mt-2">Le grimoire s'ouvre…</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Particles during opening */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full z-20"
            style={{
              left: `${30 + Math.random() * 40}%`,
              top: `${30 + Math.random() * 40}%`,
              background: i % 3 === 0
                ? 'hsla(40, 70%, 50%, 0.6)'
                : i % 3 === 1
                ? 'hsla(350, 60%, 45%, 0.4)'
                : 'hsla(270, 30%, 60%, 0.3)',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              x: (Math.random() - 0.5) * 200,
              y: (Math.random() - 0.5) * 200,
            }}
            transition={{ delay: 0.3 + i * 0.08, duration: 1.2, ease: 'easeOut' }}
          />
        ))}
      </div>
    );
  }

  // ═══════════════════════════════════════
  // OPEN — normal grimoire layout
  // ═══════════════════════════════════════
  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/images/bg-main.png')" }}
      />
      <div className="fixed inset-0 bg-overlay z-0" />

      {/* Book container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 flex-1 flex items-start justify-center px-2 sm:px-4 py-4 md:py-8"
      >
        <div className="w-full max-w-7xl flex flex-col lg:flex-row grimoire-book">
          
          {/* ═══ BOOK SPINE — left navigation ═══ */}
          <aside className="hidden lg:flex flex-col w-64 shrink-0 grimoire-spine-panel">
            {/* Book title */}
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

            {/* Table of contents */}
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
                        <motion.span
                          layoutId="toc-marker"
                          className="ml-auto text-[8px] text-gold/40 font-display"
                        >
                          ✦
                        </motion.span>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Spine footer */}
            <div className="p-4 border-t border-gold/10 flex items-center gap-3">
              <button
                onClick={() => setSoundOn(toggleSound())}
                className="text-muted-foreground hover:text-gold transition-colors"
                title={soundOn ? 'Couper les sons' : 'Activer les sons'}
              >
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
                <button
                  onClick={() => setSoundOn(toggleSound())}
                  className="text-muted-foreground hover:text-gold transition-colors p-1"
                >
                  {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors p-1">
                  <Shield className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setMobileNavOpen(!mobileNavOpen)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                >
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
                            isActive
                              ? 'text-gold bg-gold/10'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
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

            {/* Page ornamental top */}
            <div className="hidden lg:block h-px" style={{ background: 'linear-gradient(90deg, hsla(40, 70%, 50%, 0.2), hsla(40, 70%, 50%, 0.05) 50%, transparent)' }} />

            {/* Page content */}
            <AnimatePresence mode="wait">
              <motion.main
                key={location.pathname}
                initial={{ opacity: 0, rotateY: -4, scale: 0.98 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: 3, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{ perspective: '1200px', transformOrigin: 'left center' }}
                className="flex-1 p-4 md:p-8 overflow-y-auto"
              >
                {children}
              </motion.main>
            </AnimatePresence>

            {/* Page footer */}
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
  );
}
