import { Link } from 'react-router-dom';
import { useSystem } from '@/contexts/SystemContext';
import { motion } from 'framer-motion';
import { Users, BookOpen, Map, Quote, Moon } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, filter: 'blur(3px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function HomePage() {
  const { data, getAlterName } = useSystem();
  const { systemInfo, alters, journal, citations } = data;

  const publicAlters = alters.filter(a => a.isPublic);
  const publicJournal = journal.filter(j => j.isPublic && !j.isPrivateAlterJournal);
  const lastEntry = publicJournal[publicJournal.length - 1];
  const publicCitations = citations.filter(c => c.isPublic);
  const lastCitation = publicCitations[publicCitations.length - 1];
  const frontAlter = alters.find(a => a.id === systemInfo.currentFrontAlterId);

  return (
    <div className="max-w-4xl mx-auto space-y-10 relative">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center py-12 relative"
      >
        {/* Mystical moon emblem */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 150 }}
          className="mx-auto mb-4 w-16 h-16 rounded-full border border-gold/20 flex items-center justify-center relative"
          style={{ boxShadow: '0 0 40px hsla(40, 70%, 50%, 0.15), inset 0 0 20px hsla(270, 30%, 20%, 0.3)' }}
        >
          <Moon className="w-7 h-7 text-gold/60" />
          <motion.div
            className="absolute inset-0 rounded-full border border-gold/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>

        {/* Rune decoration */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[9px] font-display text-gold/20 tracking-[0.8em] mb-4 select-none"
        >
          ᚦ ᚢ ᚱ ᛊ ᚨ ᛉ
        </motion.p>

        <motion.h1 className="text-4xl md:text-6xl font-display text-glow tracking-wider mb-4 animate-quill">
          {systemInfo.name}
        </motion.h1>

        {/* Moon phase divider */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <motion.div
            className="h-px w-20"
            style={{ background: 'linear-gradient(90deg, transparent, hsla(40, 70%, 50%, 0.4))' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[9px] text-gold/25 tracking-[0.2em]"
          >
            🌑 ◦ 🌒 ◦ 🌕 ◦ 🌘 ◦ 🌑
          </motion.span>
          <motion.div
            className="h-px w-20"
            style={{ background: 'linear-gradient(90deg, hsla(40, 70%, 50%, 0.4), transparent)' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-lg text-foreground/80 font-body max-w-xl mx-auto leading-relaxed"
        >
          {systemInfo.description}
        </motion.p>

        {/* Homepage image */}
        {systemInfo.homepageImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-8 mx-auto max-w-2xl"
          >
            <div className="card-grimoire rune-corners p-2 overflow-hidden aura-glow">
              <img
                src={systemInfo.homepageImage}
                alt={systemInfo.name}
                className="w-full h-auto rounded object-cover max-h-80"
              />
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Serpent divider */}
      <div className="divider-serpent" />

      {/* Stats row */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Alters', value: publicAlters.length, icon: Users },
          { label: 'Au front', value: frontAlter?.name || '—', icon: null },
          { label: 'Humeur', value: systemInfo.moodOfDay, icon: null },
          { label: 'Entrées', value: publicJournal.length, icon: BookOpen },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="card-grimoire rune-corners p-4 text-center hover-ember"
          >
            <p className="text-xs font-ui text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-xl font-display text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Last journal entry */}
      {lastEntry && (
        <motion.div
          initial={{ opacity: 0, x: -12, filter: 'blur(3px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="card-grimoire rune-corners p-6 hover-ember border-l-2 border-rose-noir"
        >
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-gold/50" />
            <h2 className="font-display text-lg text-gold">Dernière entrée du journal</h2>
          </div>
          <h3 className="font-body text-xl text-foreground mb-1">{lastEntry.title}</h3>
          <p className="text-sm text-muted-foreground font-ui mb-2">{lastEntry.date} • {getAlterName(lastEntry.alterId)}</p>
          <p className="text-foreground/70 font-body line-clamp-3">{lastEntry.content}</p>
        </motion.div>
      )}

      {/* Citation */}
      {lastCitation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center py-6 relative"
        >
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-px h-6" style={{ background: 'linear-gradient(180deg, transparent, hsla(350, 60%, 45%, 0.3))' }} />
          <Quote className="w-6 h-6 text-primary/40 mx-auto mb-3 mt-4" />
          <blockquote className="text-xl font-body italic text-foreground/80 max-w-lg mx-auto animate-quill">
            « {lastCitation.text} »
          </blockquote>
          <p className="text-sm text-muted-foreground font-ui mt-2">— {getAlterName(lastCitation.alterId)}</p>
          <div className="mt-3 text-gold/15 text-[8px] tracking-[0.5em] font-display">🥀 🥀 🥀</div>
        </motion.div>
      )}

      {/* Ornamental divider */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <div className="flex-1 divider-ornate" />
        <span className="text-[10px] text-gold/40 font-display tracking-widest">EXPLORER LE GRIMOIRE</span>
        <div className="flex-1 divider-ornate" />
      </motion.div>

      {/* Category Covers */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-6"
      >
        {[
          { to: '/alters', icon: Users, label: 'Les Alters', image: '/images/avatars/nyx.png' },
          { to: '/journal', icon: BookOpen, label: 'Le Journal', image: '/images/innerworld/bibliotheque-des-ombres.jpg' },
          { to: '/monde-interieur', icon: Map, label: 'Monde Intérieur', image: '/images/innerworld/forge-ignis.jpg' },
        ].map(btn => (
          <motion.div key={btn.to} variants={itemVariants} whileHover={{ y: -5 }}>
            <Link to={btn.to} className="block relative overflow-hidden rounded-xl border border-gold/20 aspect-[3/4] group shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_hsla(40,70%,50%,0.15)] transition-all duration-500 bg-black">
              <div className="absolute inset-0">
                <img 
                  src={btn.image} 
                  alt={btn.label} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-50 group-hover:opacity-70 mix-blend-luminosity"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/grimoire-cover-bg.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                <div className="absolute inset-0 ring-1 ring-inset ring-gold/10 rounded-xl" />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center z-10">
                <div className="p-3 rounded-full bg-background/50 backdrop-blur-sm border border-gold/20 mb-4 group-hover:bg-gold/10 transition-colors duration-300">
                  <btn.icon className="w-6 h-6 text-gold/70 group-hover:text-gold drop-shadow-md" />
                </div>
                <h3 className="font-display text-2xl text-foreground group-hover:text-gold transition-colors duration-300 tracking-wider">{btn.label}</h3>
                <div className="w-12 h-px bg-gold/30 mt-4 group-hover:w-24 group-hover:bg-gold/60 transition-all duration-500" />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom rune decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center pb-4"
      >
        <p className="text-[8px] font-display text-gold/10 tracking-[1em] select-none">ᛟ ᛉ ᚨ ᛊ ᛟ</p>
      </motion.div>
    </div>
  );
}
