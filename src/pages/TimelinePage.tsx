import { useSystem } from '@/contexts/SystemContext';

export default function TimelinePage() {
  const { data, getAlterName } = useSystem();
  const publicEvents = data.timeline
    .filter(t => t.isPublic)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display text-glow tracking-wider mb-2">Chronologie</h1>
        <div className="divider-ornate w-32 mx-auto mb-4" />
      </div>

      <div className="relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border" />

        {publicEvents.map((event, i) => (
          <div key={event.id} className={`relative flex mb-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
            <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1.5 mt-5 z-10" />
            <div className={`ml-10 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-10' : 'md:pl-10'}`}>
              <div className="card-grimoire p-4">
                <p className="text-xs font-ui text-gold mb-1">{event.date}</p>
                <h3 className="font-display text-foreground mb-1">{event.title}</h3>
                <p className="text-sm font-body text-foreground/70">{event.description}</p>
                {event.alterId && (
                  <p className="text-xs font-ui text-muted-foreground mt-2">Alter : {getAlterName(event.alterId)}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
