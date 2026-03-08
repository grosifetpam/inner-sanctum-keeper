import { Link } from 'react-router-dom';
import { useSystem } from '@/contexts/SystemContext';
import { Users, BookOpen, Quote, Library, Map, Clock, Activity, Heart, GitBranch, Settings, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function AdminDashboard() {
  const { data, getAlterName } = useSystem();

  const stats = [
    { value: data.alters.length, label: 'Alters', accent: false },
    { value: data.journal.length, label: 'Entrées journal', accent: false },
    { value: getAlterName(data.systemInfo.currentFrontAlterId), label: 'Au front', accent: true },
    { value: data.systemInfo.moodOfDay, label: 'Humeur', accent: true },
  ];

  return (
    <div className="relative">
      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30 pointer-events-none"
          style={{ left: `${15 + i * 18}%`, top: `${10 + i * 12}%` }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.4,
          }}
        />
      ))}

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-8"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles className="w-6 h-6 text-primary" />
        </motion.div>
        <h1 className="text-2xl font-display text-foreground text-glow">Tableau de bord</h1>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -2 }}
            className="card-grimoire p-4 text-center relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <p className={`${stat.accent ? 'text-lg' : 'text-2xl'} font-display text-foreground relative z-10`}>
              {stat.value}
            </p>
            <p className="text-xs font-ui text-muted-foreground relative z-10">{stat.label}</p>
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Shortcut grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        {shortcuts.map((s, i) => (
          <motion.div key={s.path} variants={itemVariants}>
            <Link
              to={s.path}
              className="card-grimoire p-4 flex items-center gap-3 group relative overflow-hidden block transition-all duration-300 hover:border-primary/30"
            >
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.div
                whileHover={{ rotate: 12, scale: 1.15 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative z-10"
              >
                <s.icon className="w-5 h-5 text-primary flex-shrink-0" />
              </motion.div>
              <div className="relative z-10">
                <h3 className="text-sm font-ui text-foreground">{s.label}</h3>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
