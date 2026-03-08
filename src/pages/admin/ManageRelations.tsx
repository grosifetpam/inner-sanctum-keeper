import { useState } from 'react';
import { useSystem } from '@/contexts/SystemContext';
import type { AlterRelation } from '@/types/system';
import { Plus, Trash2, X } from 'lucide-react';
import RelationGraph from '@/components/RelationGraph';

const relationTypes: AlterRelation['type'][] = ['allié', 'protecteur', 'conflit', 'influence', 'famille interne'];

const relationColors: Record<string, string> = {
  'allié': 'bg-moonlight/20 text-moonlight',
  'protecteur': 'bg-gold/20 text-gold',
  'conflit': 'bg-destructive/20 text-destructive',
  'influence': 'bg-accent text-accent-foreground',
  'famille interne': 'bg-primary/20 text-primary',
};

export default function ManageRelations() {
  const { data, addRelation, deleteRelation, getAlterName } = useSystem();
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ fromAlterId: '', toAlterId: '', type: 'allié' as AlterRelation['type'] });

  const save = () => {
    if (!form.fromAlterId || !form.toAlterId || form.fromAlterId === form.toAlterId) return;
    addRelation({ id: crypto.randomUUID(), ...form });
    setForm({ fromAlterId: data.alters[0]?.id || '', toAlterId: '', type: 'allié' });
    setIsAdding(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display text-foreground">Relations</h1>
        <button onClick={() => { setIsAdding(true); setForm({ fromAlterId: data.alters[0]?.id || '', toAlterId: data.alters[1]?.id || '', type: 'allié' }); }}
          className="btn-grimoire flex items-center gap-2 text-xs"><Plus className="w-4 h-4" /> Ajouter</button>
      </div>

      {/* Interactive graph */}
      <div className="card-grimoire p-6 mb-6">
        <h2 className="font-display text-sm text-gold mb-4">Carte des relations</h2>
        <RelationGraph alters={data.alters} relations={data.relations} />
      </div>

      {isAdding && (
        <div className="card-grimoire p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-foreground">Nouvelle relation</h2>
            <button onClick={() => setIsAdding(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select value={form.fromAlterId} onChange={e => setForm({ ...form, fromAlterId: e.target.value })}
              className="bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground">
              {data.alters.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as AlterRelation['type'] })}
              className="bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground">
              {relationTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={form.toAlterId} onChange={e => setForm({ ...form, toAlterId: e.target.value })}
              className="bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground">
              {data.alters.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <button onClick={save} className="btn-grimoire mt-4">Sauvegarder</button>
        </div>
      )}

      <div className="space-y-2">
        {data.relations.map(r => (
          <div key={r.id} className="card-grimoire p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-ui text-foreground">{getAlterName(r.fromAlterId)}</span>
              <span className={`text-xs px-2 py-0.5 rounded ${relationColors[r.type] || 'bg-muted text-muted-foreground'}`}>{r.type}</span>
              <span className="text-sm font-ui text-foreground">{getAlterName(r.toAlterId)}</span>
            </div>
            <button onClick={() => deleteRelation(r.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
