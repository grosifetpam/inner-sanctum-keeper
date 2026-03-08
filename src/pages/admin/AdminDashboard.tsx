import { Link } from 'react-router-dom';
import { useSystem } from '@/contexts/SystemContext';
import { Users, BookOpen, Quote, Library, Map, Clock, Activity, Heart, GitBranch, Settings, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { AdminPageHeader, containerVariants, itemVariants, AdminSectionCard } from '@/components/admin/AdminPageWrapper';

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

const statVariants = {
  hidden: { opacity: 0, scale: 0.8, rotateX: -20 },
  visible: (i: number) => ({
    opacity: 1, scale: 1, rotateX: 0,
    transition: { delay: 0.2 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
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
      {/* Floating ember particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full pointer-events-none"
          style={{
            left: `${12 + i * 16}%`,
            top: `${5 + i * 10}%`,
            background: i % 2 === 0 ? 'hsla(40, 70%, 50%, 0.3)' : 'hsla(350, 60%, 45%, 0.25)',
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.15, 0.5, 0.15],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3.5 + i * 0.7,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
        />
      ))}

      <AdminPageHeader title="Tableau de bord" icon={Sparkles} />

      {/* Stats — grimoire page sections */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8" style={{ perspective: '600px' }}>
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={statVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="card-grimoire p-4 text-center hover-ember"
          >
            <p className={`${stat.accent ? 'text-lg' : 'text-2xl'} font-display text-foreground`}>
              {stat.value}
            </p>
            <p className="text-xs font-ui text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Ornamental divider */}
      <motion.div
        className="mb-6 flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex-1 divider-ornate" />
        <span className="text-[10px] text-gold/40 font-display tracking-widest">CHAPITRES</span>
        <div className="flex-1 divider-ornate" />
      </motion.div>

      {/* Shortcut grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        {shortcuts.map((s) => (
          <motion.div key={s.path} variants={itemVariants}>
            <Link
              to={s.path}
              className="card-grimoire p-4 flex items-center gap-3 group relative overflow-hidden block transition-all duration-300 hover:border-primary/30 hover-ember"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <motion.div
                whileHover={{ rotate: 15, scale: 1.2 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative z-10"
              >
                <s.icon className="w-5 h-5 text-gold flex-shrink-0" />
              </motion.div>
              <div className="relative z-10">
                <h3 className="text-sm font-ui text-foreground">{s.label}</h3>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
