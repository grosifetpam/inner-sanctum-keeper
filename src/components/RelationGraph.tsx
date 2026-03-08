import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import type { Alter, AlterRelation } from '@/types/system';

const RELATION_COLORS: Record<string, string> = {
  'allié': '#7dd3fc',       // sky-300
  'protecteur': '#fbbf24',  // amber-400
  'conflit': '#f87171',     // red-400
  'influence': '#a78bfa',   // violet-400
  'famille interne': '#f0abfc', // fuchsia-300
};

const RELATION_LABELS: Record<string, string> = {
  'allié': '⚔ Allié',
  'protecteur': '🛡 Protecteur',
  'conflit': '⚡ Conflit',
  'influence': '🌀 Influence',
  'famille interne': '💜 Famille',
};

interface Props {
  alters: Alter[];
  relations: AlterRelation[];
}

interface NodePos {
  id: string;
  x: number;
  y: number;
}

export default function RelationGraph({ alters, relations }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredRelation, setHoveredRelation] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      setDimensions({ width: entry.contentRect.width, height: Math.max(350, entry.contentRect.width * 0.6) });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const { width, height } = dimensions;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(cx, cy) - 50;

  const nodes: NodePos[] = useMemo(() => {
    return alters.map((a, i) => {
      const angle = (2 * Math.PI * i) / alters.length - Math.PI / 2;
      return { id: a.id, x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
    });
  }, [alters, cx, cy, radius]);

  const getNode = useCallback((id: string) => nodes.find(n => n.id === id), [nodes]);
  const getAlter = useCallback((id: string) => alters.find(a => a.id === id), [alters]);

  const isHighlighted = (alterId: string) => {
    if (!hoveredNode) return true;
    if (alterId === hoveredNode) return true;
    return relations.some(
      r => (r.fromAlterId === hoveredNode && r.toAlterId === alterId) ||
           (r.toAlterId === hoveredNode && r.fromAlterId === alterId)
    );
  };

  return (
    <div ref={containerRef} className="w-full">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 justify-center">
        {Object.entries(RELATION_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5 text-xs font-ui">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-muted-foreground">{RELATION_LABELS[type] || type}</span>
          </div>
        ))}
      </div>

      <svg width={width} height={height} className="select-none">
        {/* Relation lines */}
        {relations.map((r) => {
          const from = getNode(r.fromAlterId);
          const to = getNode(r.toAlterId);
          if (!from || !to) return null;
          const color = RELATION_COLORS[r.type] || '#888';
          const isActive = hoveredRelation === r.id || (!hoveredRelation && isHighlighted(r.fromAlterId) && isHighlighted(r.toAlterId));
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;

          return (
            <g key={r.id}
              onMouseEnter={() => setHoveredRelation(r.id)}
              onMouseLeave={() => setHoveredRelation(null)}
              style={{ cursor: 'pointer' }}
            >
              <line
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={color}
                strokeWidth={isActive ? 3 : 1.5}
                opacity={isActive ? 1 : 0.2}
                strokeDasharray={r.type === 'conflit' ? '6 4' : undefined}
              />
              {/* Arrow indicator */}
              {r.type === 'protecteur' && (
                <polygon
                  points={arrowHead(from, to)}
                  fill={color}
                  opacity={isActive ? 1 : 0.2}
                />
              )}
              {/* Label on hover */}
              {hoveredRelation === r.id && (
                <text x={midX} y={midY - 8} textAnchor="middle" fill={color} fontSize={11} fontFamily="ui-sans-serif">
                  {r.type}
                </text>
              )}
            </g>
          );
        })}

        {/* Alter nodes */}
        {nodes.map((n) => {
          const alter = getAlter(n.id);
          if (!alter) return null;
          const active = isHighlighted(n.id);
          const nodeRadius = hoveredNode === n.id ? 28 : 24;

          return (
            <g key={n.id}
              onMouseEnter={() => setHoveredNode(n.id)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Glow */}
              {hoveredNode === n.id && (
                <circle cx={n.x} cy={n.y} r={nodeRadius + 6} fill="none" stroke="hsl(var(--gold))" strokeWidth={1.5} opacity={0.5} />
              )}
              {/* Avatar circle */}
              <defs>
                <clipPath id={`clip-${n.id}`}>
                  <circle cx={n.x} cy={n.y} r={nodeRadius} />
                </clipPath>
              </defs>
              {alter.avatar ? (
                <>
                  <circle cx={n.x} cy={n.y} r={nodeRadius} fill="hsl(var(--card))" opacity={active ? 1 : 0.3} />
                  <image
                    href={alter.avatar}
                    x={n.x - nodeRadius} y={n.y - nodeRadius}
                    width={nodeRadius * 2} height={nodeRadius * 2}
                    clipPath={`url(#clip-${n.id})`}
                    opacity={active ? 1 : 0.3}
                  />
                </>
              ) : (
                <circle cx={n.x} cy={n.y} r={nodeRadius} fill="hsl(var(--primary) / 0.3)" opacity={active ? 1 : 0.3} />
              )}
              {!alter.avatar && (
                <text x={n.x} y={n.y + 5} textAnchor="middle" fill="hsl(var(--primary))" fontSize={14} fontWeight="bold" opacity={active ? 1 : 0.3}>
                  {alter.name[0]}
                </text>
              )}
              {/* Name label */}
              <text x={n.x} y={n.y + nodeRadius + 16} textAnchor="middle" fill="hsl(var(--foreground))" fontSize={12} fontFamily="ui-sans-serif" opacity={active ? 1 : 0.3}>
                {alter.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function arrowHead(from: NodePos, to: NodePos): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return '';
  const ux = dx / len;
  const uy = dy / len;
  const tipX = to.x - ux * 26;
  const tipY = to.y - uy * 26;
  const size = 8;
  const px = -uy * size;
  const py = ux * size;
  return `${tipX},${tipY} ${tipX - ux * size + px},${tipY - uy * size + py} ${tipX - ux * size - px},${tipY - uy * size - py}`;
}
