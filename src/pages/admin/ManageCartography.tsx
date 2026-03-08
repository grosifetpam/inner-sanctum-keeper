import { useSystem } from '@/contexts/SystemContext';
import PsychologicalMap from '@/components/PsychologicalMap';

export default function ManageCartography() {
  const { data } = useSystem();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display text-foreground">Cartographie psychologique</h1>
        <p className="text-sm text-muted-foreground mt-1">Visualisation interactive des rôles, influences et relations du système</p>
      </div>

      <div className="card-grimoire p-6">
        <PsychologicalMap alters={data.alters} relations={data.relations} />
      </div>
    </div>
  );
}
