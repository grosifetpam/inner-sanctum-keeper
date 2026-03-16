import { useState, useEffect, useCallback } from 'react';
import { Anchor, Eye, Hand, Ear, Wind, Heart, RotateCcw, Play, Pause, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminPageHeader, AdminSectionCard } from '@/components/admin/AdminPageWrapper';

const senses = [
  { id: 'voir', label: '5 choses que vous VOYEZ', icon: Eye, count: 5, color: 'text-primary', placeholder: 'Ex: la lumière, un livre, mes mains...' },
  { id: 'toucher', label: '4 choses que vous TOUCHEZ', icon: Hand, count: 4, color: 'text-gold', placeholder: 'Ex: le tissu du canapé, la chaleur...' },
  { id: 'entendre', label: '3 choses que vous ENTENDEZ', icon: Ear, count: 3, color: 'text-accent-foreground', placeholder: 'Ex: le vent, un oiseau, ma respiration...' },
  { id: 'sentir', label: '2 choses que vous SENTEZ', icon: Wind, count: 2, color: 'text-secondary-foreground', placeholder: 'Ex: le café, l\'air frais...' },
  { id: 'gouter', label: '1 chose que vous GOÛTEZ', icon: Heart, count: 1, color: 'text-destructive', placeholder: 'Ex: un bonbon, l\'eau...' },
];

const breathingPatterns = [
  { name: 'Respiration carrée', inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
  { name: 'Respiration 4-7-8', inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
  { name: 'Respiration apaisante', inhale: 5, hold1: 2, exhale: 7, hold2: 0 },
];

const quickGrounding = [
  { title: 'Pieds sur terre', desc: 'Appuyez fermement vos pieds au sol. Sentez le contact, la pression, la température. Vous êtes ici, maintenant.' },
  { title: 'Eau froide', desc: 'Passez vos mains sous l\'eau froide ou tenez un glaçon. Concentrez-vous sur la sensation.' },
  { title: 'Nommer 3 choses', desc: 'Nommez à voix haute : 3 couleurs autour de vous, 3 textures que vous touchez, 3 sons que vous entendez.' },
  { title: 'Objet d\'ancrage', desc: 'Tenez un objet significatif (pierre, bijou, tissu). Explorez ses détails avec attention.' },
  { title: 'Ancrage par le corps', desc: 'Serrez les poings 5 secondes, relâchez. Sentez la différence. Répétez avec différents muscles.' },
  { title: 'Comptage inverse', desc: 'Comptez de 100 à 0 par 7 (100, 93, 86...). Cela occupe le mental et ancre dans le présent.' },
];

export default function ManageGrounding() {
  const [activeExercise, setActiveExercise] = useState<'54321' | 'breathing' | null>(null);
  const [currentSenseIndex, setCurrentSenseIndex] = useState(0);
  const [senseInputs, setSenseInputs] = useState<Record<string, string[]>>({});
  const [breathingPattern, setBreathingPattern] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [breathTimer, setBreathTimer] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathCycles, setBreathCycles] = useState(0);

  const pattern = breathingPatterns[breathingPattern];

  const phaseLabels: Record<string, string> = {
    inhale: 'Inspirez',
    hold1: 'Retenez',
    exhale: 'Expirez',
    hold2: 'Pause',
  };

  const phaseDuration = pattern[breathPhase];

  useEffect(() => {
    if (!isBreathing) return;
    if (phaseDuration === 0 && (breathPhase === 'hold1' || breathPhase === 'hold2')) {
      // Skip zero-duration phases
      const next = breathPhase === 'hold1' ? 'exhale' : 'inhale';
      setBreathPhase(next);
      setBreathTimer(0);
      if (next === 'inhale') setBreathCycles(c => c + 1);
      return;
    }
    const interval = setInterval(() => {
      setBreathTimer(t => {
        if (t + 1 >= phaseDuration) {
          const phases: typeof breathPhase[] = ['inhale', 'hold1', 'exhale', 'hold2'];
          const nextIdx = (phases.indexOf(breathPhase) + 1) % 4;
          setBreathPhase(phases[nextIdx]);
          if (phases[nextIdx] === 'inhale') setBreathCycles(c => c + 1);
          return 0;
        }
        return t + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isBreathing, breathPhase, phaseDuration]);

  const resetBreathing = () => {
    setIsBreathing(false);
    setBreathPhase('inhale');
    setBreathTimer(0);
    setBreathCycles(0);
  };

  const handleSenseInput = (senseId: string, index: number, value: string) => {
    setSenseInputs(prev => {
      const arr = [...(prev[senseId] || [])];
      arr[index] = value;
      return { ...prev, [senseId]: arr };
    });
  };

  const currentSense = senses[currentSenseIndex];
  const currentInputs = senseInputs[currentSense?.id] || [];
  const isCurrentComplete = currentSense && currentInputs.filter(Boolean).length >= currentSense.count;

  return (
    <div>
      <AdminPageHeader title="Ancrage & Grounding" icon={Anchor} />

      {/* Quick grounding techniques */}
      <AdminSectionCard>
        <h2 className="font-display text-sm text-gold mb-4">⚡ Techniques rapides d'ancrage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickGrounding.map((tech, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card-grimoire p-3 hover-ember"
            >
              <h3 className="text-sm font-ui text-foreground mb-1">{tech.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{tech.desc}</p>
            </motion.div>
          ))}
        </div>
      </AdminSectionCard>

      {/* Exercise buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setActiveExercise(activeExercise === '54321' ? null : '54321'); setCurrentSenseIndex(0); setSenseInputs({}); }}
          className={`card-grimoire p-4 text-left hover-ember transition-all ${activeExercise === '54321' ? 'border-primary/40' : ''}`}
        >
          <div className="flex items-center gap-3">
            <Eye className="w-6 h-6 text-gold" />
            <div>
              <h3 className="text-sm font-ui text-foreground">Exercice 5-4-3-2-1</h3>
              <p className="text-xs text-muted-foreground">Ancrage sensoriel guidé étape par étape</p>
            </div>
          </div>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setActiveExercise(activeExercise === 'breathing' ? null : 'breathing'); resetBreathing(); }}
          className={`card-grimoire p-4 text-left hover-ember transition-all ${activeExercise === 'breathing' ? 'border-primary/40' : ''}`}
        >
          <div className="flex items-center gap-3">
            <Wind className="w-6 h-6 text-gold" />
            <div>
              <h3 className="text-sm font-ui text-foreground">Exercice de respiration</h3>
              <p className="text-xs text-muted-foreground">Respiration guidée avec plusieurs patterns</p>
            </div>
          </div>
        </motion.button>
      </div>

      {/* 5-4-3-2-1 Exercise */}
      <AnimatePresence>
        {activeExercise === '54321' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <AdminSectionCard>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">
                  {senses.map((s, i) => (
                    <div key={s.id} className={`w-2 h-2 rounded-full transition-colors ${i < currentSenseIndex ? 'bg-gold' : i === currentSenseIndex ? 'bg-primary' : 'bg-muted'}`} />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground font-ui">Étape {currentSenseIndex + 1}/5</span>
              </div>

              {currentSense && (
                <motion.div key={currentSense.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="flex items-center gap-2 mb-3">
                    <currentSense.icon className={`w-5 h-5 ${currentSense.color}`} />
                    <h3 className="font-display text-foreground text-sm">{currentSense.label}</h3>
                  </div>
                  <div className="space-y-2">
                    {Array.from({ length: currentSense.count }).map((_, i) => (
                      <input
                        key={i}
                        value={currentInputs[i] || ''}
                        onChange={e => handleSenseInput(currentSense.id, i, e.target.value)}
                        placeholder={currentSense.placeholder}
                        className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground placeholder:text-muted-foreground/50"
                      />
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    {currentSenseIndex > 0 && (
                      <button onClick={() => setCurrentSenseIndex(i => i - 1)} className="btn-grimoire text-xs">← Précédent</button>
                    )}
                    {currentSenseIndex < senses.length - 1 ? (
                      <button
                        onClick={() => setCurrentSenseIndex(i => i + 1)}
                        disabled={!isCurrentComplete}
                        className="btn-grimoire text-xs disabled:opacity-40"
                      >
                        Suivant →
                      </button>
                    ) : (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2 text-gold"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-display">Exercice terminé ! Vous êtes ancré(e).</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AdminSectionCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breathing Exercise */}
      <AnimatePresence>
        {activeExercise === 'breathing' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <AdminSectionCard>
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  {breathingPatterns.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => { setBreathingPattern(i); resetBreathing(); }}
                      className={`text-xs font-ui px-3 py-1 rounded transition-colors ${i === breathingPattern ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{breathCycles} cycles</span>
              </div>

              <div className="flex flex-col items-center py-8">
                <motion.div
                  animate={{
                    scale: isBreathing
                      ? breathPhase === 'inhale' ? [1, 1.5] : breathPhase === 'exhale' ? [1.5, 1] : breathPhase === 'hold1' ? 1.5 : 1
                      : 1,
                  }}
                  transition={{ duration: phaseDuration, ease: 'easeInOut' }}
                  className="w-32 h-32 rounded-full border-2 border-primary/30 flex items-center justify-center mb-6"
                  style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.15), transparent)' }}
                >
                  <span className="font-display text-foreground text-lg">
                    {isBreathing ? phaseLabels[breathPhase] : 'Prêt'}
                  </span>
                </motion.div>

                {isBreathing && (
                  <div className="w-48 h-1.5 rounded-full bg-muted/50 overflow-hidden mb-4">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${((breathTimer + 1) / phaseDuration) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsBreathing(!isBreathing)}
                    className="btn-grimoire flex items-center gap-2 text-xs"
                  >
                    {isBreathing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isBreathing ? 'Pause' : 'Commencer'}
                  </button>
                  <button onClick={resetBreathing} className="btn-grimoire flex items-center gap-2 text-xs">
                    <RotateCcw className="w-4 h-4" /> Reset
                  </button>
                </div>
              </div>
            </AdminSectionCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
