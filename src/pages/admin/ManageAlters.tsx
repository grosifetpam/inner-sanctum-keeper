import { useState } from 'react';
import { useSystem } from '@/contexts/SystemContext';
import type { Alter, AlterRole } from '@/types/system';
import { Plus, Trash2, Edit2, X, Eye, EyeOff } from 'lucide-react';

const roleTypes: AlterRole[] = ['hôte', 'protecteur', 'persécuteur', 'gardien', 'observateur', 'trauma holder', 'autre'];

const emptyAlter: Omit<Alter, 'id'> = {
  name: '', avatar: '', role: '', roleType: 'autre', apparentAge: '', pronouns: '',
  personality: '', strengths: '', difficulties: '', relations: '', internalNotes: '', isPublic: true,
};

export default function ManageAlters() {
  const { data, addAlter, updateAlter, deleteAlter } = useSystem();
  const [editing, setEditing] = useState<Alter | null>(null);
  const [isNew, setIsNew] = useState(false);

  const startNew = () => {
    setEditing({ id: crypto.randomUUID(), ...emptyAlter });
    setIsNew(true);
  };

  const startEdit = (a: Alter) => {
    setEditing({ ...a });
    setIsNew(false);
  };

  const save = () => {
    if (!editing || !editing.name.trim()) return;
    if (isNew) addAlter(editing);
    else updateAlter(editing);
    setEditing(null);
  };

  const field = (label: string, key: keyof Alter, textarea = false) => (
    <div>
      <label className="text-xs font-ui text-muted-foreground uppercase tracking-wider">{label}</label>
      {textarea ? (
        <textarea
          value={(editing as any)?.[key] || ''}
          onChange={e => setEditing(prev => prev ? { ...prev, [key]: e.target.value } : null)}
          className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground mt-1 min-h-[60px]"
        />
      ) : (
        <input
          value={(editing as any)?.[key] || ''}
          onChange={e => setEditing(prev => prev ? { ...prev, [key]: e.target.value } : null)}
          className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground mt-1"
        />
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display text-foreground">Alters</h1>
        <button onClick={startNew} className="btn-grimoire flex items-center gap-2 text-xs">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {editing && (
        <div className="card-grimoire p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-foreground">{isNew ? 'Nouvel alter' : 'Modifier'}</h2>
            <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('Nom', 'name')}
            {field('Pronoms', 'pronouns')}
            {field('Âge apparent', 'apparentAge')}
            {field('Rôle', 'role')}
            <div>
              <label className="text-xs font-ui text-muted-foreground uppercase tracking-wider">Type de rôle</label>
              <select
                value={editing.roleType}
                onChange={e => setEditing(prev => prev ? { ...prev, roleType: e.target.value as AlterRole } : null)}
                className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground mt-1"
              >
                {roleTypes.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <label className="text-xs font-ui text-muted-foreground">Visible publiquement</label>
              <button
                onClick={() => setEditing(prev => prev ? { ...prev, isPublic: !prev.isPublic } : null)}
                className={`p-1 rounded ${editing.isPublic ? 'text-gold' : 'text-muted-foreground'}`}
              >
                {editing.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 mt-4">
            {field('Personnalité', 'personality', true)}
            {field('Forces', 'strengths', true)}
            {field('Difficultés', 'difficulties', true)}
            {field('Relations', 'relations', true)}
            {field('Notes internes', 'internalNotes', true)}
          </div>
          <button onClick={save} className="btn-grimoire mt-4">Sauvegarder</button>
        </div>
      )}

      <div className="space-y-2">
        {data.alters.map(a => (
          <div key={a.id} className="card-grimoire p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-display text-sm text-primary">
                {a.name[0]}
              </div>
              <div>
                <p className="text-sm font-ui text-foreground">{a.name}</p>
                <p className="text-xs text-muted-foreground">{a.roleType} • {a.isPublic ? 'Public' : 'Privé'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(a)} className="text-muted-foreground hover:text-foreground"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => deleteAlter(a.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
