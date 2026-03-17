import { useState, useEffect } from 'react';
import { ShieldAlert, Phone, AlertTriangle, Heart, Lightbulb, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useSystem } from '@/contexts/SystemContext';
import PageHeader from '@/components/PageHeader';

interface AlterGuideline {
  alterId: string;
  doList: string[];
  dontList: string[];
  notes: string;
}

interface CrisisPlanPublic {
  warningSignals: string[];
  copingStrategies: string[];
  safeContacts: { name: string; phone: string; role: string }[];
  safeActions: string[];
  personalAffirmations: string[];
  avoidList: string[];
  alterGuidelines: AlterGuideline[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function CrisisPlanPage() {
  const [plan, setPlan] = useState<CrisisPlanPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [alters, setAlters] = useState<{ id: string; name: string; avatar?: string }[]>([]);
  const [currentFrontAlterId, setCurrentFrontAlterId] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      // Load public crisis plan
      const { data: rows } = await supabase
        .from('crisis_plans')
        .select('*')
        .eq('is_public', true)
        .limit(1);

      if (rows && rows.length > 0) {
        const r = rows[0];
        setPlan({
          warningSignals: r.warning_signals || [],
          copingStrategies: r.coping_strategies || [],
          safeContacts: (r.safe_contacts as any[]) || [],
          safeActions: r.safe_actions || [],
          personalAffirmations: r.personal_affirmations || [],
          avoidList: r.avoid_list || [],
          alterGuidelines: (r.alter_guidelines as any[]) || [],
        });
      }

      // Load public alters
      const { data: altersData } = await supabase
        .from('alters')
        .select('id, name, avatar')
        .eq('is_public', true);
      if (altersData) setAlters(altersData);

      // Load system info for current front
      const { data: sysInfo } = await supabase
        .from('system_info')
        .select('current_front_alter_id')
        .limit(1);
      if (sysInfo?.[0]) setCurrentFrontAlterId(sysInfo[0].current_front_alter_id);

      setLoading(false);
    };
    load();
  }, []);

  const getAlterName = (id: string) => alters.find(a => a.id === id)?.name || 'Inconnu';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground text-sm animate-pulse">Chargement du plan de crise...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div>
        <PageHeader title="Plan de crise" icon={ShieldAlert} />
        <div className="card-grimoire p-8 text-center">
          <ShieldAlert className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Aucun plan de crise public n'est disponible.</p>
        </div>
      </div>
    );
  }

  // Find guideline for current front alter
  const currentAlterGuideline = plan.alterGuidelines.find(g => g.alterId === currentFrontAlterId);
  const otherGuidelines = plan.alterGuidelines.filter(g => g.alterId !== currentFrontAlterId);

  const Section = ({ title, icon: Icon, items, color, emptyText }: {
    title: string; icon: any; items: string[]; color: string; emptyText: string;
  }) => items.length === 0 ? null : (
    <motion.div variants={itemVariants} className="card-grimoire p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-4 h-4 ${color}`} />
        <h3 className="font-display text-sm text-foreground">{title}</h3>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
            <span className="text-gold/60 mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );

  const AlterGuidelineCard = ({ guideline, isCurrent }: { guideline: AlterGuideline; isCurrent: boolean }) => {
    const name = getAlterName(guideline.alterId);
    return (
      <motion.div variants={itemVariants} className={`card-grimoire p-5 ${isCurrent ? 'ring-2 ring-primary/40' : ''}`}>
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-primary" />
          <h4 className="font-display text-sm text-foreground">
            {name}
            {isCurrent && <span className="ml-2 text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">En front</span>}
          </h4>
        </div>

        {guideline.doList.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-primary font-medium mb-1">✅ Ce qui aide</p>
            <ul className="space-y-1">
              {guideline.doList.filter(Boolean).map((item, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-primary/60 mt-0.5">•</span><span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {guideline.dontList.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-destructive font-medium mb-1">🚫 Ce qu'il faut éviter</p>
            <ul className="space-y-1">
              {guideline.dontList.filter(Boolean).map((item, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-destructive/60 mt-0.5">•</span><span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {guideline.notes && (
          <div>
            <p className="text-xs text-muted-foreground/70 font-medium mb-1">📝 Notes</p>
            <p className="text-xs text-muted-foreground">{guideline.notes}</p>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div>
      <PageHeader title="Plan de crise" icon={ShieldAlert} />

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
        {/* Current front alter highlight */}
        {currentAlterGuideline && (
          <motion.div variants={itemVariants}>
            <div className="mb-2">
              <h2 className="font-display text-lg text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                🤝 Comment agir avec l'alter en front
              </h2>
              <p className="text-xs text-muted-foreground/60 mt-1">Consignes pour interagir avec l'alter actuellement présent</p>
            </div>
            <AlterGuidelineCard guideline={currentAlterGuideline} isCurrent={true} />
          </motion.div>
        )}

        <Section title="🚨 Signaux d'alerte" icon={AlertTriangle} items={plan.warningSignals} color="text-destructive" emptyText="" />
        <Section title="🧘 Stratégies de coping" icon={Heart} items={plan.copingStrategies} color="text-primary" emptyText="" />
        <Section title="✅ Actions sécurisantes" icon={Lightbulb} items={plan.safeActions} color="text-gold" emptyText="" />

        {/* Contacts */}
        {plan.safeContacts.length > 0 && (
          <motion.div variants={itemVariants} className="card-grimoire p-5">
            <div className="flex items-center gap-2 mb-3">
              <Phone className="w-4 h-4 text-accent-foreground" />
              <h3 className="font-display text-sm text-foreground">📞 Contacts de sécurité</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {plan.safeContacts.map((c, i) => (
                <div key={i} className="bg-muted/30 rounded p-3">
                  <p className="text-sm font-ui text-foreground font-medium">{c.name}</p>
                  <p className="text-xs text-primary">{c.phone}</p>
                  {c.role && <p className="text-[10px] text-muted-foreground">{c.role}</p>}
                </div>
              ))
            }
            </div>
          </motion.div>
        )}

        <Section title="💪 Affirmations personnelles" icon={Heart} items={plan.personalAffirmations} color="text-gold" emptyText="" />
        <Section title="🚫 Ce qui est à éviter" icon={AlertTriangle} items={plan.avoidList} color="text-destructive" emptyText="" />

        {/* Other alter guidelines */}
        {otherGuidelines.length > 0 && (
          <motion.div variants={itemVariants}>
            <h2 className="font-display text-lg text-foreground flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-primary" />
              🤝 Comment agir avec les autres alters
            </h2>
            <div className="space-y-3">
              {otherGuidelines.map((g, i) => (
                <AlterGuidelineCard key={i} guideline={g} isCurrent={false} />
              ))
            }
            </div>
          </motion.div>
        )}

        {/* Emergency numbers */}
        <motion.div variants={itemVariants} className="card-grimoire p-5">
          <h3 className="font-display text-sm text-foreground mb-3">📱 Numéros d'urgence (France)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { name: 'SOS Amitié', phone: '09 72 39 40 50', desc: 'Écoute 24h/24' },
              { name: 'Fil Santé Jeunes', phone: '0 800 235 236', desc: 'Anonyme & gratuit' },
              { name: 'SAMU', phone: '15', desc: 'Urgence médicale' },
            ].map((num, i) => (
              <div key={i} className="bg-muted/30 rounded p-3 text-center">
                <p className="text-xs font-ui text-foreground font-medium">{num.name}</p>
                <p className="text-lg font-display text-primary">{num.phone}</p>
                <p className="text-[10px] text-muted-foreground">{num.desc}</p>
              </div>
            ))
          }
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

