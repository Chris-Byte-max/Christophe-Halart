import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  barClassName?: string
  size?: 'sm' | 'md'
  showLabel?: boolean
  color?: 'violet' | 'emerald' | 'amber' | 'red' | 'sky' | 'auto'
}

export function ProgressBar({
  value,
  max = 100,
  className,
  barClassName,
  size = 'sm',
  showLabel = false,
  color = 'violet',
}: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100))

  const autoColor =
    color === 'auto'
      ? pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500'
      : {
          violet: 'bg-violet-600',
          emerald: 'bg-emerald-500',
          amber: 'bg-amber-500',
          red: 'bg-red-500',
          sky: 'bg-sky-500',
        }[color]

  const heightClass = size === 'sm' ? 'h-1.5' : 'h-2.5'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('flex-1 bg-slate-100 rounded-full overflow-hidden', heightClass)}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', autoColor, barClassName)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-slate-600 w-8 text-right">{pct}%</span>
      )}
    </div>
  )
}
