import { useState } from 'react';
import { useSystem } from '@/contexts/SystemContext';

export default function ManageSystem() {
  const { data, updateSystemInfo } = useSystem();
  const [form, setForm] = useState({ ...data.systemInfo });

  const save = () => {
    updateSystemInfo(form);
  };

  return (
    <div>
      <h1 className="text-2xl font-display text-foreground mb-6">Paramètres du système</h1>

      <div className="card-grimoire p-6 space-y-4">
        <div>
          <label className="text-xs font-ui text-muted-foreground uppercase tracking-wider">Nom du système</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground mt-1" />
        </div>
        <div>
          <label className="text-xs font-ui text-muted-foreground uppercase tracking-wider">Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground mt-1 min-h-[100px]" />
        </div>
        <div>
          <label className="text-xs font-ui text-muted-foreground uppercase tracking-wider">Humeur du jour</label>
          <input value={form.moodOfDay} onChange={e => setForm({ ...form, moodOfDay: e.target.value })}
            className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground mt-1" />
        </div>
        <div>
          <label className="text-xs font-ui text-muted-foreground uppercase tracking-wider">Alter au front</label>
          <select value={form.currentFrontAlterId} onChange={e => setForm({ ...form, currentFrontAlterId: e.target.value })}
            className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground mt-1">
            {data.alters.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <button onClick={save} className="btn-grimoire">Sauvegarder</button>
      </div>
    </div>
  );
}
