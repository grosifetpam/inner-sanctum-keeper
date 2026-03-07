import { useState } from 'react';
import { useSystem } from '@/contexts/SystemContext';
import { Plus, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ManageMood() {
  const { data, addMoodEntry, getAlterName } = useSystem();
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], alterId: '', mood: '', energyLevel: 5, notes: '' });

  const save = () => {
    if (!form.mood.trim()) return;
    addMoodEntry({ id: crypto.randomUUID(), ...form });
    setForm({ date: new Date().toISOString().split('T')[0], alterId: data.alters[0]?.id || '', mood: '', energyLevel: 5, notes: '' });
    setIsAdding(false);
  };

  const chartData = data.moods.slice(-14).map(m => ({
    date: m.date,
    énergie: m.energyLevel,
    alter: getAlterName(m.alterId),
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display text-foreground">Suivi d'humeur</h1>
        <button onClick={() => { setIsAdding(true); setForm({ ...form, alterId: data.alters[0]?.id || '' }); }} className="btn-grimoire flex items-center gap-2 text-xs">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {chartData.length > 0 && (
        <div className="card-grimoire p-4 mb-6">
          <h2 className="font-display text-sm text-gold mb-4">Évolution de l'énergie</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 18%)" />
              <XAxis dataKey="date" tick={{ fill: 'hsl(240, 8%, 55%)', fontSize: 10 }} />
              <YAxis domain={[0, 10]} tick={{ fill: 'hsl(240, 8%, 55%)', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: 'hsl(240, 8%, 10%)', border: '1px solid hsl(240, 10%, 18%)', borderRadius: '4px', fontSize: 12 }} />
              <Bar dataKey="énergie" fill="hsl(350, 60%, 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {isAdding && (
        <div className="card-grimoire p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-foreground">Nouvelle entrée</h2>
            <button onClick={() => setIsAdding(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
              className="bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground" />
            <select value={form.alterId} onChange={e => setForm({ ...form, alterId: e.target.value })}
              className="bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground">
              {data.alters.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <input value={form.mood} onChange={e => setForm({ ...form, mood: e.target.value })} placeholder="Humeur"
              className="bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground" />
            <div>
              <label className="text-xs font-ui text-muted-foreground">Énergie: {form.energyLevel}/10</label>
              <input type="range" min="0" max="10" value={form.energyLevel} onChange={e => setForm({ ...form, energyLevel: parseInt(e.target.value) })}
                className="w-full mt-1 accent-primary" />
            </div>
          </div>
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Notes"
            className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground mt-3 min-h-[60px]" />
          <button onClick={save} className="btn-grimoire mt-4">Sauvegarder</button>
        </div>
      )}

      <div className="space-y-2">
        {data.moods.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(m => (
          <div key={m.id} className="card-grimoire p-4">
            <div className="flex justify-between">
              <p className="text-sm font-ui text-foreground">{m.mood} — Énergie: {m.energyLevel}/10</p>
              <span className="text-xs text-muted-foreground">{m.date}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{getAlterName(m.alterId)} {m.notes && `• ${m.notes}`}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
