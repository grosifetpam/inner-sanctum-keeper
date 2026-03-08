import { useState } from 'react';
import { useSystem } from '@/contexts/SystemContext';
import type { JournalEntry } from '@/types/system';
import { Plus, Trash2, Edit2, X, Eye, EyeOff, Lock, BookOpen } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { AdminPageHeader, AdminList, AdminListItem, AdminFormCard } from '@/components/admin/AdminPageWrapper';
import { playQuillSound } from '@/lib/sounds';

export default function ManageJournal() {
  const { data, addJournalEntry, updateJournalEntry, deleteJournalEntry, getAlterName } = useSystem();
  const [editing, setEditing] = useState<JournalEntry | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const startNew = () => {
    playQuillSound();
    setEditing({ id: crypto.randomUUID(), date: new Date().toISOString().split('T')[0], alterId: data.alters[0]?.id || '', title: '', content: '', tags: [], isPublic: true, isPrivateAlterJournal: false });
    setIsNew(true); setTagInput('');
  };

  const save = () => { if (!editing || !editing.title.trim()) return; if (isNew) addJournalEntry(editing); else updateJournalEntry(editing); setEditing(null); };

  const addTag = () => { if (!tagInput.trim() || !editing) return; setEditing({ ...editing, tags: [...editing.tags, tagInput.trim()] }); setTagInput(''); };

  return (
    <div>
      <AdminPageHeader title="Journal" icon={BookOpen}>
        <button onClick={startNew} className="btn-grimoire flex items-center gap-2 text-xs"><Plus className="w-4 h-4" /> Ajouter</button>
      </AdminPageHeader>

      <AnimatePresence>
        {editing && (
          <AdminFormCard>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-foreground">{isNew ? 'Nouvelle entrée' : 'Modifier'}</h2>
              <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-ui text-muted-foreground uppercase tracking-wider">Titre</label>
                <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground mt-1" />
              </div>
              <div>
                <label className="text-xs font-ui text-muted-foreground uppercase tracking-wider">Date</label>
                <input type="date" value={editing.date} onChange={e => setEditing({ ...editing, date: e.target.value })} className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground mt-1" />
              </div>
              <div>
                <label className="text-xs font-ui text-muted-foreground uppercase tracking-wider">Alter auteur</label>
                <select value={editing.alterId} onChange={e => setEditing({ ...editing, alterId: e.target.value })} className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground mt-1">
                  {data.alters.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-4 mt-6">
                <button onClick={() => setEditing({ ...editing, isPublic: !editing.isPublic })} className={`flex items-center gap-1 text-xs font-ui ${editing.isPublic ? 'text-gold' : 'text-muted-foreground'}`}>
                  {editing.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />} {editing.isPublic ? 'Public' : 'Privé'}
                </button>
                <button onClick={() => setEditing({ ...editing, isPrivateAlterJournal: !editing.isPrivateAlterJournal })} className={`flex items-center gap-1 text-xs font-ui ${editing.isPrivateAlterJournal ? 'text-primary' : 'text-muted-foreground'}`}>
                  <Lock className="w-4 h-4" /> {editing.isPrivateAlterJournal ? 'Journal privé' : 'Journal commun'}
                </button>
              </div>
            </div>
            <div className="mt-4">
              <label className="text-xs font-ui text-muted-foreground uppercase tracking-wider">Contenu</label>
              <textarea value={editing.content} onChange={e => setEditing({ ...editing, content: e.target.value })} className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground mt-1 min-h-[120px]" />
            </div>
            <div className="mt-4">
              <label className="text-xs font-ui text-muted-foreground uppercase tracking-wider">Tags</label>
              <div className="flex gap-2 mt-1">
                <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} className="flex-1 bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground" placeholder="Ajouter un tag" />
                <button onClick={addTag} className="btn-grimoire text-xs">+</button>
              </div>
              <div className="flex gap-1 mt-2 flex-wrap">
                {editing.tags.map((tag, i) => (
                  <span key={i} className="text-xs font-ui bg-accent/30 text-accent-foreground px-2 py-0.5 rounded flex items-center gap-1">
                    #{tag}
                    <button onClick={() => setEditing({ ...editing, tags: editing.tags.filter((_, j) => j !== i) })} className="text-muted-foreground hover:text-foreground">×</button>
                  </span>
                ))}
              </div>
            </div>
            <button onClick={save} className="btn-grimoire mt-4">Sauvegarder</button>
          </AdminFormCard>
        )}
      </AnimatePresence>

      <AdminList>
        {data.journal.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(entry => (
          <AdminListItem key={entry.id}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-ui text-foreground">{entry.title}</p>
                  {entry.isPrivateAlterJournal && <Lock className="w-3 h-3 text-primary" />}
                </div>
                <p className="text-xs text-muted-foreground">{entry.date} • {getAlterName(entry.alterId)} • {entry.isPublic ? 'Public' : 'Privé'}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing({ ...entry }); setIsNew(false); }} className="text-muted-foreground hover:text-foreground"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => deleteJournalEntry(entry.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </AdminListItem>
        ))}
      </AdminList>
    </div>
  );
}
