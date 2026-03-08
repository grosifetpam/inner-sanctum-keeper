import { useSystem } from '@/contexts/SystemContext';
import PsychologicalMap from '@/components/PsychologicalMap';
import { Brain } from 'lucide-react';
import { AdminPageHeader, AdminSectionCard } from '@/components/admin/AdminPageWrapper';

export default function ManageCartography() {
  const { data } = useSystem();

  return (
    <div>
      <AdminPageHeader title="Cartographie psychologique" icon={Brain} />
      <p className="text-sm text-muted-foreground -mt-4 mb-6">Visualisation interactive des rôles, influences et relations du système</p>

      <AdminSectionCard>
        <PsychologicalMap alters={data.alters} relations={data.relations} />
      </AdminSectionCard>
    </div>
  );
}
