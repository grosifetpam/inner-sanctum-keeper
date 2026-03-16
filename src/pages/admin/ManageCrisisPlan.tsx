import { useState, useEffect } from 'react';
import { ShieldAlert, Plus, X, Save, AlertTriangle, Phone, Heart, Lightbulb, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminPageHeader, AdminSectionCard } from '@/components/admin/AdminPageWrapper';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CrisisPlanData {
  warningSignals: string[];
  copingStrategies: string[];
  safeContacts: { name: string; phone: string; role: string }[];
  safeActions: string[];
  personalAffirmations: string[];
  avoidList: string[];
}

const defaultPlan: CrisisPlanData = {
  warningSignals: [],
  copingStrategies: [],
  safeContacts: [],
  safeActions: [],
  personalAffirmations: [],
  avoidList: [],
};

export default function ManageCrisisPlan() {
  const [plan, setPlan] = useState<CrisisPlanData>(defaultPlan);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      const saved = localStorage.getItem('crisis-plan');
      if (saved) {
        try { setPlan(JSON.parse(saved)); } catch {}
      }
    };
    load();
  }, []);

  const save = () => {
    localStorage.setItem('crisis-plan', JSON.stringify(plan));
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

  const addContact = () => {
    update('safeContacts', [...plan.safeContacts, { name: '', phone: '', role: '' }]);
  };

  const updateContact = (index: number, field: string, value: string) => {
    const contacts = [...plan.safeContacts];
    contacts[index] = { ...contacts[index], [field]: value };
    update('safeContacts', contacts);
  };

  const removeContact = (index: number) => {
    const contacts = [...plan.safeContacts];
    contacts.splice(index, 1);
    update('safeContacts', contacts);
  };

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
            <motion.div
              key={i}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-2"
            >
              <input
                value={item}
                onChange={e => updateListItem(field, i, e.target.value)}
                placeholder={placeholder}
                className="flex-1 bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground placeholder:text-muted-foreground/50"
              />
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
        {hasChanges && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={save}
            className="btn-grimoire flex items-center gap-2 text-xs"
          >
            <Save className="w-4 h-4" /> Sauvegarder
          </motion.button>
        )}
      </AdminPageHeader>

      <AdminSectionCard className="mb-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Ce plan est votre ressource personnelle en cas de crise. Remplissez-le à votre rythme, dans un moment calme.
          Il sera toujours accessible ici pour vous guider quand vous en avez besoin. 🛡️
        </p>
      </AdminSectionCard>

      <div className="space-y-4">
        <ListSection
          title="🚨 Signaux d'alerte"
          icon={AlertTriangle}
          field="warningSignals"
          placeholder="Ex: dissociation prolongée, cauchemars, isolement..."
          color="text-destructive"
        />

        <ListSection
          title="🧘 Stratégies de coping"
          icon={Heart}
          field="copingStrategies"
          placeholder="Ex: exercice de grounding, appeler un ami, marcher..."
          color="text-primary"
        />

        <ListSection
          title="✅ Actions sécurisantes"
          icon={Lightbulb}
          field="safeActions"
          placeholder="Ex: mettre de la musique douce, prendre une douche chaude..."
          color="text-gold"
        />

        {/* Contacts section */}
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
            {plan.safeContacts.length === 0 && (
              <p className="text-xs text-muted-foreground/50 italic">Aucun contact ajouté</p>
            )}
            {plan.safeContacts.map((contact, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 gap-2">
                <input
                  value={contact.name}
                  onChange={e => updateContact(i, 'name', e.target.value)}
                  placeholder="Nom"
                  className="bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground placeholder:text-muted-foreground/50"
                />
                <input
                  value={contact.phone}
                  onChange={e => updateContact(i, 'phone', e.target.value)}
                  placeholder="Téléphone"
                  className="bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground placeholder:text-muted-foreground/50"
                />
                <div className="flex gap-2">
                  <input
                    value={contact.role}
                    onChange={e => updateContact(i, 'role', e.target.value)}
                    placeholder="Rôle (ami, thérapeute...)"
                    className="flex-1 bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground placeholder:text-muted-foreground/50"
                  />
                  <button onClick={() => removeContact(i)} className="text-destructive/60 hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </AdminSectionCard>

        <ListSection
          title="💪 Affirmations personnelles"
          icon={Heart}
          field="personalAffirmations"
          placeholder="Ex: Je suis en sécurité, Nous sommes une équipe..."
          color="text-gold"
        />

        <ListSection
          title="🚫 Ce qui est à éviter en crise"
          icon={AlertTriangle}
          field="avoidList"
          placeholder="Ex: réseaux sociaux, alcool, conduire..."
          color="text-destructive"
        />

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
