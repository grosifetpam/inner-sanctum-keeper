import { useState, useRef } from 'react';
import { useSystem } from '@/contexts/SystemContext';
import type { InnerWorldPlace } from '@/types/system';
import { Plus, Trash2, Edit2, X, Upload, Image as ImageIcon, Loader2, Map } from 'lucide-react';
import { uploadImage, deleteImage } from '@/lib/storage';
import { AnimatePresence } from 'framer-motion';
import { AdminPageHeader, AdminList, AdminListItem, AdminFormCard } from '@/components/admin/AdminPageWrapper';
import { playQuillSound } from '@/lib/sounds';

export default function ManageInnerWorld() {
  const { data, addInnerWorldPlace, updateInnerWorldPlace, deleteInnerWorldPlace, getAlterName, user } = useSystem();
  const [editing, setEditing] = useState<InnerWorldPlace | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startNew = () => { playQuillSound(); setEditing({ id: crypto.randomUUID(), name: '', description: '', image: '', significance: '', linkedAlterIds: [], isPublic: true }); setIsNew(true); };
  const save = () => { if (!editing || !editing.name.trim()) return; if (isNew) addInnerWorldPlace(editing); else updateInnerWorldPlace(editing); setEditing(null); };
  const toggleAlterLink = (alterId: string) => { if (!editing) return; const ids = editing.linkedAlterIds.includes(alterId) ? editing.linkedAlterIds.filter(id => id !== alterId) : [...editing.linkedAlterIds, alterId]; setEditing({ ...editing, linkedAlterIds: ids }); };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing || !user) return;
    if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) return;
    setUploading(true);
    try {
      if (editing.image) await deleteImage('inner-world', editing.image);
      const url = await uploadImage('inner-world', user.id, file);
      if (url) setEditing(prev => prev ? { ...prev, image: url } : null);
    } finally { setUploading(false); }
  };

  const removeImage = async () => { if (!editing) return; if (editing.image) await deleteImage('inner-world', editing.image); setEditing(prev => prev ? { ...prev, image: '' } : null); };

  return (
    <div>
      <AdminPageHeader title="Monde Intérieur" icon={Map}>
        <button onClick={startNew} className="btn-grimoire flex items-center gap-2 text-xs"><Plus className="w-4 h-4" /> Ajouter</button>
      </AdminPageHeader>

      <AnimatePresence>
        {editing && (
          <AdminFormCard>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-foreground">{isNew ? 'Nouveau lieu' : 'Modifier'}</h2>
              <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-ui text-muted-foreground uppercase tracking-wider">Image du lieu</label>
                <div className="mt-2 relative group w-full h-40 rounded-lg overflow-hidden bg-card border border-border flex items-center justify-center">
                  {uploading ? <Loader2 className="w-8 h-8 text-primary animate-spin" /> : editing.image ? <img src={editing.image} alt="Lieu" className="w-full h-full object-cover" /> : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground"><ImageIcon className="w-8 h-8" /><span className="text-xs">Cliquer pour ajouter</span></div>
                  )}
                  <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="w-6 h-6 text-foreground" />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>
                {editing.image && <button onClick={removeImage} className="text-xs text-destructive hover:underline mt-1">Supprimer l'image</button>}
              </div>
              <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="Nom du lieu" className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground" />
              <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="Description" className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground min-h-[80px]" />
              <textarea value={editing.significance} onChange={e => setEditing({ ...editing, significance: e.target.value })} placeholder="Signification" className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground min-h-[60px]" />
              <div>
                <label className="text-xs font-ui text-muted-foreground uppercase tracking-wider">Alters liés</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {data.alters.map(a => (
                    <button key={a.id} onClick={() => toggleAlterLink(a.id)} className={`text-xs font-ui px-2 py-1 rounded border transition-colors ${editing.linkedAlterIds.includes(a.id) ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'}`}>{a.name}</button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={save} className="btn-grimoire mt-4">Sauvegarder</button>
          </AdminFormCard>
        )}
      </AnimatePresence>

      <AdminList>
        {data.innerWorld.map(p => (
          <AdminListItem key={p.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {p.image && <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover" />}
                <div>
                  <p className="text-sm font-ui text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.linkedAlterIds.map(id => getAlterName(id)).join(', ')}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing({ ...p }); setIsNew(false); }} className="text-muted-foreground hover:text-foreground"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => deleteInnerWorldPlace(p.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </AdminListItem>
        ))}
      </AdminList>
    </div>
  );
}
