'use client'

import { useApp } from '@/lib/context'
import {
  COMMAND_CENTER_KPIS,
  PRIORITY_TASKS,
  AI_ACTIONS,
  CAMPAIGNS,
  MONTHLY_PERFORMANCE_DATA,
  CHANNEL_MIX_DATA,
} from '@/lib/data'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { HubHeader } from '@/components/ui/HubHeader'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Sparkles,
  Zap,
  ArrowRight,
  Clock,
  User,
  Target,
  AlertCircle,
  CheckCircle,
  LightbulbIcon,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { cn, formatDeadline, getBrandBadgeClass, getHealthColor, getHealthBg } from '@/lib/utils'
import type { KPI, PriorityTask, AIAction } from '@/lib/types'

function KPICard({ kpi }: { kpi: KPI }) {
  const TrendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Minus
  const trendColor = kpi.trend === 'up' ? 'text-emerald-600' : kpi.trend === 'down' ? 'text-red-500' : 'text-slate-400'
  const changeBg = kpi.trend === 'up' ? 'bg-emerald-50' : kpi.trend === 'down' ? 'bg-red-50' : 'bg-slate-50'

  return (
    <Card className="flex flex-col gap-3">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{kpi.label}</p>
      <div className="flex items-end justify-between gap-2">
        <span className="text-2xl font-bold text-slate-900">{kpi.value}</span>
        <div className={cn('flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-medium', changeBg, trendColor)}>
          <TrendIcon size={12} />
          <span>{kpi.change > 0 ? '+' : ''}{kpi.change}{typeof kpi.change === 'number' && Math.abs(kpi.change) < 20 ? '' : ''}</span>
        </div>
      </div>
      <p className="text-[11px] text-slate-400">{kpi.period}</p>
    </Card>
  )
}

function PriorityTaskCard({ task }: { task: PriorityTask }) {
  const { getBrand } = useApp()
  const brand = getBrand(task.brand)
  const deadline = formatDeadline(task.deadline)
  const isOverdue = task.status === 'overdue'
  const isAtRisk = task.status === 'at-risk'

  return (
    <div className={cn(
      'flex items-start gap-3 p-3.5 rounded-xl border transition-all hover:shadow-sm cursor-pointer',
      isOverdue ? 'border-red-200 bg-red-50/50' : isAtRisk ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100 bg-white'
    )}>
      <div className={cn('w-1 rounded-full shrink-0 mt-1 self-stretch min-h-8', {
        critical: 'bg-red-500',
        high: 'bg-amber-500',
        medium: 'bg-sky-400',
        low: 'bg-slate-300',
      }[task.priority])} />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-sm font-medium text-slate-800 leading-snug">{task.title}</p>
          <StatusBadge status={task.status} />
        </div>
        <p className="text-xs text-slate-500 mb-2 line-clamp-1">{task.description}</p>
        <div className="flex items-center gap-3 flex-wrap">
          <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded-md border', getBrandBadgeClass(task.brand))}>
            {brand?.shortName}
          </span>
          <span className={cn('flex items-center gap-1 text-xs', isOverdue ? 'text-red-600 font-medium' : 'text-slate-500')}>
            <Clock size={11} />
            {deadline}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <User size={11} />
            {task.owner}
          </span>
          <span className="flex items-center gap-1 text-xs text-violet-600 font-medium ml-auto">
            <Target size={11} />
            {task.impact}
          </span>
        </div>
      </div>

      <button className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
        <ArrowRight size={14} />
      </button>
    </div>
  )
}

function AIActionCard({ action }: { action: AIAction }) {
  const { getBrand } = useApp()
  const brand = action.brand ? getBrand(action.brand) : null

  const icons: Record<AIAction['type'], React.ElementType> = {
    opportunity: LightbulbIcon,
    risk: AlertTriangle,
    recommendation: Sparkles,
    alert: AlertCircle,
  }

  const colors: Record<AIAction['type'], { bg: string; icon: string; border: string }> = {
    opportunity: { bg: 'bg-violet-50', icon: 'text-violet-600', border: 'border-violet-100' },
    risk: { bg: 'bg-red-50', icon: 'text-red-500', border: 'border-red-100' },
    recommendation: { bg: 'bg-sky-50', icon: 'text-sky-600', border: 'border-sky-100' },
    alert: { bg: 'bg-amber-50', icon: 'text-amber-500', border: 'border-amber-100' },
  }

  const c = colors[action.type]
  const Icon = icons[action.type]

  return (
    <div className={cn('p-3.5 rounded-xl border', c.bg, c.border)}>
      <div className="flex items-start gap-3">
        <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center bg-white shrink-0', c.border, 'border')}>
          <Icon size={14} className={c.icon} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 leading-snug mb-1">{action.title}</p>
          <p className="text-xs text-slate-600 line-clamp-2 mb-2">{action.description}</p>
          <div className="flex items-center gap-2 flex-wrap">
            {brand && (
              <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded-md border', getBrandBadgeClass(action.brand!))}>
                {brand.shortName}
              </span>
            )}
            <Badge variant={action.impact === 'high' ? 'danger' : action.impact === 'medium' ? 'warning' : 'default'}>
              {action.impact} impact
            </Badge>
            <Badge variant="ghost">{action.effort} effort</Badge>
            <button className="ml-auto flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors">
              Take action <ArrowRight size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CommandCenter() {
  const { currentUser, currentBrand } = useApp()

  const filteredTasks = currentBrand.id === 'group'
    ? PRIORITY_TASKS
    : PRIORITY_TASKS.filter((t) => t.brand === currentBrand.id || t.brand === 'group')

  const filteredActions = currentBrand.id === 'group'
    ? AI_ACTIONS
    : AI_ACTIONS.filter((a) => !a.brand || a.brand === currentBrand.id)

  const activeCampaigns = CAMPAIGNS.filter((c) =>
    (currentBrand.id === 'group' || c.brand === currentBrand.id) && c.status === 'live'
  )

  const overdueTasks = filteredTasks.filter((t) => t.status === 'overdue').length
  const atRiskTasks = filteredTasks.filter((t) => t.status === 'at-risk').length

  return (
    <div className="pb-8">
      <HubHeader
        title="Command Center"
        subtitle={`Good morning, ${currentUser.name.split(' ')[0]}. Here's what needs your attention today.`}
      >
        <div className="flex items-center gap-2">
          {overdueTasks > 0 && (
            <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-3 py-1.5 rounded-lg">
              <AlertCircle size={13} />
              {overdueTasks} overdue
            </div>
          )}
          {atRiskTasks > 0 && (
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-lg">
              <AlertTriangle size={13} />
              {atRiskTasks} at risk
            </div>
          )}
        </div>
      </HubHeader>

      <div className="px-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {COMMAND_CENTER_KPIS.map((kpi) => (
            <KPICard key={kpi.label} kpi={kpi} />
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Priority tasks — 2/3 */}
          <div className="xl:col-span-2 space-y-5">
            <Card padding="none">
              <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">Priority Tasks</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{filteredTasks.length} items needing attention</p>
                </div>
                <button className="text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors flex items-center gap-1">
                  View all <ArrowRight size={12} />
                </button>
              </div>
              <div className="px-4 pb-4 space-y-2">
                {filteredTasks.map((task) => (
                  <PriorityTaskCard key={task.id} task={task} />
                ))}
              </div>
            </Card>

            {/* Performance chart */}
            <Card>
              <CardHeader
                title="Campaign Performance — Last 4 Months"
                subtitle="Spend, leads and applications across all active campaigns"
              />
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={MONTHLY_PERFORMANCE_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="spend" stroke="#7c3aed" strokeWidth={2} fill="url(#spendGrad)" name="Spend (€)" />
                  <Area type="monotone" dataKey="leads" stroke="#0ea5e9" strokeWidth={2} fill="url(#leadsGrad)" name="Leads" />
                  <Area type="monotone" dataKey="applications" stroke="#10b981" strokeWidth={2} fill="none" name="Applications" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* AI Recommendations */}
            <Card padding="none">
              <div className="px-5 pt-5 pb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center">
                  <Sparkles size={13} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">AI Next-Best Actions</h3>
                  <p className="text-xs text-slate-500">{filteredActions.length} recommendations</p>
                </div>
              </div>
              <div className="px-4 pb-4 space-y-2.5">
                {filteredActions.map((action) => (
                  <AIActionCard key={action.id} action={action} />
                ))}
              </div>
            </Card>

            {/* Live campaign health */}
            <Card>
              <CardHeader
                title="Live Campaign Health"
                subtitle="Active campaigns right now"
                action={
                  <Badge variant="success" dot dotColor="#10b981">
                    {activeCampaigns.length} live
                  </Badge>
                }
              />
              <div className="space-y-3">
                {activeCampaigns.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4">No live campaigns in this workspace</p>
                )}
                {activeCampaigns.map((c) => (
                  <div key={c.id} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-slate-700 leading-snug flex-1">{c.name}</p>
                      <span className={cn('text-xs font-bold', getHealthColor(c.healthScore))}>
                        {c.healthScore}
                      </span>
                    </div>
                    <ProgressBar value={c.healthScore} color="auto" size="sm" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Channel mix */}
            <Card>
              <CardHeader title="Channel Mix" subtitle="Budget distribution this quarter" />
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={100} height={100}>
                  <PieChart>
                    <Pie
                      data={CHANNEL_MIX_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={28}
                      outerRadius={46}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {CHANNEL_MIX_DATA.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-1.5">
                  {CHANNEL_MIX_DATA.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-slate-600 flex-1">{item.name}</span>
                      <span className="text-xs font-semibold text-slate-700">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
