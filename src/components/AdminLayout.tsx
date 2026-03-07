import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSystem } from '@/contexts/SystemContext';
import { Users, BookOpen, Quote, Library, Map, Clock, Activity, Heart, Settings, LogOut, Home, GitBranch } from 'lucide-react';

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
  { path: '/admin/systeme', label: 'Paramètres', icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { logout } = useSystem();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-border bg-card/50 backdrop-blur-sm">
        <div className="p-4 border-b border-border">
          <h2 className="font-display text-primary tracking-widest text-sm">ADMIN</h2>
        </div>
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto scrollbar-dark">
          {adminNav.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2.5 px-3 py-2 text-sm font-ui rounded transition-colors ${
                location.pathname === item.path
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-2 border-t border-border">
          <Link to="/" className="flex items-center gap-2.5 px-3 py-2 text-sm font-ui text-muted-foreground hover:text-foreground transition-colors rounded hover:bg-muted/30">
            <Home className="w-4 h-4" /> Voir le site
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2.5 px-3 py-2 text-sm font-ui text-destructive hover:bg-destructive/10 transition-colors rounded w-full">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex-1 flex flex-col">
        <header className="md:hidden border-b border-border bg-card/50 backdrop-blur-sm p-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-display text-primary tracking-widest text-sm">ADMIN</h2>
            <div className="flex gap-2">
              <Link to="/" className="text-muted-foreground hover:text-foreground"><Home className="w-4 h-4" /></Link>
              <button onClick={handleLogout} className="text-destructive"><LogOut className="w-4 h-4" /></button>
            </div>
          </div>
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

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
