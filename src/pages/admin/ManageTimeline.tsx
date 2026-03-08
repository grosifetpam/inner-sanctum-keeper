import { useState } from 'react';
import { useSystem } from '@/contexts/SystemContext';
import type { TimelineEvent } from '@/types/system';
import { Plus, Trash2, X, Clock } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { AdminPageHeader, AdminList, AdminListItem, AdminFormCard } from '@/components/admin/AdminPageWrapper';
import { playQuillSound } from '@/lib/sounds';

export default function ManageTimeline() {
  const { data, addTimelineEvent, deleteTimelineEvent, getAlterName } = useSystem();
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ date: '', title: '', description: '', alterId: '', isPublic: true });

  const save = () => {
    if (!form.title.trim()) return;
    addTimelineEvent({ id: crypto.randomUUID(), ...form });
    setForm({ date: '', title: '', description: '', alterId: '', isPublic: true });
    setIsAdding(false);
  };

  return (
    <div>
      <AdminPageHeader title="Chronologie" icon={Clock}>
        <button onClick={() => { playQuillSound(); setIsAdding(true); setForm({ ...form, alterId: data.alters[0]?.id || '' }); }} className="btn-grimoire flex items-center gap-2 text-xs"><Plus className="w-4 h-4" /> Ajouter</button>
      </AdminPageHeader>

      <AnimatePresence>
        {isAdding && (
          <AdminFormCard>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-foreground">Nouvel événement</h2>
              <button onClick={() => setIsAdding(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Titre" className="bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground" />
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground" />
              <select value={form.alterId} onChange={e => setForm({ ...form, alterId: e.target.value })} className="bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground">
                {data.alters.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground mt-3 min-h-[60px]" />
            <button onClick={save} className="btn-grimoire mt-4">Sauvegarder</button>
          </AdminFormCard>
        )}
      </AnimatePresence>

      <AdminList>
        {data.timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(e => (
          <AdminListItem key={e.id}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-ui text-foreground">{e.title}</p>
                <p className="text-xs text-muted-foreground">{e.date} • {getAlterName(e.alterId)}</p>
              </div>
              <button onClick={() => deleteTimelineEvent(e.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="w-4 h-4" /></button>
            </div>
          </AdminListItem>
        ))}
      </AdminList>
    </div>
  );
}
