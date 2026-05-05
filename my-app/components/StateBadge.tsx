const STATE_STYLES: Record<string, { bg: string; color: string }> = {
  'Open': { bg: '#FEF3C7', color: '#D97706' },
  'In behandeling': { bg: '#EFF6FF', color: '#3B82F6' },
  'Gesloten': { bg: '#F0FDF4', color: '#16A34A' },
  'Wachten op feedback': { bg: '#FDF4FF', color: '#9333EA' },
  'Opgelost': { bg: '#F0FDF4', color: '#059669' },
};

export default function StateBadge({ state }: { state: string }) {
  const style = STATE_STYLES[state] || { bg: '#F1F5F9', color: '#64748B' };
  return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap" style={{ background: style.bg, color: style.color }}>{state}</span>;
}
