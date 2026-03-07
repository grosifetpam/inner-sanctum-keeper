import { useState } from 'react';
import { useSystem } from '@/contexts/SystemContext';
import type { Resource } from '@/types/system';
import { Plus, Trash2, X } from 'lucide-react';

const categories: Resource['category'][] = ['livres', 'films', 'séries', 'musique', 'articles'];

export default function ManageResources() {
  const { data, addResource, deleteResource } = useSystem();
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', link: '', category: 'articles' as Resource['category'], isPublic: true });

  const save = () => {
    if (!form.title.trim()) return;
    addResource({ id: crypto.randomUUID(), ...form });
    setForm({ title: '', description: '', link: '', category: 'articles', isPublic: true });
    setIsAdding(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display text-foreground">Ressources</h1>
        <button onClick={() => setIsAdding(true)} className="btn-grimoire flex items-center gap-2 text-xs">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {isAdding && (
        <div className="card-grimoire p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-foreground">Nouvelle ressource</h2>
            <button onClick={() => setIsAdding(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Titre"
              className="bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground" />
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Resource['category'] })}
              className="bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="Lien URL"
              className="bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground" />
          </div>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description"
            className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground mt-3 min-h-[60px]" />
          <button onClick={save} className="btn-grimoire mt-4">Sauvegarder</button>
        </div>
      )}

      <div className="space-y-2">
        {data.resources.map(r => (
          <div key={r.id} className="card-grimoire p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-ui text-foreground">{r.title}</p>
              <p className="text-xs text-muted-foreground">{r.category} • {r.isPublic ? 'Public' : 'Privé'}</p>
            </div>
            <button onClick={() => deleteResource(r.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
