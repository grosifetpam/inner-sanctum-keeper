import { useSystem } from '@/contexts/SystemContext';
import PsychologicalMap from '@/components/PsychologicalMap';

export default function CartographyPage() {
  const { data } = useSystem();
  const publicAlters = data.alters.filter(a => a.isPublic);
  const publicRelations = data.relations.filter(r =>
    publicAlters.some(a => a.id === r.fromAlterId) && publicAlters.some(a => a.id === r.toAlterId)
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-display text-foreground mb-2">Cartographie du Système</h1>
        <p className="text-muted-foreground text-sm">Explorez les rôles, influences et relations entre les alters</p>
      </div>
      <div className="card-grimoire p-6">
        {publicAlters.length > 0 ? (
          <PsychologicalMap alters={publicAlters} relations={publicRelations} />
        ) : (
          <p className="text-center text-muted-foreground py-12">Aucun alter public à afficher.</p>
        )}
      </div>
    </div>
  );
}
