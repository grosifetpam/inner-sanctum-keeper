import { useMemo, useState, useRef, useEffect } from 'react';
import type { Alter, AlterRelation } from '@/types/system';
import { motion } from 'framer-motion';

// Role zones positioned on a conceptual map
const ROLE_ZONES: Record<string, { x: number; y: number; label: string; color: string }> = {
  'hôte': { x: 0.5, y: 0.35, label: '🌙 Hôte', color: 'hsl(var(--primary))' },
  'protecteur': { x: 0.2, y: 0.25, label: '🛡 Protecteurs', color: '#fbbf24' },
  'persécuteur': { x: 0.8, y: 0.25, label: '⚡ Persécuteurs', color: '#f87171' },
  'gardien': { x: 0.25, y: 0.65, label: '📖 Gardiens', color: '#a78bfa' },
  'observateur': { x: 0.75, y: 0.65, label: '👁 Observateurs', color: '#7dd3fc' },
  'trauma holder': { x: 0.5, y: 0.8, label: '💔 Trauma Holders', color: '#f0abfc' },
  'autre': { x: 0.5, y: 0.55, label: '✦ Autres', color: '#94a3b8' },
};

const RELATION_COLORS: Record<string, string> = {
  'allié': '#7dd3fc',
  'protecteur': '#fbbf24',
  'conflit': '#f87171',
  'influence': '#a78bfa',
  'famille interne': '#f0abfc',
};

interface Props {
  alters: Alter[];
  relations: AlterRelation[];
}

interface AlterNode {
  alter: Alter;
  x: number;
  y: number;
}

export default function PsychologicalMap({ alters, relations }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 700, height: 500 });
  const [hoveredAlter, setHoveredAlter] = useState<string | null>(null);
  const [selectedAlter, setSelectedAlter] = useState<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setDims({ width: w, height: Math.max(400, w * 0.7) });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const { width, height } = dims;
  const pad = 45;

  // Group alters by role and spread them within their zone
  const nodes: AlterNode[] = useMemo(() => {
    const grouped: Record<string, Alter[]> = {};
    alters.forEach(a => {
      const key = a.roleType || 'autre';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(a);
    });

    const result: AlterNode[] = [];
    Object.entries(grouped).forEach(([role, members]) => {
      const zone = ROLE_ZONES[role] || ROLE_ZONES['autre'];
      const baseCx = pad + zone.x * (width - pad * 2);
      const baseCy = pad + zone.y * (height - pad * 2);
      const spread = Math.min(60, (width - pad * 2) * 0.08);

      members.forEach((a, i) => {
        const angle = (2 * Math.PI * i) / members.length;
        const r = members.length === 1 ? 0 : spread;
        result.push({
          alter: a,
          x: baseCx + r * Math.cos(angle),
          y: baseCy + r * Math.sin(angle),
        });
      });
    });
    return result;
  }, [alters, width, height]);

  const getNode = (id: string) => nodes.find(n => n.alter.id === id);

  const isConnected = (alterId: string) => {
    const target = selectedAlter || hoveredAlter;
    if (!target) return true;
    if (alterId === target) return true;
    return relations.some(
      r => (r.fromAlterId === target && r.toAlterId === alterId) ||
        (r.toAlterId === target && r.fromAlterId === alterId)
    );
  };

  const activeAlter = selectedAlter || hoveredAlter;
  const activeRelations = activeAlter
    ? relations.filter(r => r.fromAlterId === activeAlter || r.toAlterId === activeAlter)
    : [];

  // Stats
  const roleStats = useMemo(() => {
    const counts: Record<string, number> = {};
    alters.forEach(a => {
      counts[a.roleType] = (counts[a.roleType] || 0) + 1;
    });
    return counts;
  }, [alters]);

  return (
    <div ref={containerRef} className="w-full space-y-4">
      {/* Role stats bar */}
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.entries(ROLE_ZONES).map(([role, zone]) => {
          const count = roleStats[role] || 0;
          if (count === 0) return null;
          return (
            <div key={role} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-ui"
              style={{ backgroundColor: zone.color + '20', color: zone.color, border: `1px solid ${zone.color}40` }}>
              <span>{zone.label}</span>
              <span className="font-bold">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Map */}
      <svg width={width} height={height} className="select-none" style={{ background: 'radial-gradient(ellipse at center, hsl(var(--card)) 0%, transparent 70%)' }}>
        {/* Zone labels */}
        {Object.entries(ROLE_ZONES).map(([role, zone]) => {
          if (!roleStats[role]) return null;
          const zx = pad + zone.x * (width - pad * 2);
          const zy = pad + zone.y * (height - pad * 2);
          return (
            <g key={role}>
              <circle cx={zx} cy={zy} r={Math.min(80, width * 0.1)} fill={zone.color} opacity={0.05} />
              <text x={zx} y={zy - Math.min(70, width * 0.09)} textAnchor="middle" fill={zone.color} fontSize={10} opacity={0.6} fontFamily="ui-sans-serif">
                {zone.label}
              </text>
            </g>
          );
        })}

        {/* Relation lines */}
        {relations.map((r) => {
          const from = getNode(r.fromAlterId);
          const to = getNode(r.toAlterId);
          if (!from || !to) return null;
          const color = RELATION_COLORS[r.type] || '#888';
          const isActive = !activeAlter || activeRelations.some(ar => ar.id === r.id);

          // Curved line
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const curveMag = 20;
          const cx1 = midX - dy * curveMag / Math.max(1, Math.sqrt(dx * dx + dy * dy));
          const cy1 = midY + dx * curveMag / Math.max(1, Math.sqrt(dx * dx + dy * dy));

          return (
            <path
              key={r.id}
              d={`M ${from.x} ${from.y} Q ${cx1} ${cy1} ${to.x} ${to.y}`}
              fill="none"
              stroke={color}
              strokeWidth={isActive ? 2.5 : 1}
              opacity={isActive ? 0.8 : 0.1}
              strokeDasharray={r.type === 'conflit' ? '5 3' : undefined}
            />
          );
        })}

        {/* Influence aura for active alter */}
        {activeAlter && (() => {
          const node = getNode(activeAlter);
          if (!node) return null;
          const connectedCount = activeRelations.length;
          const auraRadius = 30 + connectedCount * 12;
          const zone = ROLE_ZONES[node.alter.roleType] || ROLE_ZONES['autre'];
          return (
            <circle cx={node.x} cy={node.y} r={auraRadius} fill={zone.color} opacity={0.08}>
              <animate attributeName="r" values={`${auraRadius};${auraRadius + 5};${auraRadius}`} dur="2s" repeatCount="indefinite" />
            </circle>
          );
        })()}

        {/* Alter nodes */}
        {nodes.map((n) => {
          const active = isConnected(n.alter.id);
          const isSelected = n.alter.id === activeAlter;
          const zone = ROLE_ZONES[n.alter.roleType] || ROLE_ZONES['autre'];
          const nodeR = isSelected ? 26 : 22;

          return (
            <g key={n.alter.id}
              onMouseEnter={() => setHoveredAlter(n.alter.id)}
              onMouseLeave={() => setHoveredAlter(null)}
              onClick={() => setSelectedAlter(prev => prev === n.alter.id ? null : n.alter.id)}
              style={{ cursor: 'pointer' }}
            >
              {/* Selection ring */}
              {isSelected && (
                <circle cx={n.x} cy={n.y} r={nodeR + 5} fill="none" stroke={zone.color} strokeWidth={2} opacity={0.7}>
                  <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Node bg */}
              <circle cx={n.x} cy={n.y} r={nodeR} fill="hsl(var(--card))" stroke={zone.color} strokeWidth={isSelected ? 2 : 1} opacity={active ? 1 : 0.25} />

              {/* Avatar or initial */}
              <defs>
                <clipPath id={`psych-clip-${n.alter.id}`}>
                  <circle cx={n.x} cy={n.y} r={nodeR - 2} />
                </clipPath>
              </defs>
              {n.alter.avatar ? (
                <image
                  href={n.alter.avatar}
                  x={n.x - nodeR + 2} y={n.y - nodeR + 2}
                  width={(nodeR - 2) * 2} height={(nodeR - 2) * 2}
                  clipPath={`url(#psych-clip-${n.alter.id})`}
                  opacity={active ? 1 : 0.25}
                />
              ) : (
                <text x={n.x} y={n.y + 5} textAnchor="middle" fill={zone.color} fontSize={13} fontWeight="bold" opacity={active ? 1 : 0.25}>
                  {n.alter.name[0]}
                </text>
              )}

              {/* Name */}
              <text x={n.x} y={n.y + nodeR + 14} textAnchor="middle" fill="hsl(var(--foreground))" fontSize={11} fontFamily="ui-sans-serif" opacity={active ? 1 : 0.25}>
                {n.alter.name}
              </text>
              {/* Role type */}
              <text x={n.x} y={n.y + nodeR + 26} textAnchor="middle" fill={zone.color} fontSize={9} fontFamily="ui-sans-serif" opacity={active ? 0.7 : 0.15}>
                {n.alter.roleType}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Detail panel */}
      {selectedAlter && (() => {
        const alter = alters.find(a => a.id === selectedAlter);
        if (!alter) return null;
        const zone = ROLE_ZONES[alter.roleType] || ROLE_ZONES['autre'];
        const rels = relations.filter(r => r.fromAlterId === selectedAlter || r.toAlterId === selectedAlter);
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-grimoire p-4 border-l-4"
            style={{ borderLeftColor: zone.color }}
          >
            <div className="flex items-center gap-3 mb-3">
              {alter.avatar ? (
                <img src={alter.avatar} alt={alter.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-display text-sm" style={{ backgroundColor: zone.color + '30', color: zone.color }}>
                  {alter.name[0]}
                </div>
              )}
              <div>
                <h3 className="font-display text-foreground text-sm">{alter.name}</h3>
                <p className="text-xs text-muted-foreground">{alter.roleType} • {alter.pronouns}</p>
              </div>
            </div>
            {alter.personality && <p className="text-xs text-muted-foreground mb-2"><span className="text-foreground">Personnalité :</span> {alter.personality}</p>}
            {rels.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {rels.map(r => {
                  const otherId = r.fromAlterId === selectedAlter ? r.toAlterId : r.fromAlterId;
                  const other = alters.find(a => a.id === otherId);
                  return (
                    <span key={r.id} className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: (RELATION_COLORS[r.type] || '#888') + '25', color: RELATION_COLORS[r.type] || '#888' }}>
                      {r.type} → {other?.name || '?'}
                    </span>
                  );
                })}
              </div>
            )}
          </motion.div>
        );
      })()}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center text-[10px] font-ui text-muted-foreground">
        {Object.entries(RELATION_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1">
            <span className="w-4 h-0.5 inline-block rounded" style={{ backgroundColor: color }} />
            <span>{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
