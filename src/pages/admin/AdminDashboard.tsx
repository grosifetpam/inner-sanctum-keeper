import { Link } from 'react-router-dom';
import { useSystem } from '@/contexts/SystemContext';
import { Users, BookOpen, Quote, Library, Map, Clock, Activity, Heart, GitBranch, Settings, Sparkles, Compass, PenLine, MessageCircle, Eye, Palette, Music, CheckCircle2, Circle, Trophy, HelpCircle, ScrollText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminPageHeader, containerVariants, itemVariants, AdminSectionCard } from '@/components/admin/AdminPageWrapper';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

const exercises = [
  {
    id: 'journal-libre',
    title: 'Écriture libre intérieure',
    icon: PenLine,
    duration: '10-15 min',
    description: 'Prenez un carnet et écrivez sans réfléchir. Laissez chaque alter s\'exprimer librement — changements d\'écriture, de ton ou de sujet sont bienvenus.',
    steps: [
      'Installez-vous dans un endroit calme',
      'Écrivez "Qui veut s\'exprimer aujourd\'hui ?" en haut de la page',
      'Laissez votre main écrire sans censure pendant 10 minutes',
      'Relisez et notez les changements de style ou de voix',
    ],
  },
  {
    id: 'dialogue-interieur',
    title: 'Dialogue intérieur',
    icon: MessageCircle,
    duration: '15-20 min',
    description: 'Engagez une conversation écrite avec un alter. Posez des questions et laissez les réponses venir naturellement.',
    steps: [
      'Choisissez un alter que vous souhaitez mieux connaître',
      'Écrivez-lui une question simple (ex: "Comment te sens-tu ?")',
      'Attendez une réponse intérieure et notez-la',
      'Continuez le dialogue sans juger les réponses',
    ],
  },
  {
    id: 'visualisation',
    title: 'Exploration du monde intérieur',
    icon: Eye,
    duration: '15-30 min',
    description: 'Fermez les yeux et visualisez votre espace intérieur. Explorez les lieux et rencontrez les alters qui s\'y trouvent.',
    steps: [
      'Fermez les yeux et respirez profondément 5 fois',
      'Imaginez une porte vers votre monde intérieur',
      'Explorez l\'espace — notez les lieux, couleurs, sensations',
      'Si un alter se présente, observez son apparence et son énergie',
    ],
  },
  {
    id: 'art-expressif',
    title: 'Art expressif',
    icon: Palette,
    duration: '20-30 min',
    description: 'Laissez chaque alter choisir des couleurs et dessiner librement. L\'art révèle ce que les mots ne peuvent pas dire.',
    steps: [
      'Préparez du matériel de dessin (crayons, peinture, etc.)',
      'Invitez un alter à choisir les couleurs qui lui parlent',
      'Dessinez sans objectif précis — formes, abstractions, symboles',
      'Notez quel alter s\'est exprimé et ce que le dessin évoque',
    ],
  },
  {
    id: 'playlist-alter',
    title: 'Playlist d\'identification',
    icon: Music,
    duration: '15-20 min',
    description: 'Écoutez différents styles de musique et notez les réactions intérieures. Chaque alter a souvent ses propres goûts.',
    steps: [
      'Créez une playlist variée (calme, énergique, triste, joyeuse)',
      'Écoutez chaque morceau et notez vos réactions émotionnelles',
      'Observez si certains morceaux "appellent" un alter spécifique',
      'Créez une mini-playlist pour chaque alter identifié',
    ],
  },
  {
    id: 'scan-corporel',
    title: 'Scan corporel conscient',
    icon: Compass,
    duration: '10-15 min',
    description: 'Les alters se manifestent souvent par des sensations corporelles. Ce scan aide à identifier ces signaux.',
    steps: [
      'Allongez-vous confortablement et fermez les yeux',
      'Scannez votre corps de la tête aux pieds',
      'Notez les zones de tension, chaleur ou picotements',
      'Demandez intérieurement : "Qui est présent dans cette sensation ?"',
    ],
  },
  {
    id: 'questions-decouverte',
    title: 'Questions pour découvrir un alter',
    icon: HelpCircle,
    duration: '20-30 min',
    description: 'Une série de questions ciblées à poser intérieurement ou par écrit pour faire connaissance avec un alter nouvellement perçu.',
    steps: [
      'Comment veux-tu qu\'on t\'appelle ?',
      'Quel âge as-tu (ou quel âge ressens-tu) ?',
      'Quels pronoms préfères-tu ?',
      'Quel est ton rôle dans le système ?',
      'Depuis combien de temps es-tu là ?',
      'Y a-t-il un lieu dans le monde intérieur qui est le tien ?',
      'Qu\'est-ce que tu aimes ? Qu\'est-ce que tu n\'aimes pas ?',
      'De quoi as-tu besoin en ce moment ?',
      'Y a-t-il des alters avec qui tu t\'entends bien (ou mal) ?',
      'Qu\'est-ce que tu aimerais que le système sache sur toi ?',
      'As-tu des souvenirs ou émotions que tu portes ?',
      'Comment te manifestes-tu (sensations, pensées, émotions) ?',
    ],
  },
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
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCompletions = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) { setLoading(false); return; }
      const { data: completions } = await supabase
        .from('exercise_completions')
        .select('exercise_id')
        .eq('user_id', session.session.user.id);
      if (completions) {
        setCompletedExercises(new Set(completions.map(c => c.exercise_id)));
      }
      setLoading(false);
    };
    fetchCompletions();
  }, []);

  const toggleExercise = async (exerciseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return;
    const userId = session.session.user.id;
    const isCompleted = completedExercises.has(exerciseId);

    if (isCompleted) {
      await supabase.from('exercise_completions').delete().eq('user_id', userId).eq('exercise_id', exerciseId);
      setCompletedExercises(prev => { const n = new Set(prev); n.delete(exerciseId); return n; });
      toast({ title: 'Exercice remis en cours' });
    } else {
      await supabase.from('exercise_completions').insert({ user_id: userId, exercise_id: exerciseId });
      setCompletedExercises(prev => new Set(prev).add(exerciseId));
      toast({ title: '✨ Exercice complété !' });
    }
  };

  const progressPercent = exercises.length > 0 ? Math.round((completedExercises.size / exercises.length) * 100) : 0;

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

      {/* Stats */}
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8"
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

      <motion.div
        className="mb-6 flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex-1 divider-ornate" />
        <span className="text-[10px] text-gold/40 font-display tracking-widest">EXERCICES DE DÉCOUVERTE</span>
        <div className="flex-1 divider-ornate" />
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="card-grimoire p-4 mb-4"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-gold" />
            <span className="text-xs font-ui text-foreground">Progression</span>
          </div>
          <span className="text-xs font-display text-gold">{completedExercises.size}/{exercises.length}</span>
        </div>
        <div className="w-full h-2 rounded-full bg-muted/50 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))' }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        {progressPercent === 100 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] text-gold/60 font-display tracking-widest text-center mt-2"
          >
            ✦ TOUS LES EXERCICES COMPLÉTÉS ✦
          </motion.p>
        )}
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {exercises.map((ex) => {
          const isCompleted = completedExercises.has(ex.id);
          return (
            <motion.div key={ex.id} variants={itemVariants}>
              <motion.button
                onClick={() => setExpandedExercise(expandedExercise === ex.id ? null : ex.id)}
                className={`card-grimoire p-4 w-full text-left relative overflow-hidden group hover-ember transition-all duration-300 hover:border-primary/30 ${isCompleted ? 'border-gold/20' : ''}`}
                layout
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {isCompleted && <div className="absolute inset-0 bg-gold/[0.03]" />}
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.2 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <ex.icon className={`w-5 h-5 flex-shrink-0 ${isCompleted ? 'text-gold/50' : 'text-gold'}`} />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-ui ${isCompleted ? 'text-foreground/60 line-through' : 'text-foreground'}`}>{ex.title}</h3>
                      <span className="text-[10px] text-muted-foreground font-ui">⏱ {ex.duration}</span>
                    </div>
                    <motion.div
                      onClick={(e) => toggleExercise(ex.id, e)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="cursor-pointer"
                    >
                      {isCompleted
                        ? <CheckCircle2 className="w-5 h-5 text-gold" />
                        : <Circle className="w-5 h-5 text-muted-foreground/40 hover:text-gold/60 transition-colors" />
                      }
                    </motion.div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{ex.description}</p>

                  <AnimatePresence>
                    {expandedExercise === ex.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <p className="text-[10px] text-gold/60 font-display tracking-widest mb-2">ÉTAPES</p>
                          <ol className="space-y-1.5">
                            {ex.steps.map((step, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="text-xs text-foreground/80 flex gap-2"
                              >
                                <span className="text-gold/50 font-display text-[10px] mt-0.5">{i + 1}.</span>
                                {step}
                              </motion.li>
                            ))}
                          </ol>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}