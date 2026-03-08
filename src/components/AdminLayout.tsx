import { ReactNode, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSystem } from '@/contexts/SystemContext';
import { playPageTurn, isSoundEnabled, toggleSound } from '@/lib/sounds';
import { Users, BookOpen, Quote, Library, Map, Clock, Activity, Heart, Settings, LogOut, Home, GitBranch, Brain, BookOpenCheck, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const adminNav = [
  { path: '/admin', label: 'Tableau de bord', icon: Home },
  { path: '/admin/alters', label: 'Alters', icon: Users },
  { path: '/admin/journal', label: 'Journal', icon: BookOpen },
  { path: '/admin/citations', label: 'Citations', icon: Quote },
  { path: '/admin/ressources', label: 'Ressources', icon: Library },
  { path: '/admin/monde', label: 'Monde Intérieur', icon: Map },
  { path: '/admin/chronologie', label: 'Chronologie', icon: Clock },
  { path: '/admin/humeur', label: 'Suivi Humeur', icon: Heart },
  { path: '/admin/front', label: 'Front Tracker', icon: Activity },
  { path: '/admin/relations', label: 'Relations', icon: GitBranch },
  { path: '/admin/cartographie', label: 'Cartographie', icon: Brain },
  { path: '/admin/systeme', label: 'Paramètres', icon: Settings },
];

const sidebarItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: 0.3 + i * 0.04, duration: 0.3, ease: 'easeOut' as const },
  }),
};

type OpenPhase = 'cover' | 'opening' | 'open';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { logout } = useSystem();
  const location = useLocation();
  const navigate = useNavigate();
  const isFirstRender = useRef(true);
  const [soundOn, setSoundOn] = useState(isSoundEnabled);

  const alreadyOpened = sessionStorage.getItem('grimoire-admin-opened') === '1';
  const [phase, setPhase] = useState<OpenPhase>(alreadyOpened ? 'open' : 'cover');

  const handleOpenGrimoire = () => {
    setPhase('opening');
    import('@/lib/sounds').then(m => m.playBookOpen());
    setTimeout(() => {
      setPhase('open');
      sessionStorage.setItem('grimoire-admin-opened', '1');
    }, 1800);
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    playPageTurn();
  }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };

  // ═══════════════════════════════════════
  // COVER — closed grimoire
  // ═══════════════════════════════════════
  if (phase === 'cover') {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-background">
        <div className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0" style={{ backgroundImage: "url('/images/bg-main.png')" }} />
        <div className="fixed inset-0 bg-overlay z-0" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 cursor-pointer group"
          onClick={handleOpenGrimoire}
        >
          <div className="grimoire-cover w-[300px] sm:w-[380px] md:w-[440px] aspect-[3/4] flex flex-col items-center justify-center p-10 relative">
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
              <Settings className="w-10 h-10 text-gold drop-shadow-[0_0_15px_hsla(40,70%,50%,0.4)]" />
            </motion.div>

            <div className="w-24 h-px mb-4" style={{ background: 'linear-gradient(90deg, transparent, hsla(40, 70%, 50%, 0.5), transparent)' }} />

            <h1 className="font-display text-xl sm:text-2xl md:text-3xl text-gold tracking-[0.3em] text-center text-glow mb-1">
              GRIMOIRE
            </h1>
            <p className="text-[10px] text-primary/60 font-display tracking-[0.4em] uppercase mb-4">Administration</p>

            <div className="w-24 h-px mt-1 mb-6" style={{ background: 'linear-gradient(90deg, transparent, hsla(350, 60%, 45%, 0.4), transparent)' }} />

            <span className="text-[8px] text-gold/25 font-display tracking-[0.5em] mb-8">✦ ✦ ✦</span>

            <motion.p
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="text-xs text-gold/50 font-body italic tracking-wider"
            >
              Touchez pour ouvrir…
            </motion.p>

            <div className="absolute inset-0 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{ boxShadow: '0 0 60px hsla(350, 60%, 45%, 0.15), inset 0 0 60px hsla(40, 70%, 50%, 0.05)' }}
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
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-background">
        <div className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0" style={{ backgroundImage: "url('/images/bg-main.png')" }} />
        <div className="fixed inset-0 bg-overlay z-0" />

        <div className="relative z-10 flex items-center justify-center" style={{ perspective: '1200px' }}>
          <motion.div
            initial={{ rotateY: 0 }}
            animate={{ rotateY: -160 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
            className="grimoire-cover w-[220px] sm:w-[280px] aspect-[3/4] absolute flex items-center justify-center"
          >
            <div style={{ backfaceVisibility: 'hidden' }} className="absolute inset-0 flex items-center justify-center rounded">
              <Settings className="w-8 h-8 text-gold/60" />
            </div>
          </motion.div>

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
  // OPEN — normal admin layout
  // ═══════════════════════════════════════
  return (
    <div className="min-h-screen bg-background flex">
      {/* Grimoire Spine — Sidebar */}
      <motion.aside
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="hidden md:flex flex-col w-60 grimoire-spine"
      >
        {/* Book title plate */}
        <div className="p-4 border-b border-border relative">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotateY: [0, 180, 360] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <BookOpenCheck className="w-4 h-4 text-gold" />
            </motion.div>
            <h2 className="font-display text-gold tracking-[0.3em] text-xs">GRIMOIRE</h2>
          </div>
          <div className="divider-ornate mt-3" />
        </div>

        {/* Navigation chapters */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto scrollbar-dark">
          {adminNav.map((item, i) => (
            <motion.div
              key={item.path}
              custom={i}
              variants={sidebarItemVariants}
              initial="hidden"
              animate="visible"
            >
              <Link
                to={item.path}
                className={`grimoire-nav-link flex items-center gap-2.5 px-3 py-2 text-sm font-ui rounded transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'active text-primary bg-primary/10 shadow-[inset_0_0_20px_hsla(350,60%,45%,0.08)]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30 hover:pl-4'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Book back cover */}
        <div className="p-2 border-t border-border">
          <div className="divider-ornate mb-2" />
          <button
            onClick={() => setSoundOn(toggleSound())}
            className="flex items-center gap-2.5 px-3 py-2 text-sm font-ui text-muted-foreground hover:text-gold transition-colors rounded hover:bg-muted/30 w-full"
            title={soundOn ? 'Couper les sons' : 'Activer les sons'}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            {soundOn ? 'Sons activés' : 'Sons coupés'}
          </button>
          <Link to="/" className="flex items-center gap-2.5 px-3 py-2 text-sm font-ui text-muted-foreground hover:text-foreground transition-colors rounded hover:bg-muted/30">
            <Home className="w-4 h-4" /> Voir le site
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2.5 px-3 py-2 text-sm font-ui text-destructive hover:bg-destructive/10 transition-colors rounded w-full">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </motion.aside>

      {/* Mobile header */}
      <div className="flex-1 flex flex-col">
        <header className="md:hidden border-b border-border grimoire-spine p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BookOpenCheck className="w-4 h-4 text-gold" />
              <h2 className="font-display text-gold tracking-[0.3em] text-xs">GRIMOIRE</h2>
            </div>
            <div className="flex gap-2">
              <Link to="/" className="text-muted-foreground hover:text-foreground"><Home className="w-4 h-4" /></Link>
              <button onClick={handleLogout} className="text-destructive"><LogOut className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="divider-ornate mb-2" />
          <div className="flex overflow-x-auto gap-1 scrollbar-dark">
            {adminNav.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-ui whitespace-nowrap rounded transition-colors ${
                  location.pathname === item.path
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground'
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            ))}
          </div>
        </header>

        {/* Grimoire page — main content */}
        <main className="flex-1 grimoire-page overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, rotateY: -6, scale: 0.97 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: 4, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ perspective: '1000px', transformOrigin: 'left center' }}
              className="p-4 md:p-8 min-h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
