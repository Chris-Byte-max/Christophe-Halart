'use client'

import { useApp } from '@/lib/context'
import {
  PERFORMANCE_METRICS,
  APPROVAL_REQUESTS,
  COMPLIANCE_ITEMS,
  MONTHLY_PERFORMANCE_DATA,
  BRANDS,
} from '@/lib/data'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { HubTabs } from '@/components/ui/HubTabs'
import { HubHeader } from '@/components/ui/HubHeader'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  cn,
  formatCurrency,
  getChannelLabel,
  getChannelColor,
  getBrandBadgeClass,
  formatDeadline,
} from '@/lib/utils'
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  User,
  Shield,
  BarChart3,
  ClipboardCheck,
  Bell,
  Download,
  ExternalLink,
  ChevronRight,
} from 'lucide-react'
import type { PerformanceMetric, ApprovalRequest, ComplianceItem } from '@/lib/types'

function MetricCard({ metric }: { metric: PerformanceMetric }) {
  const color = getChannelColor(metric.channel)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        <h4 className="text-sm font-semibold text-slate-800">{getChannelLabel(metric.channel)}</h4>
        {metric.roi > 0 && (
          <div className={cn('ml-auto flex items-center gap-1 text-xs font-bold', metric.roi >= 3 ? 'text-emerald-600' : metric.roi >= 2 ? 'text-amber-600' : 'text-red-500')}>
            <TrendingUp size={12} />
            {metric.roi}x ROI
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Impressions', value: metric.impressions >= 1000 ? `${(metric.impressions / 1000).toFixed(0)}K` : String(metric.impressions) },
          { label: 'Clicks', value: metric.clicks >= 1000 ? `${(metric.clicks / 1000).toFixed(0)}K` : String(metric.clicks) },
          { label: 'CTR', value: `${metric.ctr}%` },
          { label: 'Conversions', value: String(metric.conversions) },
          { label: 'CPC', value: metric.cpc > 0 ? `€${metric.cpc}` : '—' },
          { label: 'Spend', value: metric.spend > 0 ? formatCurrency(metric.spend, true) : '—' },
        ].map((item) => (
          <div key={item.label} className="bg-slate-50 rounded-lg p-2">
            <p className="text-[10px] text-slate-400 mb-0.5">{item.label}</p>
            <p className="text-sm font-bold text-slate-800">{item.value}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

function ApprovalCard({ request }: { request: ApprovalRequest }) {
  const brand = BRANDS.find((b) => b.id === request.brand)
  const deadline = formatDeadline(request.deadline)
  const isPending = request.status === 'pending'

  return (
    <div className={cn(
      'flex items-start gap-4 p-4 rounded-xl border transition-all',
      request.priority === 'urgent' ? 'border-red-200 bg-red-50/30' : 'border-slate-100 bg-white'
    )}>
      <div className={cn(
        'w-1.5 rounded-full shrink-0 self-stretch min-h-12',
        request.priority === 'urgent' ? 'bg-red-500' : request.priority === 'normal' ? 'bg-slate-300' : 'bg-slate-200'
      )} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-sm font-semibold text-slate-800">{request.title}</p>
          <StatusBadge status={request.status} />
        </div>
        <div className="flex items-center gap-3 flex-wrap text-xs text-slate-500 mb-2">
          <span className={cn('font-medium px-1.5 py-0.5 rounded-md border', getBrandBadgeClass(request.brand))}>
            {brand?.shortName}
          </span>
          <span className="capitalize">{request.type}</span>
          <span className="flex items-center gap-1">
            <User size={11} />
            {request.submittedBy}
          </span>
          <span className={cn('flex items-center gap-1', request.priority === 'urgent' ? 'text-red-600 font-medium' : '')}>
            <Clock size={11} />
            {deadline}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <span>Reviewers:</span>
          {request.reviewers.map((r) => (
            <span key={r} className="bg-slate-100 px-1.5 py-0.5 rounded-md text-slate-600">{r}</span>
          ))}
        </div>
      </div>
      {isPending && (
        <div className="flex flex-col gap-1.5 shrink-0">
          <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors">
            Approve
          </button>
          <button className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-medium rounded-lg transition-colors">
            Review
          </button>
        </div>
      )}
    </div>
  )
}

function ComplianceRow({ item }: { item: ComplianceItem }) {
  const brand = BRANDS.find((b) => b.id === item.brand)
  const statusIcon = {
    compliant: <CheckCircle size={15} className="text-emerald-500" />,
    'review-needed': <AlertTriangle size={15} className="text-amber-500" />,
    'non-compliant': <XCircle size={15} className="text-red-500" />,
  }[item.status]

  const categoryLabel: Record<ComplianceItem['category'], string> = {
    gdpr: 'GDPR',
    'brand-guidelines': 'Brand Guidelines',
    legal: 'Legal',
    'content-policy': 'Content Policy',
  }

  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
      {statusIcon}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800">{item.title}</p>
        <p className="text-xs text-slate-500 mt-0.5">Last checked: {item.lastChecked}</p>
      </div>
      <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded-md border shrink-0', getBrandBadgeClass(item.brand))}>
        {brand?.shortName ?? item.brand}
      </span>
      <Badge variant="ghost" className="shrink-0">{categoryLabel[item.category]}</Badge>
      <StatusBadge status={item.status} />
      <span className="text-xs text-slate-400 shrink-0">{item.owner}</span>
    </div>
  )
}

const channelPerformanceData = PERFORMANCE_METRICS.filter((m) => m.spend > 0).map((m) => ({
  channel: getChannelLabel(m.channel),
  CTR: m.ctr,
  'Cost/Conv': m.spend > 0 ? Math.round(m.spend / m.conversions) : 0,
  ROI: m.roi,
  fill: getChannelColor(m.channel),
}))

export default function PerformanceHub() {
  const { currentBrand } = useApp()

  const pendingApprovals = APPROVAL_REQUESTS.filter((a) => a.status === 'pending').length
  const complianceIssues = COMPLIANCE_ITEMS.filter((c) => c.status !== 'compliant').length

  const tabs = [
    { id: 'analytics', label: 'Analytics Dashboard' },
    { id: 'channel', label: 'Channel Performance' },
    { id: 'approvals', label: 'Approvals', badge: pendingApprovals },
    { id: 'compliance', label: 'Compliance', badge: complianceIssues > 0 ? complianceIssues : undefined },
    { id: 'capacity', label: 'Capacity' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'reports', label: 'Reports' },
  ]

  const totalImpressions = PERFORMANCE_METRICS.reduce((s, m) => s + m.impressions, 0)
  const totalClicks = PERFORMANCE_METRICS.reduce((s, m) => s + m.clicks, 0)
  const totalConversions = PERFORMANCE_METRICS.reduce((s, m) => s + m.conversions, 0)
  const totalSpend = PERFORMANCE_METRICS.reduce((s, m) => s + m.spend, 0)

  return (
    <div className="pb-8">
      <HubHeader
        title="Performance & Operations Hub"
        subtitle="Analytics, approvals, compliance monitoring and operational reporting"
      >
        <button className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-2 rounded-lg transition-colors">
          <Download size={13} />
          Export Report
        </button>
      </HubHeader>

      {/* Summary KPIs */}
      <div className="px-6 mb-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Impressions', value: `${(totalImpressions / 1000).toFixed(0)}K`, icon: BarChart3, color: 'text-violet-600', bg: 'bg-violet-50', change: '+18%' },
            { label: 'Total Clicks', value: `${(totalClicks / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'text-sky-600', bg: 'bg-sky-50', change: '+12%' },
            { label: 'Conversions', value: String(totalConversions), icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', change: '+8%' },
            { label: 'Total Spend', value: formatCurrency(totalSpend, true), icon: TrendingDown, color: 'text-amber-600', bg: 'bg-amber-50', change: 'YTD' },
          ].map((item) => (
            <Card key={item.label} className="flex items-center gap-3">
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', item.bg)}>
                <item.icon size={18} className={item.color} />
              </div>
              <div>
                <p className="text-[11px] text-slate-500">{item.label}</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-slate-900">{item.value}</p>
                  <span className="text-[10px] text-emerald-600 font-medium">{item.change}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <HubTabs tabs={tabs}>
        {(activeTab) => (
          <div className="px-6 pt-4">
            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <div className="xl:col-span-2 space-y-5">
                  <Card>
                    <CardHeader title="Monthly Trend — Spend, Leads & Applications" subtitle="Last 4 months across all brands" />
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={MONTHLY_PERFORMANCE_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }} />
                        <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                        <Line type="monotone" dataKey="spend" stroke="#7c3aed" strokeWidth={2.5} dot={false} name="Spend (€)" />
                        <Line type="monotone" dataKey="leads" stroke="#0ea5e9" strokeWidth={2.5} dot={false} name="Leads" />
                        <Line type="monotone" dataKey="applications" stroke="#10b981" strokeWidth={2.5} dot={false} name="Applications" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>

                  <Card>
                    <CardHeader title="Channel ROI Comparison" subtitle="Return on investment by channel" />
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={channelPerformanceData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="channel" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }} />
                        <Bar dataKey="ROI" radius={[4, 4, 0, 0]}>
                          {channelPerformanceData.map((entry, i) => (
                            <rect key={i} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </div>

                <div className="space-y-5">
                  <Card>
                    <CardHeader title="Top Performing Channels" subtitle="By conversion rate" />
                    <div className="space-y-3">
                      {PERFORMANCE_METRICS.sort((a, b) => b.ctr - a.ctr).slice(0, 5).map((m) => (
                        <div key={m.channel} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getChannelColor(m.channel) }} />
                              {getChannelLabel(m.channel)}
                            </span>
                            <span className="font-semibold text-slate-700">{m.ctr}% CTR</span>
                          </div>
                          <ProgressBar value={m.ctr} max={25} color="violet" />
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card>
                    <CardHeader title="Conversion Funnel" subtitle="This quarter across all campaigns" />
                    <div className="space-y-2">
                      {[
                        { label: 'Impressions', value: totalImpressions, pct: 100, color: 'bg-slate-200' },
                        { label: 'Clicks', value: totalClicks, pct: Math.round((totalClicks / totalImpressions) * 100), color: 'bg-violet-300' },
                        { label: 'Landing Page Views', value: Math.round(totalClicks * 0.7), pct: Math.round((totalClicks * 0.7 / totalImpressions) * 100), color: 'bg-violet-500' },
                        { label: 'Conversions', value: totalConversions, pct: Math.round((totalConversions / totalImpressions) * 100), color: 'bg-violet-700' },
                      ].map((step) => (
                        <div key={step.label}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-slate-600">{step.label}</span>
                            <span className="font-semibold text-slate-700">
                              {step.value >= 1000 ? `${(step.value / 1000).toFixed(0)}K` : step.value}
                            </span>
                          </div>
                          <div className="h-4 bg-slate-100 rounded-md overflow-hidden">
                            <div className={cn('h-full rounded-md', step.color)} style={{ width: `${step.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'channel' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {PERFORMANCE_METRICS.map((m) => <MetricCard key={m.channel} metric={m} />)}
              </div>
            )}

            {activeTab === 'approvals' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <div className="xl:col-span-2">
                  <Card padding="none">
                    <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-800 text-sm">Approval Requests</h3>
                        <p className="text-xs text-slate-500">{pendingApprovals} pending your review</p>
                      </div>
                      <Badge variant={pendingApprovals > 0 ? 'warning' : 'success'}>
                        {pendingApprovals} pending
                      </Badge>
                    </div>
                    <div className="px-4 pb-4 space-y-2.5">
                      {APPROVAL_REQUESTS.map((r) => <ApprovalCard key={r.id} request={r} />)}
                    </div>
                  </Card>
                </div>
                <div>
                  <Card>
                    <CardHeader title="Approval SLA" subtitle="Average review turnaround" />
                    <div className="space-y-3">
                      {[
                        { label: 'Campaign Briefs', target: '48h', actual: '52h', ok: false },
                        { label: 'Budget Requests', target: '72h', actual: '36h', ok: true },
                        { label: 'Content Approval', target: '24h', actual: '20h', ok: true },
                        { label: 'Strategy Docs', target: '5d', actual: '4d', ok: true },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">{item.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">target {item.target}</span>
                            <span className={cn('text-xs font-bold', item.ok ? 'text-emerald-600' : 'text-red-500')}>
                              {item.actual}
                            </span>
                            {item.ok
                              ? <CheckCircle size={14} className="text-emerald-500" />
                              : <AlertTriangle size={14} className="text-red-500" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'compliance' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <div className="xl:col-span-2">
                  <Card>
                    <CardHeader
                      title="Compliance Dashboard"
                      subtitle="GDPR, brand guidelines, legal and content policy status"
                      action={
                        <div className="flex items-center gap-2">
                          <Badge variant="success">{COMPLIANCE_ITEMS.filter((c) => c.status === 'compliant').length} compliant</Badge>
                          <Badge variant="warning">{COMPLIANCE_ITEMS.filter((c) => c.status !== 'compliant').length} issues</Badge>
                        </div>
                      }
                    />
                    <div>
                      {COMPLIANCE_ITEMS.map((item) => <ComplianceRow key={item.id} item={item} />)}
                    </div>
                  </Card>
                </div>
                <div className="space-y-4">
                  <Card>
                    <CardHeader title="GDPR Status" subtitle="Data protection compliance" />
                    <div className="space-y-2.5">
                      {[
                        { label: 'Cookie consent active', done: true },
                        { label: 'Privacy policy updated', done: true },
                        { label: 'Data retention policy', done: true },
                        { label: 'Email consent audit', done: false },
                        { label: 'Data processor agreements', done: true },
                        { label: 'DPIA completed', done: false },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2">
                          {item.done
                            ? <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                            : <AlertTriangle size={14} className="text-amber-500 shrink-0" />}
                          <span className={cn('text-xs', item.done ? 'text-slate-600' : 'text-slate-800 font-medium')}>{item.label}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <ProgressBar value={4} max={6} color="auto" showLabel />
                      <p className="text-xs text-slate-500 mt-1">4 of 6 GDPR controls active</p>
                    </div>
                  </Card>

                  <Card>
                    <CardHeader title="Next Audit" subtitle="Scheduled compliance reviews" />
                    <div className="space-y-2">
                      {[
                        { label: 'GDPR Full Audit', date: 'Jun 15, 2026', urgent: false },
                        { label: 'Brand Asset Scan', date: 'May 15, 2026', urgent: true },
                        { label: 'Legal Content Review', date: 'May 20, 2026', urgent: true },
                      ].map((item) => (
                        <div key={item.label} className={cn('flex items-center justify-between p-2.5 rounded-lg text-xs', item.urgent ? 'bg-amber-50 border border-amber-100' : 'bg-slate-50')}>
                          <span className="font-medium text-slate-700">{item.label}</span>
                          <span className={cn('font-semibold', item.urgent ? 'text-amber-600' : 'text-slate-500')}>{item.date}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'capacity' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <div className="xl:col-span-2">
                  <Card>
                    <CardHeader title="Team Capacity Overview" subtitle="Workload by team member — current sprint" />
                    <div className="space-y-4">
                      {[
                        { name: 'Christophe Halart', role: 'Group Marketing Director', tasks: 8, overdue: 1, capacity: 85 },
                        { name: 'Sophie Martens', role: 'Brand Marketing Manager — Unique', tasks: 12, overdue: 2, capacity: 95 },
                        { name: 'Thomas Dubois', role: 'Campaign Manager', tasks: 9, overdue: 0, capacity: 70 },
                        { name: 'Digital Team', role: 'Digital Marketeer', tasks: 14, overdue: 1, capacity: 90 },
                        { name: 'Content Team', role: 'Content Manager', tasks: 11, overdue: 0, capacity: 75 },
                        { name: 'Legal & Compliance', role: 'Compliance Reviewer', tasks: 4, overdue: 0, capacity: 40 },
                      ].map((member) => (
                        <div key={member.name} className="space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-xs font-bold text-violet-700 shrink-0">
                                {member.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-800">{member.name}</p>
                                <p className="text-xs text-slate-500">{member.role}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 shrink-0">
                              <span>{member.tasks} tasks</span>
                              {member.overdue > 0 && <Badge variant="danger">{member.overdue} overdue</Badge>}
                              <span className={cn('font-bold', member.capacity >= 90 ? 'text-red-500' : member.capacity >= 75 ? 'text-amber-500' : 'text-emerald-600')}>
                                {member.capacity}%
                              </span>
                            </div>
                          </div>
                          <ProgressBar value={member.capacity} color={member.capacity >= 90 ? 'red' : member.capacity >= 75 ? 'amber' : 'emerald'} />
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
                <div className="space-y-4">
                  <Card>
                    <CardHeader title="Workload Risks" subtitle="Upcoming peaks and bottlenecks" />
                    <div className="space-y-2.5">
                      {[
                        { risk: 'Sophie Martens at 95% capacity', detail: 'Unique campaign launch + Q2 planning overlap', severity: 'high' },
                        { risk: 'Approval bottleneck', detail: 'Christophe Halart is sole reviewer for 4 open approvals', severity: 'high' },
                        { risk: '6 campaign deadlines next 7 days', detail: 'May 1–8 peak requires additional coordination', severity: 'medium' },
                        { risk: 'Digital team overloaded', detail: '14 active tasks — UTM + QA backlog building', severity: 'medium' },
                      ].map((item) => (
                        <div key={item.risk} className={cn('p-2.5 rounded-xl border text-xs', item.severity === 'high' ? 'border-red-200 bg-red-50/50' : 'border-amber-200 bg-amber-50/30')}>
                          <p className="font-semibold text-slate-800 mb-0.5">{item.risk}</p>
                          <p className="text-slate-500">{item.detail}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card>
                    <CardHeader title="Approval SLA" subtitle="Average review time" />
                    {[
                      { label: 'Campaign Briefs', target: '48h', actual: '52h', ok: false },
                      { label: 'Content Approval', target: '24h', actual: '20h', ok: true },
                      { label: 'Budget Requests', target: '72h', actual: '36h', ok: true },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center justify-between text-sm py-2 border-b border-slate-50 last:border-0">
                        <span className="text-slate-600">{s.label}</span>
                        <span className={cn('font-bold text-xs', s.ok ? 'text-emerald-600' : 'text-red-500')}>
                          {s.actual} <span className="text-slate-400 font-normal">/ {s.target}</span>
                        </span>
                      </div>
                    ))}
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'calendar' && (
              <Card>
                <CardHeader title="Marketing Calendar — May 2026" subtitle="All campaign milestones, approvals and content deadlines" />
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-xl overflow-hidden min-w-[700px]">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                      <div key={d} className="bg-slate-100 text-center py-2 text-xs font-semibold text-slate-500">{d}</div>
                    ))}
                    {/* Empty days before May 1 (Thursday) */}
                    {[null, null, null].map((_, i) => <div key={`empty-${i}`} className="bg-white min-h-24" />)}
                    {Array.from({ length: 31 }, (_, i) => {
                      const day = i + 1
                      const today = 30
                      const isToday = day === today
                      const events: { label: string; color: string }[] = []
                      if (day === 1) events.push({ label: 'Flex Work Month ends', color: 'bg-sky-500' })
                      if (day === 3) events.push({ label: 'Unique Q2 Approval deadline', color: 'bg-red-500' })
                      if (day === 5) events.push({ label: 'Unique Spring LIVE', color: 'bg-amber-500' })
                      if (day === 6) events.push({ label: 'USG IT Video Brief', color: 'bg-orange-500' })
                      if (day === 8) events.push({ label: 'Bright Plus Deck due', color: 'bg-pink-500' })
                      if (day === 10) events.push({ label: 'Exp. Medical budget realloc', color: 'bg-emerald-500' })
                      if (day === 14) events.push({ label: 'Brussels Recruitment Fair', color: 'bg-violet-600' })
                      if (day === 15) events.push({ label: 'GDPR Audit deadline', color: 'bg-red-400' })
                      if (day === 20) events.push({ label: 'USG IT Campaign LIVE', color: 'bg-orange-500' })
                      return (
                        <div key={day} className={cn('bg-white min-h-24 p-2 border border-transparent', isToday && 'ring-2 ring-violet-500 ring-inset')}>
                          <p className={cn('text-xs font-semibold mb-1.5', isToday ? 'text-violet-600' : day < today ? 'text-slate-300' : 'text-slate-700')}>{day}</p>
                          <div className="space-y-0.5">
                            {events.map((e) => (
                              <div key={e.label} className={cn('text-[10px] text-white font-medium px-1.5 py-0.5 rounded leading-snug', e.color)}>
                                {e.label}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                    {/* Fill remaining to complete grid (31 days + 3 empty = 34, need 35 for 5 rows) */}
                    <div className="bg-white min-h-24" />
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'reports' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[
                  { title: 'Monthly Marketing Report — April 2026', type: 'Monthly Summary', updated: 'Apr 30, 2026', pages: 12, ready: true },
                  { title: 'Q1 2026 Campaign Performance Report', type: 'Quarterly Review', updated: 'Apr 5, 2026', pages: 28, ready: true },
                  { title: 'Brand Equity Tracker — Q1 2026', type: 'Brand Report', updated: 'Apr 10, 2026', pages: 16, ready: true },
                  { title: 'Digital Channel Mix Analysis', type: 'Channel Report', updated: 'Apr 25, 2026', pages: 8, ready: true },
                  { title: 'Candidate Marketing Funnel — H1 2026', type: 'Recruitment Report', updated: 'In progress', pages: 0, ready: false },
                  { title: 'Employer Brand Survey Results 2026', type: 'Research', updated: 'May 20, 2026', pages: 0, ready: false },
                ].map((report) => (
                  <Card key={report.title} className={cn('hover:shadow-md transition-shadow', !report.ready && 'opacity-60')}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                        <ClipboardCheck size={16} className="text-violet-600" />
                      </div>
                      <div>
                        <Badge variant="ghost" className="mb-1">{report.type}</Badge>
                        <h4 className="text-sm font-semibold text-slate-800 leading-snug">{report.title}</h4>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Updated: {report.updated}</span>
                      {report.pages > 0 && <span>{report.pages} pages</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                      {report.ready ? (
                        <>
                          <button className="flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors">
                            <ExternalLink size={12} />
                            View
                          </button>
                          <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors ml-auto">
                            <Download size={12} />
                            Download PDF
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock size={11} />
                          Report in preparation
                        </span>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </HubTabs>
    </div>
  )
}
