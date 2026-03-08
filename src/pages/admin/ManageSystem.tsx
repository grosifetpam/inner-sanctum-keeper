import { useState, useRef } from 'react';
import { useSystem } from '@/contexts/SystemContext';
import { Settings, Upload, X, Image } from 'lucide-react';
import { AdminPageHeader, AdminFormCard } from '@/components/admin/AdminPageWrapper';
import { uploadImage, deleteImage } from '@/lib/storage';
import { toast } from 'sonner';

export default function ManageSystem() {
  const { data, updateSystemInfo, user } = useSystem();
  const [form, setForm] = useState({ ...data.systemInfo });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const save = async () => {
    try {
      await updateSystemInfo(form);
      toast.success('Paramètres sauvegardés');
    } catch (e) {
      console.error('Save error:', e);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const url = await uploadImage('inner-world', user.id, file);
    if (url) setForm(prev => ({ ...prev, homepageImage: url }));
    setUploading(false);
  };

  const removeImage = async () => {
    if (form.homepageImage) {
      await deleteImage('inner-world', form.homepageImage);
      setForm(prev => ({ ...prev, homepageImage: '' }));
    }
  };

  return (
    <div>
      <AdminPageHeader title="Paramètres du système" icon={Settings} />

      <AdminFormCard>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-ui text-muted-foreground uppercase tracking-wider">Nom du système</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground mt-1" />
          </div>
          <div>
            <label className="text-xs font-ui text-muted-foreground uppercase tracking-wider">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground mt-1 min-h-[100px]" />
          </div>
          <div>
            <label className="text-xs font-ui text-muted-foreground uppercase tracking-wider">Humeur du jour</label>
            <input value={form.moodOfDay} onChange={e => setForm({ ...form, moodOfDay: e.target.value })} className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground mt-1" />
          </div>
          <div>
            <label className="text-xs font-ui text-muted-foreground uppercase tracking-wider">Alter au front</label>
            <select value={form.currentFrontAlterId} onChange={e => setForm({ ...form, currentFrontAlterId: e.target.value })} className="w-full bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground mt-1">
              {data.alters.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>

          {/* Homepage image */}
          <div>
            <label className="text-xs font-ui text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Image className="w-3.5 h-3.5" /> Image de la page d'accueil
            </label>
            {form.homepageImage ? (
              <div className="relative inline-block">
                <img src={form.homepageImage} alt="Accueil" className="w-full max-w-md h-48 object-cover rounded border border-border" />
                <button onClick={removeImage} className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:opacity-80 transition-opacity">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full max-w-md h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
              >
                <Upload className="w-6 h-6" />
                <span className="text-sm font-ui">{uploading ? 'Envoi en cours…' : 'Cliquez pour ajouter une image'}</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>

          <button onClick={save} className="btn-grimoire">Sauvegarder</button>
        </div>
      </AdminFormCard>
    </div>
  );
}
