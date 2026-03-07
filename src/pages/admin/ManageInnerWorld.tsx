import { useState } from 'react';
import { useSystem } from '@/contexts/SystemContext';
import type { InnerWorldPlace } from '@/types/system';
import { Plus, Trash2, Edit2, X } from 'lucide-react';

export default function ManageInnerWorld() {
  const { data, addInnerWorldPlace, updateInnerWorldPlace, deleteInnerWorldPlace, getAlterName } = useSystem();
  const [editing, setEditing] = useState<InnerWorldPlace | null>(null);
  const [isNew, setIsNew] = useState(false);

  const startNew = () => {
    setEditing({ id: crypto.randomUUID(), name: '', description: '', image: '', significance: '', linkedAlterIds: [], isPublic: true });
    setIsNew(true);
  };

  const save = () => {
    if (!editing || !editing.name.trim()) return;
    if (isNew) addInnerWorldPlace(editing);
    else updateInnerWorldPlace(editing);
    setEditing(null);
  };

  const toggleAlterLink = (alterId: string) => {
    if (!editing) return;
    const ids = editing.linkedAlterIds.includes(alterId)
      ? editing.linkedAlterIds.filter(id => id !== alterId)
      : [...editing.linkedAlterIds, alterId];
    setEditing({ ...editing, linkedAlterIds: ids });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display text-foreground">Monde Intérieur</h1>
        <button onClick={startNew} className="btn-grimoire flex items-center gap-2 text-xs"><Plus className="w-4 h-4" /> Ajouter</button>
      </div>

      {editing && (
        <div className="card-grimoire p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-foreground">{isNew ? 'Nouveau lieu' : 'Modifier'}</h2>
            <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
          </div>
          <div className="space-y-3">
            <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="Nom du lieu"
              className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground" />
            <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="Description"
              className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground min-h-[80px]" />
            <textarea value={editing.significance} onChange={e => setEditing({ ...editing, significance: e.target.value })} placeholder="Signification"
              className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground min-h-[60px]" />
            <div>
              <label className="text-xs font-ui text-muted-foreground uppercase tracking-wider">Alters liés</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {data.alters.map(a => (
                  <button key={a.id} onClick={() => toggleAlterLink(a.id)}
                    className={`text-xs font-ui px-2 py-1 rounded border transition-colors ${
                      editing.linkedAlterIds.includes(a.id) ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'
                    }`}>{a.name}</button>
                ))}
              </div>
            </div>
          </div>
          <button onClick={save} className="btn-grimoire mt-4">Sauvegarder</button>
        </div>
      )}

      <div className="space-y-2">
        {data.innerWorld.map(p => (
          <div key={p.id} className="card-grimoire p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-ui text-foreground">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.linkedAlterIds.map(id => getAlterName(id)).join(', ')}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditing({ ...p }); setIsNew(false); }} className="text-muted-foreground hover:text-foreground"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => deleteInnerWorldPlace(p.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
