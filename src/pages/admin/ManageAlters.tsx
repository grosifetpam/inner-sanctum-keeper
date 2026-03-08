import { useState, useRef } from 'react';
import { useSystem } from '@/contexts/SystemContext';
import type { Alter, AlterRole } from '@/types/system';
import { Plus, Trash2, Edit2, X, Eye, EyeOff, Upload, Image as ImageIcon, Loader2, Users } from 'lucide-react';
import { uploadImage, deleteImage } from '@/lib/storage';
import { AnimatePresence } from 'framer-motion';
import { AdminPageHeader, AdminList, AdminListItem, AdminFormCard } from '@/components/admin/AdminPageWrapper';

const roleTypes: AlterRole[] = ['hôte', 'protecteur', 'persécuteur', 'gardien', 'observateur', 'trauma holder', 'autre'];

const emptyAlter: Omit<Alter, 'id'> = {
  name: '', avatar: '', role: '', roleType: 'autre', apparentAge: '', pronouns: '',
  personality: '', strengths: '', difficulties: '', relations: '', internalNotes: '', isPublic: true,
};

export default function ManageAlters() {
  const { data, addAlter, updateAlter, deleteAlter, user } = useSystem();
  const [editing, setEditing] = useState<Alter | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startNew = () => { setEditing({ id: crypto.randomUUID(), ...emptyAlter }); setIsNew(true); };
  const startEdit = (a: Alter) => { setEditing({ ...a }); setIsNew(false); };
  const save = () => { if (!editing || !editing.name.trim()) return; if (isNew) addAlter(editing); else updateAlter(editing); setEditing(null); };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing || !user) return;
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) return;
    setUploading(true);
    try {
      if (editing.avatar) await deleteImage('avatars', editing.avatar);
      const url = await uploadImage('avatars', user.id, file);
      if (url) setEditing(prev => prev ? { ...prev, avatar: url } : null);
    } finally { setUploading(false); }
  };

  const removeAvatar = async () => {
    if (!editing) return;
    if (editing.avatar) await deleteImage('avatars', editing.avatar);
    setEditing(prev => prev ? { ...prev, avatar: '' } : null);
  };

  const field = (label: string, key: keyof Alter, textarea = false) => (
    <div>
      <label className="text-xs font-ui text-muted-foreground uppercase tracking-wider">{label}</label>
      {textarea ? (
        <textarea value={(editing as any)?.[key] || ''} onChange={e => setEditing(prev => prev ? { ...prev, [key]: e.target.value } : null)}
          className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground mt-1 min-h-[60px]" />
      ) : (
        <input value={(editing as any)?.[key] || ''} onChange={e => setEditing(prev => prev ? { ...prev, [key]: e.target.value } : null)}
          className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground mt-1" />
      )}
    </div>
  );

  return (
    <div>
      <AdminPageHeader title="Alters" icon={Users}>
        <button onClick={startNew} className="btn-grimoire flex items-center gap-2 text-xs"><Plus className="w-4 h-4" /> Ajouter</button>
      </AdminPageHeader>

      <AnimatePresence>
        {editing && (
          <AdminFormCard>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-foreground">{isNew ? 'Nouvel alter' : 'Modifier'}</h2>
              <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-card border-2 border-border flex items-center justify-center">
                  {uploading ? <Loader2 className="w-6 h-6 text-primary animate-spin" /> : editing.avatar ? <img src={editing.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 text-muted-foreground" />}
                </div>
                <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload className="w-5 h-5 text-foreground" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </div>
              <div>
                <p className="text-sm font-ui text-foreground">Avatar</p>
                <p className="text-xs text-muted-foreground">Cliquer pour uploader (max 5 Mo)</p>
                {editing.avatar && <button onClick={removeAvatar} className="text-xs text-destructive hover:underline mt-1">Supprimer l'avatar</button>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {field('Nom', 'name')}
              {field('Pronoms', 'pronouns')}
              {field('Âge apparent', 'apparentAge')}
              {field('Rôle', 'role')}
              <div>
                <label className="text-xs font-ui text-muted-foreground uppercase tracking-wider">Type de rôle</label>
                <select value={editing.roleType} onChange={e => setEditing(prev => prev ? { ...prev, roleType: e.target.value as AlterRole } : null)}
                  className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground mt-1">
                  {roleTypes.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2 mt-6">
                <label className="text-xs font-ui text-muted-foreground">Visible publiquement</label>
                <button onClick={() => setEditing(prev => prev ? { ...prev, isPublic: !prev.isPublic } : null)}
                  className={`p-1 rounded ${editing.isPublic ? 'text-gold' : 'text-muted-foreground'}`}>
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
          </AdminFormCard>
        )}
      </AnimatePresence>

      <AdminList>
        {data.alters.map(a => (
          <AdminListItem key={a.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center font-display text-sm text-primary">
                  {a.avatar ? <img src={a.avatar} alt={a.name} className="w-full h-full object-cover" /> : a.name[0]}
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
          </AdminListItem>
        ))}
      </AdminList>
    </div>
  );
}
