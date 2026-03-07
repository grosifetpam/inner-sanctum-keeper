import { Link } from 'react-router-dom';
import { useSystem } from '@/contexts/SystemContext';
import { Users, BookOpen, Quote, Library, Map, Clock, Activity, Heart, GitBranch, Settings } from 'lucide-react';

const shortcuts = [
  { path: '/admin/alters', label: 'Gérer les alters', icon: Users, desc: 'Ajouter, modifier, supprimer' },
  { path: '/admin/journal', label: 'Journal', icon: BookOpen, desc: 'Entrées chronologiques' },
  { path: '/admin/citations', label: 'Citations', icon: Quote, desc: 'Gérer les citations' },
  { path: '/admin/ressources', label: 'Ressources', icon: Library, desc: 'Livres, films, articles...' },
  { path: '/admin/monde', label: 'Monde Intérieur', icon: Map, desc: 'Lieux et cartographie' },
  { path: '/admin/chronologie', label: 'Chronologie', icon: Clock, desc: 'Événements du système' },
  { path: '/admin/humeur', label: 'Suivi d\'humeur', icon: Heart, desc: 'Enregistrer les humeurs' },
  { path: '/admin/front', label: 'Front Tracker', icon: Activity, desc: 'Qui est au front ?' },
  { path: '/admin/relations', label: 'Relations', icon: GitBranch, desc: 'Graphe des relations' },
  { path: '/admin/systeme', label: 'Paramètres', icon: Settings, desc: 'Infos du système' },
];

export default function AdminDashboard() {
  const { data, getAlterName } = useSystem();

  return (
    <div>
      <h1 className="text-2xl font-display text-foreground mb-6">Tableau de bord</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="card-grimoire p-4 text-center">
          <p className="text-2xl font-display text-foreground">{data.alters.length}</p>
          <p className="text-xs font-ui text-muted-foreground">Alters</p>
        </div>
        <div className="card-grimoire p-4 text-center">
          <p className="text-2xl font-display text-foreground">{data.journal.length}</p>
          <p className="text-xs font-ui text-muted-foreground">Entrées journal</p>
        </div>
        <div className="card-grimoire p-4 text-center">
          <p className="text-lg font-display text-foreground">{getAlterName(data.systemInfo.currentFrontAlterId)}</p>
          <p className="text-xs font-ui text-muted-foreground">Au front</p>
        </div>
        <div className="card-grimoire p-4 text-center">
          <p className="text-lg font-display text-foreground">{data.systemInfo.moodOfDay}</p>
          <p className="text-xs font-ui text-muted-foreground">Humeur</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {shortcuts.map(s => (
          <Link key={s.path} to={s.path} className="card-grimoire p-4 hover:border-primary/30 transition-all flex items-center gap-3">
            <s.icon className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <h3 className="text-sm font-ui text-foreground">{s.label}</h3>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
