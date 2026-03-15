import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSystem } from '@/contexts/SystemContext';
import { AdminPageHeader, AdminFormCard, AdminList, AdminListItem, containerVariants, itemVariants } from '@/components/admin/AdminPageWrapper';
import { ScrollText, Plus, Trash2, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface Rule {
  id: string;
  category: 'interne' | 'social';
  title: string;
  content: string;
  sort_order: number;
  is_public: boolean;
}

export default function ManageRules() {
  const { user } = useSystem();
  const { toast } = useToast();
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [activeTab, setActiveTab] = useState<'interne' | 'social'>('interne');

  const [form, setForm] = useState({ title: '', content: '', category: 'interne' as 'interne' | 'social', is_public: true });

  const fetchRules = async () => {
    const { data } = await supabase.from('system_rules').select('*').order('sort_order');
    if (data) setRules(data as Rule[]);
    setLoading(false);
  };

  useEffect(() => { fetchRules(); }, []);

  const resetForm = () => {
    setForm({ title: '', content: '', category: activeTab, is_public: true });
    setEditingRule(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!user || !form.title.trim()) return;
    const maxOrder = rules.filter(r => r.category === form.category).length;

    if (editingRule) {
      await supabase.from('system_rules').update({
        title: form.title, content: form.content, category: form.category, is_public: form.is_public,
      }).eq('id', editingRule.id);
      toast({ title: 'Règle modifiée' });
    } else {
      await supabase.from('system_rules').insert({
        user_id: user.id, title: form.title, content: form.content,
        category: form.category, is_public: form.is_public, sort_order: maxOrder,
      });
      toast({ title: 'Règle ajoutée ✨' });
    }
    resetForm();
    fetchRules();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('system_rules').delete().eq('id', id);
    setRules(prev => prev.filter(r => r.id !== id));
    toast({ title: 'Règle supprimée' });
  };

  const handleEdit = (rule: Rule) => {
    setForm({ title: rule.title, content: rule.content, category: rule.category, is_public: rule.is_public });
    setEditingRule(rule);
    setShowForm(true);
  };

  const filtered = rules.filter(r => r.category === activeTab);

  return (
    <div>
      <AdminPageHeader title="Règlement du Système" icon={ScrollText}>
        <button
          onClick={() => { setForm({ ...form, category: activeTab }); setShowForm(!showForm); setEditingRule(null); }}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-ui bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
        >
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </AdminPageHeader>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['interne', 'social'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-ui rounded transition-all ${
              activeTab === tab ? 'bg-primary/15 text-primary border border-primary/30' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30 border border-transparent'
            }`}
          >
            {tab === 'interne' ? '🔒 Règles internes' : '🤝 Interactions sociales'}
          </button>
        ))}
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <AdminFormCard>
            <h3 className="font-display text-lg text-foreground mb-4">
              {editingRule ? 'Modifier la règle' : 'Nouvelle règle'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-ui text-muted-foreground mb-1 block">Catégorie</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value as 'interne' | 'social' })}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm font-ui text-foreground"
                >
                  <option value="interne">🔒 Règles internes au système</option>
                  <option value="social">🤝 Interactions sociales</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-ui text-muted-foreground mb-1 block">Titre</label>
                <input
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm font-ui text-foreground"
                  placeholder="Ex: Respect mutuel entre alters"
                />
              </div>
              <div>
                <label className="text-xs font-ui text-muted-foreground mb-1 block">Contenu / Description</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm font-ui text-foreground min-h-[100px]"
                  placeholder="Détaillez la règle..."
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_public}
                  onChange={e => setForm({ ...form, is_public: e.target.checked })}
                  className="rounded"
                />
                <label className="text-xs font-ui text-muted-foreground">Visible publiquement</label>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSubmit} className="px-4 py-2 text-sm font-ui bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                  {editingRule ? 'Modifier' : 'Ajouter'}
                </button>
                <button onClick={resetForm} className="px-4 py-2 text-sm font-ui text-muted-foreground hover:text-foreground transition-colors">
                  Annuler
                </button>
              </div>
            </div>
          </AdminFormCard>
        )}
      </AnimatePresence>

      {/* Rules list */}
      {loading ? (
        <p className="text-muted-foreground text-sm">Chargement...</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">
          Aucune règle {activeTab === 'interne' ? 'interne' : 'sociale'} pour le moment.
        </p>
      ) : (
        <AdminList>
          {filtered.map((rule, i) => (
            <AdminListItem key={rule.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gold/60 font-display text-xs">{i + 1}.</span>
                    <h3 className="text-sm font-ui text-foreground font-medium">{rule.title}</h3>
                    {!rule.is_public && <span className="text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">privé</span>}
                  </div>
                  {rule.content && <p className="text-xs text-muted-foreground leading-relaxed ml-5">{rule.content}</p>}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => handleEdit(rule)} className="text-muted-foreground hover:text-foreground text-xs px-2 py-1 rounded hover:bg-muted/30 transition-colors">
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(rule.id)} className="text-destructive/60 hover:text-destructive p-1 rounded hover:bg-destructive/10 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </AdminListItem>
          ))}
        </AdminList>
      )}
    </div>
  );
}
