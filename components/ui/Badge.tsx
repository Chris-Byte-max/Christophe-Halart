import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'ghost'

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-600 border border-slate-200',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  danger: 'bg-red-50 text-red-700 border border-red-200',
  info: 'bg-sky-50 text-sky-700 border border-sky-200',
  purple: 'bg-violet-50 text-violet-700 border border-violet-200',
  ghost: 'bg-white text-slate-600 border border-slate-200',
}

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
  dot?: boolean
  dotColor?: string
}

export function Badge({ children, variant = 'default', className, dot, dotColor }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium', variantClasses[variant], className)}>
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={dotColor ? { backgroundColor: dotColor } : undefined}
        />
      )}
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    overdue: { variant: 'danger', label: 'Overdue' },
    'at-risk': { variant: 'warning', label: 'At Risk' },
    'on-track': { variant: 'success', label: 'On Track' },
    done: { variant: 'success', label: 'Done' },
    live: { variant: 'success', label: 'Live' },
    planning: { variant: 'info', label: 'Planning' },
    approved: { variant: 'success', label: 'Approved' },
    paused: { variant: 'warning', label: 'Paused' },
    completed: { variant: 'default', label: 'Completed' },
    draft: { variant: 'ghost', label: 'Draft' },
    published: { variant: 'success', label: 'Published' },
    review: { variant: 'info', label: 'In Review' },
    pending: { variant: 'warning', label: 'Pending' },
    'changes-requested': { variant: 'warning', label: 'Changes Needed' },
    rejected: { variant: 'danger', label: 'Rejected' },
    compliant: { variant: 'success', label: 'Compliant' },
    'review-needed': { variant: 'warning', label: 'Review Needed' },
    'non-compliant': { variant: 'danger', label: 'Non-Compliant' },
    'not-submitted': { variant: 'ghost', label: 'Not Submitted' },
    behind: { variant: 'danger', label: 'Behind' },
    urgent: { variant: 'danger', label: 'Urgent' },
    normal: { variant: 'default', label: 'Normal' },
    low: { variant: 'ghost', label: 'Low' },
  }
  const config = map[status] ?? { variant: 'default' as BadgeVariant, label: status }
  return <Badge variant={config.variant}>{config.label}</Badge>
}
