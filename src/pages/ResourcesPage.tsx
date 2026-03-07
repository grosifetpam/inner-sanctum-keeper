import { useSystem } from '@/contexts/SystemContext';
import { ExternalLink } from 'lucide-react';

const categoryLabels: Record<string, string> = {
  livres: '📚 Livres',
  films: '🎬 Films',
  séries: '📺 Séries',
  musique: '🎵 Musique',
  articles: '📰 Articles',
};

export default function ResourcesPage() {
  const { data } = useSystem();
  const publicResources = data.resources.filter(r => r.isPublic);
  const categories = [...new Set(publicResources.map(r => r.category))];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display text-glow tracking-wider mb-2">Ressources</h1>
        <div className="divider-ornate w-32 mx-auto mb-4" />
      </div>

      {categories.map(cat => (
        <div key={cat} className="mb-8">
          <h2 className="font-display text-lg text-gold mb-4">{categoryLabels[cat] || cat}</h2>
          <div className="space-y-3">
            {publicResources.filter(r => r.category === cat).map(r => (
              <div key={r.id} className="card-grimoire p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-body text-foreground">{r.title}</h3>
                  <p className="text-sm text-muted-foreground font-ui">{r.description}</p>
                </div>
                {r.link && (
                  <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 ml-4">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
