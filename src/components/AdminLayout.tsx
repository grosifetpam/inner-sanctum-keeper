import { ReactNode, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSystem } from '@/contexts/SystemContext';
import { playPageTurn, isSoundEnabled, toggleSound } from '@/lib/sounds';
import { Users, BookOpen, Quote, Library, Map, Clock, Activity, Heart, Settings, LogOut, Home, GitBranch, Brain, BookOpenCheck, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GrimoireOpening from '@/components/GrimoireOpening';

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

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { logout } = useSystem();
  const location = useLocation();
  const navigate = useNavigate();
  const isFirstRender = useRef(true);
  const [soundOn, setSoundOn] = useState(isSoundEnabled);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    playPageTurn();
  }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <GrimoireOpening storageKey="grimoire-admin-opened" title="GRIMOIRE" subtitle="Administration" icon="settings">
      <div className="min-h-screen relative flex flex-col">
        {/* Background */}
        <div className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0" style={{ backgroundImage: "url('/images/bg-main.png')" }} />
        <div className="fixed inset-0 bg-overlay z-0" />

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 flex-1 flex items-start justify-center px-2 sm:px-4 py-4 md:py-8"
        >
          <div className="w-full max-w-7xl flex flex-col md:flex-row grimoire-book">

        {/* Grimoire Spine — Sidebar */}
        <motion.aside
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="hidden md:flex flex-col w-60 grimoire-spine-panel"
        >
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

          <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto scrollbar-dark">
            {adminNav.map((item, i) => (
              <motion.div key={item.path} custom={i} variants={sidebarItemVariants} initial="hidden" animate="visible">
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
                    location.pathname === item.path ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              ))}
            </div>
          </header>

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
    </GrimoireOpening>
  );
}
