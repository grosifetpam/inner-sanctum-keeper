import { useSystem } from '@/contexts/SystemContext';
import { Quote } from 'lucide-react';

export default function CitationsPage() {
  const { data, getAlterName } = useSystem();
  const publicCitations = data.citations.filter(c => c.isPublic);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display text-glow tracking-wider mb-2">Citations</h1>
        <div className="divider-ornate w-32 mx-auto mb-4" />
      </div>

      <div className="space-y-6">
        {publicCitations.map(c => (
          <div key={c.id} className="card-grimoire p-6 text-center">
            <Quote className="w-5 h-5 text-primary/30 mx-auto mb-3" />
            <blockquote className="text-lg font-body italic text-foreground/80 mb-2">"{c.text}"</blockquote>
            <p className="text-sm text-muted-foreground font-ui">— {getAlterName(c.alterId)} • {c.date}</p>
          </div>
        ))}
        {publicCitations.length === 0 && (
          <p className="text-center text-muted-foreground font-body py-12">Aucune citation pour le moment.</p>
        )}
      </div>
    </div>
  );
}
