import { useState } from 'react';
import { useSystem } from '@/contexts/SystemContext';

export default function JournalPage() {
  const { data, getAlterName } = useSystem();
  const [filterAlterId, setFilterAlterId] = useState('all');

  const publicEntries = data.journal
    .filter(j => j.isPublic && !j.isPrivateAlterJournal)
    .filter(j => filterAlterId === 'all' || j.alterId === filterAlterId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const publicAlters = data.alters.filter(a => a.isPublic);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display text-glow tracking-wider mb-2">Journal</h1>
        <div className="divider-ornate w-32 mx-auto mb-4" />
      </div>

      <div className="mb-6">
        <select
          value={filterAlterId}
          onChange={e => setFilterAlterId(e.target.value)}
          className="bg-input border border-border rounded px-3 py-2 text-sm font-ui text-foreground"
        >
          <option value="all">Tous les alters</option>
          {publicAlters.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-6">
        {publicEntries.map(entry => (
          <div key={entry.id} className="card-grimoire p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-lg text-foreground">{entry.title}</h2>
              <span className="text-xs font-ui text-muted-foreground">{entry.date}</span>
            </div>
            <p className="text-xs font-ui text-gold mb-3">Par {getAlterName(entry.alterId)}</p>
            <p className="font-body text-foreground/80 leading-relaxed whitespace-pre-wrap">{entry.content}</p>
            {entry.tags.length > 0 && (
              <div className="flex gap-2 mt-3">
                {entry.tags.map(tag => (
                  <span key={tag} className="text-xs font-ui bg-accent/30 text-accent-foreground px-2 py-0.5 rounded">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        ))}
        {publicEntries.length === 0 && (
          <p className="text-center text-muted-foreground font-body py-12">Aucune entrée pour le moment.</p>
        )}
      </div>
    </div>
  );
}
