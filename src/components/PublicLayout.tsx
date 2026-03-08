import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Moon, BookOpen, Users, Map, Heart, Quote, Library, Clock, Shield, Brain } from 'lucide-react';

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

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/images/bg-main.png')" }}
      />
      <div className="fixed inset-0 bg-overlay z-0" />

      {/* Navigation */}
      <nav className="relative z-20 border-b border-border/50 backdrop-blur-md bg-background/40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="font-display text-lg text-primary tracking-widest">
              GRIMOIRE
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 text-sm font-ui tracking-wide transition-colors rounded ${
                    location.pathname === item.path
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  }`}
                >
                  {item.label}
                </Link>
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
      </nav>

      {/* Content */}
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 container mx-auto px-4 py-8"
      >
        {children}
      </motion.main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground font-ui">
          <p>Grimoire du Système • Documenté avec soin</p>
        </div>
      </footer>
    </div>
  );
}
