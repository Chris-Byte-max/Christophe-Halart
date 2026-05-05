import { OPCO_COLORS, OPCO_NAMES } from '@/lib/data/omnitracker';

interface OpCoBadgeProps {
  opco: string;
  showName?: boolean;
}

export default function OpCoBadge({ opco, showName = false }: OpCoBadgeProps) {
  const color = OPCO_COLORS[opco] || '#6B7280';
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
      {showName ? OPCO_NAMES[opco] || opco : opco}
    </span>
  );
}
