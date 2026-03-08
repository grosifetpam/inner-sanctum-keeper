import { useState } from 'react';
import { useSystem } from '@/contexts/SystemContext';
import { Plus, X, Activity } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { AdminPageHeader, AdminList, AdminListItem, AdminFormCard, AdminSectionCard } from '@/components/admin/AdminPageWrapper';
import { playQuillSound } from '@/lib/sounds';

export default function ManageFront() {
  const { data, addFrontEntry, getAlterName } = useSystem();
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ alterId: '', notes: '' });

  const save = () => {
    if (!form.alterId) return;
    addFrontEntry({ id: crypto.randomUUID(), alterId: form.alterId, timestamp: new Date().toISOString(), notes: form.notes });
    setForm({ alterId: '', notes: '' });
    setIsAdding(false);
  };

  const currentFront = data.alters.find(a => a.id === data.systemInfo.currentFrontAlterId);

  return (
    <div>
      <AdminPageHeader title="Front Tracker" icon={Activity}>
        <button onClick={() => { playQuillSound(); setIsAdding(true); setForm({ alterId: data.alters[0]?.id || '', notes: '' }); }} className="btn-grimoire flex items-center gap-2 text-xs"><Plus className="w-4 h-4" /> Changer le front</button>
      </AdminPageHeader>

      <AdminSectionCard className="text-center">
        <p className="text-xs font-ui text-muted-foreground uppercase tracking-widest mb-2">Actuellement au front</p>
        <p className="text-3xl font-display text-primary text-glow">{currentFront?.name || '—'}</p>
      </AdminSectionCard>

      <AnimatePresence>
        {isAdding && (
          <AdminFormCard>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-foreground">Changement de front</h2>
              <button onClick={() => setIsAdding(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <select value={form.alterId} onChange={e => setForm({ ...form, alterId: e.target.value })} className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground mb-3">
              {data.alters.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Notes" className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground mb-3" />
            <button onClick={save} className="btn-grimoire">Confirmer</button>
          </AdminFormCard>
        )}
      </AnimatePresence>

      <h2 className="font-display text-lg text-foreground mb-4">Historique</h2>
      <AdminList>
        {data.frontHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(f => (
          <AdminListItem key={f.id}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-ui text-foreground">{getAlterName(f.alterId)}</p>
                <p className="text-xs text-muted-foreground">{new Date(f.timestamp).toLocaleString('fr-FR')}</p>
              </div>
              {f.notes && <p className="text-xs text-muted-foreground max-w-[200px] text-right">{f.notes}</p>}
            </div>
          </AdminListItem>
        ))}
      </AdminList>
    </div>
  );
}
