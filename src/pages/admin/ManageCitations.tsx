import { useState } from 'react';
import { useSystem } from '@/contexts/SystemContext';
import type { Citation } from '@/types/system';
import { Plus, Trash2, X, Quote } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { AdminPageHeader, AdminList, AdminListItem, AdminFormCard } from '@/components/admin/AdminPageWrapper';

export default function ManageCitations() {
  const { data, addCitation, deleteCitation, getAlterName } = useSystem();
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ text: '', alterId: '', date: new Date().toISOString().split('T')[0], isPublic: true });

  const save = () => {
    if (!form.text.trim()) return;
    addCitation({ id: crypto.randomUUID(), ...form });
    setForm({ text: '', alterId: data.alters[0]?.id || '', date: new Date().toISOString().split('T')[0], isPublic: true });
    setIsAdding(false);
  };

  return (
    <div>
      <AdminPageHeader title="Citations" icon={Quote}>
        <button onClick={() => { setIsAdding(true); setForm({ ...form, alterId: data.alters[0]?.id || '' }); }} className="btn-grimoire flex items-center gap-2 text-xs"><Plus className="w-4 h-4" /> Ajouter</button>
      </AdminPageHeader>

      <AnimatePresence>
        {isAdding && (
          <AdminFormCard>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-foreground">Nouvelle citation</h2>
              <button onClick={() => setIsAdding(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <textarea value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} placeholder="Citation..." className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground min-h-[80px] mb-3" />
            <div className="grid grid-cols-2 gap-3">
              <select value={form.alterId} onChange={e => setForm({ ...form, alterId: e.target.value })} className="bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground">
                {data.alters.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground" />
            </div>
            <button onClick={save} className="btn-grimoire mt-4">Sauvegarder</button>
          </AdminFormCard>
        )}
      </AnimatePresence>

      <AdminList>
        {data.citations.map(c => (
          <AdminListItem key={c.id}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body text-foreground italic">"{c.text}"</p>
                <p className="text-xs text-muted-foreground font-ui mt-1">— {getAlterName(c.alterId)} • {c.date}</p>
              </div>
              <button onClick={() => deleteCitation(c.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="w-4 h-4" /></button>
            </div>
          </AdminListItem>
        ))}
      </AdminList>
    </div>
  );
}
