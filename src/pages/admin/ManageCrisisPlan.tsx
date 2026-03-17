import { useState, useEffect } from 'react';
import { ShieldAlert, Plus, Save, AlertTriangle, Phone, Heart, Lightbulb, Trash2, Users, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminPageHeader, AdminSectionCard } from '@/components/admin/AdminPageWrapper';
import { supabase } from '@/integrations/supabase/client';
import { useSystem } from '@/contexts/SystemContext';
import { useToast } from '@/hooks/use-toast';

interface AlterGuideline {
  alterId: string;
  doList: string[];
  dontList: string[];
  notes: string;
}

interface CrisisPlanData {
  warningSignals: string[];
  copingStrategies: string[];
  safeContacts: { name: string; phone: string; role: string }[];
  safeActions: string[];
  personalAffirmations: string[];
  avoidList: string[];
  alterGuidelines: AlterGuideline[];
  isPublic: boolean;
}

const defaultPlan: CrisisPlanData = {
  warningSignals: [],
  copingStrategies: [],
  safeContacts: [],
  safeActions: [],
  personalAffirmations: [],
  avoidList: [],
  alterGuidelines: [],
  isPublic: true,
};

export default function ManageCrisisPlan() {
  const [plan, setPlan] = useState<CrisisPlanData>(defaultPlan);
  const [hasChanges, setHasChanges] = useState(false);
  const [planId, setPlanId] = useState<string | null>(null);
  const { data, user } = useSystem();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: rows } = await supabase
        .from('crisis_plans')
        .select('*')
        .eq('user_id', user.id)
        .limit(1);
      if (rows && rows.length > 0) {
        const r = rows[0];
        setPlanId(r.id);
        setPlan({
          warningSignals: r.warning_signals || [],
          copingStrategies: r.coping_strategies || [],
          safeContacts: (r.safe_contacts as any[]) || [],
          safeActions: r.safe_actions || [],
          personalAffirmations: r.personal_affirmations || [],
          avoidList: r.avoid_list || [],
          alterGuidelines: (r.alter_guidelines as any[]) || [],
          isPublic: r.is_public,
        });
      }
    };
    load();
  }, [user]);

  const save = async () => {
    if (!user) return;
    const payload = {
      user_id: user.id,
      warning_signals: plan.warningSignals,
      coping_strategies: plan.copingStrategies,
      safe_contacts: plan.safeContacts as any,
      safe_actions: plan.safeActions,
      personal_affirmations: plan.personalAffirmations,
      avoid_list: plan.avoidList,
      alter_guidelines: plan.alterGuidelines as any,
      is_public: plan.isPublic,
      updated_at: new Date().toISOString(),
    };
    if (planId) {
      await supabase.from('crisis_plans').update(payload).eq('id', planId);
    } else {
      const { data: inserted } = await supabase.from('crisis_plans').insert(payload).select('id');
      if (inserted?.[0]) setPlanId(inserted[0].id);
    }
    setHasChanges(false);
    toast({ title: '✨ Plan de crise sauvegardé' });
  };

  const update = (field: keyof CrisisPlanData, value: any) => {
    setPlan(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const addToList = (field: keyof CrisisPlanData) => {
    update(field, [...(plan[field] as string[]), '']);
  };
  const updateListItem = (field: keyof CrisisPlanData, index: number, value: string) => {
    const arr = [...(plan[field] as string[])];
    arr[index] = value;
    update(field, arr);
  };
  const removeListItem = (field: keyof CrisisPlanData, index: number) => {
    const arr = [...(plan[field] as string[])];
    arr.splice(index, 1);
    update(field, arr);
  };

  const addContact = () => update('safeContacts', [...plan.safeContacts, { name: '', phone: '', role: '' }]);
  const updateContact = (i: number, field: string, value: string) => {
    const c = [...plan.safeContacts];
    c[i] = { ...c[i], [field]: value };
    update('safeContacts', c);
  };
  const removeContact = (i: number) => {
    const c = [...plan.safeContacts];
    c.splice(i, 1);
    update('safeContacts', c);
  };

  // Alter guidelines helpers
  const addAlterGuideline = () => {
    update('alterGuidelines', [...plan.alterGuidelines, { alterId: '', doList: [''], dontList: [''], notes: '' }]);
  };
  const updateGuideline = (i: number, patch: Partial<AlterGuideline>) => {
    const g = [...plan.alterGuidelines];
    g[i] = { ...g[i], ...patch };
    update('alterGuidelines', g);
  };
  const removeGuideline = (i: number) => {
    const g = [...plan.alterGuidelines];
    g.splice(i, 1);
    update('alterGuidelines', g);
  };
  const addGuidelineItem = (i: number, field: 'doList' | 'dontList') => {
    const g = [...plan.alterGuidelines];
    g[i] = { ...g[i], [field]: [...g[i][field], ''] };
    update('alterGuidelines', g);
  };
  const updateGuidelineItem = (i: number, field: 'doList' | 'dontList', j: number, val: string) => {
    const g = [...plan.alterGuidelines];
    const arr = [...g[i][field]];
    arr[j] = val;
    g[i] = { ...g[i], [field]: arr };
    update('alterGuidelines', g);
  };
  const removeGuidelineItem = (i: number, field: 'doList' | 'dontList', j: number) => {
    const g = [...plan.alterGuidelines];
    const arr = [...g[i][field]];
    arr.splice(j, 1);
    g[i] = { ...g[i], [field]: arr };
    update('alterGuidelines', g);
  };

  const getAlterName = (id: string) => data.alters.find(a => a.id === id)?.name || 'Inconnu';

  const inputClass = "flex-1 bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground placeholder:text-muted-foreground/50";

  const ListSection = ({ title, icon: Icon, field, placeholder, color }: {
    title: string; icon: any; field: keyof CrisisPlanData; placeholder: string; color: string;
  }) => (
    <AdminSectionCard>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${color}`} />
          <h3 className="font-display text-sm text-foreground">{title}</h3>
        </div>
        <button onClick={() => addToList(field)} className="text-xs text-muted-foreground hover:text-gold transition-colors flex items-center gap-1">
          <Plus className="w-3 h-3" /> Ajouter
        </button>
      </div>
      <div className="space-y-2">
        {(plan[field] as string[]).length === 0 && (
          <p className="text-xs text-muted-foreground/50 italic">Aucun élément ajouté</p>
        )}
        <AnimatePresence>
          {(plan[field] as string[]).map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex gap-2">
              <input value={item} onChange={e => updateListItem(field, i, e.target.value)} placeholder={placeholder} className={inputClass} />
              <button onClick={() => removeListItem(field, i)} className="text-destructive/60 hover:text-destructive transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </AdminSectionCard>
  );

  return (
    <div>
      <AdminPageHeader title="Plan de crise" icon={ShieldAlert}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => update('isPublic', !plan.isPublic)}
            className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded transition-colors ${plan.isPublic ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}
          >
            {plan.isPublic ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            {plan.isPublic ? 'Public' : 'Privé'}
          </button>
          {hasChanges && (
            <motion.button initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={save} className="btn-grimoire flex items-center gap-2 text-xs">
              <Save className="w-4 h-4" /> Sauvegarder
            </motion.button>
          )}
        </div>
      </AdminPageHeader>

      <AdminSectionCard className="mb-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Ce plan est votre ressource personnelle en cas de crise. Remplissez-le à votre rythme, dans un moment calme.
          Il sera toujours accessible ici pour vous guider quand vous en avez besoin. 🛡️
        </p>
      </AdminSectionCard>

      <div className="space-y-4">
        <ListSection title="🚨 Signaux d'alerte" icon={AlertTriangle} field="warningSignals" placeholder="Ex: dissociation prolongée, cauchemars, isolement..." color="text-destructive" />
        <ListSection title="🧘 Stratégies de coping" icon={Heart} field="copingStrategies" placeholder="Ex: exercice de grounding, appeler un ami, marcher..." color="text-primary" />
        <ListSection title="✅ Actions sécurisantes" icon={Lightbulb} field="safeActions" placeholder="Ex: mettre de la musique douce, prendre une douche chaude..." color="text-gold" />

        {/* Contacts */}
        <AdminSectionCard>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-accent-foreground" />
              <h3 className="font-display text-sm text-foreground">📞 Contacts de sécurité</h3>
            </div>
            <button onClick={addContact} className="text-xs text-muted-foreground hover:text-gold transition-colors flex items-center gap-1">
              <Plus className="w-3 h-3" /> Ajouter
            </button>
          </div>
          <div className="space-y-3">
            {plan.safeContacts.length === 0 && <p className="text-xs text-muted-foreground/50 italic">Aucun contact ajouté</p>}
            {plan.safeContacts.map((contact, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 gap-2">
                <input value={contact.name} onChange={e => updateContact(i, 'name', e.target.value)} placeholder="Nom" className={inputClass} />
                <input value={contact.phone} onChange={e => updateContact(i, 'phone', e.target.value)} placeholder="Téléphone" className={inputClass} />
                <div className="flex gap-2">
                  <input value={contact.role} onChange={e => updateContact(i, 'role', e.target.value)} placeholder="Rôle" className={inputClass} />
                  <button onClick={() => removeContact(i)} className="text-destructive/60 hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
              </motion.div>
            ))}
          </div>
        </AdminSectionCard>

        <ListSection title="💪 Affirmations personnelles" icon={Heart} field="personalAffirmations" placeholder="Ex: Je suis en sécurité, Nous sommes une équipe..." color="text-gold" />
        <ListSection title="🚫 Ce qui est à éviter en crise" icon={AlertTriangle} field="avoidList" placeholder="Ex: réseaux sociaux, alcool, conduire..." color="text-destructive" />

        {/* ALTER GUIDELINES SECTION */}
        <AdminSectionCard>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <h3 className="font-display text-sm text-foreground">🤝 Comment agir avec chaque alter</h3>
            </div>
            <button onClick={addAlterGuideline} className="text-xs text-muted-foreground hover:text-gold transition-colors flex items-center gap-1">
              <Plus className="w-3 h-3" /> Ajouter un alter
            </button>
          </div>
          <p className="text-xs text-muted-foreground/70 mb-4">
            Indiquez comment interagir avec chaque alter en situation de crise : ce qui aide, ce qu'il faut éviter, et des notes utiles.
          </p>

          {plan.alterGuidelines.length === 0 && (
            <p className="text-xs text-muted-foreground/50 italic">Aucune consigne ajoutée</p>
          )}

          <div className="space-y-4">
            {plan.alterGuidelines.map((g, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-grimoire p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <select
                    value={g.alterId}
                    onChange={e => updateGuideline(i, { alterId: e.target.value })}
                    className="bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground"
                  >
                    <option value="">— Choisir un alter —</option>
                    {data.alters.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  <button onClick={() => removeGuideline(i)} className="text-destructive/60 hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>

                {/* Do list */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-primary font-medium">✅ Ce qui aide</span>
                    <button onClick={() => addGuidelineItem(i, 'doList')} className="text-[10px] text-muted-foreground hover:text-gold"><Plus className="w-3 h-3 inline" /></button>
                  </div>
                  {g.doList.map((item, j) => (
                    <div key={j} className="flex gap-2 mb-1">
                      <input value={item} onChange={e => updateGuidelineItem(i, 'doList', j, e.target.value)} placeholder="Ex: parler doucement, proposer un objet réconfortant..." className={inputClass} />
                      <button onClick={() => removeGuidelineItem(i, 'doList', j)} className="text-destructive/40 hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>

                {/* Don't list */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-destructive font-medium">🚫 Ce qu'il faut éviter</span>
                    <button onClick={() => addGuidelineItem(i, 'dontList')} className="text-[10px] text-muted-foreground hover:text-gold"><Plus className="w-3 h-3 inline" /></button>
                  </div>
                  {g.dontList.map((item, j) => (
                    <div key={j} className="flex gap-2 mb-1">
                      <input value={item} onChange={e => updateGuidelineItem(i, 'dontList', j, e.target.value)} placeholder="Ex: ne pas élever la voix, ne pas toucher sans permission..." className={inputClass} />
                      <button onClick={() => removeGuidelineItem(i, 'dontList', j)} className="text-destructive/40 hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>

                {/* Notes */}
                <div>
                  <span className="text-xs text-muted-foreground font-medium">📝 Notes</span>
                  <textarea
                    value={g.notes}
                    onChange={e => updateGuideline(i, { notes: e.target.value })}
                    placeholder="Informations supplémentaires sur cet alter en crise..."
                    rows={2}
                    className="w-full mt-1 bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground placeholder:text-muted-foreground/50 resize-none"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </AdminSectionCard>

        {/* Emergency numbers */}
        <AdminSectionCard>
          <h3 className="font-display text-sm text-foreground mb-3">📱 Numéros d'urgence (France)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { name: 'SOS Amitié', phone: '09 72 39 40 50', desc: 'Écoute 24h/24' },
              { name: 'Fil Santé Jeunes', phone: '0 800 235 236', desc: 'Anonyme & gratuit' },
              { name: 'SAMU', phone: '15', desc: 'Urgence médicale' },
            ].map((num, i) => (
              <div key={i} className="card-grimoire p-3 text-center">
                <p className="text-xs font-ui text-foreground font-medium">{num.name}</p>
                <p className="text-lg font-display text-primary">{num.phone}</p>
                <p className="text-[10px] text-muted-foreground">{num.desc}</p>
              </div>
            ))}
          </div>
        </AdminSectionCard>
      </div>
    </div>
  );
}
