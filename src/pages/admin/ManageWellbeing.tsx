import { useState, useEffect } from 'react';
import { Sparkles, Sun, Moon, Droplets, Utensils, Pill, BedDouble, Smile, CheckCircle2, Circle, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { AdminPageHeader, AdminSectionCard } from '@/components/admin/AdminPageWrapper';
import { useToast } from '@/hooks/use-toast';

interface DailyChecklist {
  date: string;
  items: Record<string, boolean>;
}

const selfCareItems = [
  { id: 'water', label: 'Boire de l\'eau', icon: Droplets, category: 'Corps' },
  { id: 'eat', label: 'Manger un repas', icon: Utensils, category: 'Corps' },
  { id: 'sleep', label: 'Dormir suffisamment', icon: BedDouble, category: 'Corps' },
  { id: 'meds', label: 'Prendre ses médicaments', icon: Pill, category: 'Corps' },
  { id: 'outside', label: 'Sortir / Prendre l\'air', icon: Sun, category: 'Esprit' },
  { id: 'hygiene', label: 'Hygiène personnelle', icon: Droplets, category: 'Corps' },
  { id: 'joy', label: 'Faire quelque chose qui fait plaisir', icon: Smile, category: 'Esprit' },
  { id: 'rest', label: 'Moment de repos / pause', icon: Moon, category: 'Esprit' },
  { id: 'checkin', label: 'Check-in intérieur (qui est là ?)', icon: Sparkles, category: 'Système' },
  { id: 'journal', label: 'Écrire dans le journal', icon: Sparkles, category: 'Système' },
];

const affirmations = [
  "Vous méritez d'être pris(e) en soin, chaque partie de vous.",
  "Même les petites actions comptent. Chaque case cochée est une victoire.",
  "Vous n'avez pas besoin d'être parfait(e), juste présent(e).",
  "Prendre soin de soi n'est pas égoïste, c'est nécessaire.",
  "Chaque alter mérite d'être entendu et respecté.",
  "La guérison n'est pas linéaire, et c'est normal.",
  "Vous êtes plus fort(e) que vous ne le pensez.",
  "Même les jours difficiles ont une fin.",
];

export default function ManageWellbeing() {
  const today = new Date().toISOString().split('T')[0];
  const [checklist, setChecklist] = useState<DailyChecklist>({ date: today, items: {} });
  const [affirmation] = useState(() => affirmations[Math.floor(Math.random() * affirmations.length)]);
  const [streak, setStreak] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('wellbeing-checklist');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as DailyChecklist;
        if (parsed.date === today) {
          setChecklist(parsed);
        }
      } catch {}
    }
    // Calculate streak
    let s = 0;
    const d = new Date();
    while (true) {
      const dateStr = d.toISOString().split('T')[0];
      const dayData = localStorage.getItem(`wellbeing-${dateStr}`);
      if (dayData) {
        s++;
        d.setDate(d.getDate() - 1);
      } else break;
      if (s > 365) break;
    }
    setStreak(s);
  }, []);

  const toggle = (id: string) => {
    const updated = {
      ...checklist,
      date: today,
      items: { ...checklist.items, [id]: !checklist.items[id] },
    };
    setChecklist(updated);
    localStorage.setItem('wellbeing-checklist', JSON.stringify(updated));
    const completedCount = Object.values(updated.items).filter(Boolean).length;
    if (completedCount === selfCareItems.length) {
      localStorage.setItem(`wellbeing-${today}`, 'complete');
      toast({ title: '🌟 Toute la checklist complétée ! Bravo !' });
    }
  };

  const reset = () => {
    const updated = { date: today, items: {} };
    setChecklist(updated);
    localStorage.setItem('wellbeing-checklist', JSON.stringify(updated));
  };

  const completedCount = Object.values(checklist.items).filter(Boolean).length;
  const progress = selfCareItems.length > 0 ? Math.round((completedCount / selfCareItems.length) * 100) : 0;

  const categories = [...new Set(selfCareItems.map(i => i.category))];

  return (
    <div>
      <AdminPageHeader title="Bien-être & Self-care" icon={Sparkles}>
        <button onClick={reset} className="btn-grimoire flex items-center gap-2 text-xs">
          <RotateCcw className="w-4 h-4" /> Réinitialiser
        </button>
      </AdminPageHeader>

      {/* Affirmation du jour */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-grimoire p-4 mb-4 text-center"
        style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.08), hsl(var(--accent) / 0.08))' }}
      >
        <p className="text-[10px] text-gold/60 font-display tracking-widest mb-2">✦ AFFIRMATION DU JOUR ✦</p>
        <p className="text-sm font-ui text-foreground italic">"{affirmation}"</p>
      </motion.div>

      {/* Progress & streak */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <AdminSectionCard className="text-center">
          <p className="text-2xl font-display text-foreground">{completedCount}/{selfCareItems.length}</p>
          <p className="text-xs text-muted-foreground font-ui">Aujourd'hui</p>
          <div className="w-full h-1.5 rounded-full bg-muted/50 overflow-hidden mt-2">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </AdminSectionCard>
        <AdminSectionCard className="text-center">
          <p className="text-2xl font-display text-gold">{streak}</p>
          <p className="text-xs text-muted-foreground font-ui">Jours consécutifs</p>
          <p className="text-[10px] text-gold/40 mt-1">🔥 Streak</p>
        </AdminSectionCard>
      </div>

      {/* Checklist by category */}
      {categories.map(cat => (
        <AdminSectionCard key={cat} className="mb-3">
          <h3 className="font-display text-xs text-gold/60 tracking-widest mb-3">{cat.toUpperCase()}</h3>
          <div className="space-y-1">
            {selfCareItems.filter(i => i.category === cat).map((item, idx) => {
              const checked = !!checklist.items[item.id];
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => toggle(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-all text-left ${
                    checked ? 'bg-primary/10' : 'hover:bg-muted/30'
                  }`}
                >
                  {checked
                    ? <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0" />
                    : <Circle className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                  }
                  <item.icon className={`w-4 h-4 flex-shrink-0 ${checked ? 'text-gold/50' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-ui ${checked ? 'text-foreground/60 line-through' : 'text-foreground'}`}>
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </AdminSectionCard>
      ))}
    </div>
  );
}
