'use client'

import { useState } from 'react'
import { CAMPAIGNS, BRANDS } from '@/lib/data'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { HubTabs } from '@/components/ui/HubTabs'
import {
  cn, formatCurrency, getBrandBadgeClass, getChannelLabel, getChannelColor,
  getHealthColor, formatDeadline,
} from '@/lib/utils'
import {
  ArrowLeft, Target, Users, Globe, Calendar, DollarSign, User,
  CheckCircle2, Circle, AlertTriangle, Sparkles, ExternalLink,
  Edit, Flag, Zap, BarChart3, FileText, Settings,
} from 'lucide-react'
import UTMBuilder from './UTMBuilder'
import TrackingQA from './TrackingQA'
import { generateCampaignNextActions } from '@/lib/ai-service'
import Link from 'next/link'

function HealthRing({ score }: { score: number }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'
  return (
    <div className="relative w-24 h-24">
      <svg width="96" height="96" className="-rotate-90">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="8" />
        <circle cx="48" cy="48" r={radius} fill="none" stroke={color} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>{score}</span>
        <span className="text-[10px] text-slate-500">Health</span>
      </div>
    </div>
  )
}

export default function CampaignWorkspace({ campaignId }: { campaignId: string }) {
  const campaign = CAMPAIGNS.find((c) => c.id === campaignId) ?? CAMPAIGNS[0]
  const brand = BRANDS.find((b) => b.id === campaign.brand)
  const [aiActions, setAiActions] = useState<{ title: string; reason: string; effort: string }[] | null>(null)
  const [loadingAI, setLoadingAI] = useState(false)

  const pctSpent = campaign.budget > 0 ? Math.round((campaign.spent / campaign.budget) * 100) : 0

  const loadAIActions = async () => {
    setLoadingAI(true)
    const result = await generateCampaignNextActions({
      campaignId: campaign.id,
      healthScore: campaign.healthScore,
      kpis: campaign.kpis.map((k) => ({ label: k.label, achieved: k.achieved })),
    })
    setAiActions(result.data.actions)
    setLoadingAI(false)
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'brief', label: 'Brief & KPIs' },
    { id: 'digital', label: 'Digital Setup' },
    { id: 'checklist', label: 'Launch Checklist' },
    { id: 'assets', label: 'Assets' },
    { id: 'performance', label: 'Performance' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 pb-8">
      {/* Back nav */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <Link href="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors w-fit">
          <ArrowLeft size={14} />
          Back to Campaign Hub
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <HealthRing score={campaign.healthScore} />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded-md border', getBrandBadgeClass(campaign.brand))}>
                  {brand?.shortName}
                </span>
                <StatusBadge status={campaign.status} />
                <StatusBadge status={campaign.approvalStatus} />
              </div>
              <h1 className="text-xl font-bold text-slate-900">{campaign.name}</h1>
              <p className="text-sm text-slate-500 mt-0.5">{campaign.objective}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 flex-wrap">
                <span className="flex items-center gap-1"><Calendar size={12} />{new Date(campaign.startDate).toLocaleDateString('fr-BE', { day: '2-digit', month: 'short' })} → {new Date(campaign.endDate).toLocaleDateString('fr-BE', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                <span className="flex items-center gap-1"><User size={12} />{campaign.owner}</span>
                <span className="flex items-center gap-1"><DollarSign size={12} />{formatCurrency(campaign.budget)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              <Edit size={14} />
              Edit
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors">
              <Flag size={14} />
              Launch Campaign
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-100">
          <div>
            <p className="text-[11px] text-slate-500 mb-1">Budget Spent</p>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-800">{formatCurrency(campaign.spent, true)}</span>
              <span className="text-xs text-slate-400">/ {formatCurrency(campaign.budget, true)}</span>
            </div>
            <ProgressBar value={pctSpent} size="sm" className="mt-1" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 mb-1">Campaign Readiness</p>
            <div className="flex items-center gap-2">
              <span className={cn('text-base font-bold', getHealthColor(campaign.readiness))}>{campaign.readiness}%</span>
            </div>
            <ProgressBar value={campaign.readiness} color="auto" size="sm" className="mt-1" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 mb-1">Channels</p>
            <div className="flex flex-wrap gap-1">
              {campaign.channels.map((ch) => (
                <span key={ch} className="text-[10px] font-medium px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: getChannelColor(ch) }}>
                  {getChannelLabel(ch)}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 mb-1">KPI Achievement</p>
            <div className="flex items-center gap-1">
              {campaign.kpis.map((kpi, i) => (
                kpi.achieved
                  ? <CheckCircle2 key={i} size={16} className="text-emerald-500" />
                  : <Circle key={i} size={16} className="text-slate-300" />
              ))}
              <span className="text-xs text-slate-500 ml-1">{campaign.kpis.filter((k) => k.achieved).length}/{campaign.kpis.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-0">
        <HubTabs tabs={tabs}>
          {(tab) => (
            <div className="px-6 pt-5">
              {tab === 'overview' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                  <div className="xl:col-span-2 space-y-4">
                    {/* AI Next Actions */}
                    <Card>
                      <CardHeader
                        title="AI Next-Best Actions"
                        subtitle="Personalized recommendations for this campaign"
                        action={
                          <button
                            onClick={loadAIActions}
                            disabled={loadingAI}
                            className="flex items-center gap-1.5 text-xs font-medium text-violet-600 bg-violet-50 border border-violet-200 px-2.5 py-1.5 rounded-lg hover:bg-violet-100 transition-colors"
                          >
                            <Sparkles size={12} className={loadingAI ? 'animate-pulse' : ''} />
                            {loadingAI ? 'Analyzing...' : 'Generate'}
                          </button>
                        }
                      />
                      {aiActions ? (
                        <div className="space-y-2.5">
                          {aiActions.map((action, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-violet-50 border border-violet-100 rounded-xl">
                              <Zap size={14} className="text-violet-600 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-semibold text-slate-800">{action.title}</p>
                                <p className="text-xs text-slate-600 mt-0.5">{action.reason}</p>
                                <Badge variant="ghost" className="mt-2">{action.effort} effort</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-slate-400">
                          <Sparkles size={24} className="mx-auto mb-2 opacity-40" />
                          <p className="text-sm">Click "Generate" to get AI recommendations</p>
                        </div>
                      )}
                    </Card>

                    {/* Blockers */}
                    <Card>
                      <CardHeader title="Blockers & Risks" subtitle="Items preventing campaign progress" />
                      {campaign.status === 'planning' ? (
                        <div className="space-y-2">
                          {[
                            { label: 'Campaign brief not yet approved', severity: 'critical' },
                            { label: 'Creative assets pending', severity: 'high' },
                            { label: 'Landing page URL not confirmed', severity: 'medium' },
                          ].map((b) => (
                            <div key={b.label} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-red-50 border border-red-100">
                              <AlertTriangle size={14} className="text-red-500 shrink-0" />
                              <span className="text-sm text-slate-700">{b.label}</span>
                              <Badge variant={b.severity === 'critical' ? 'danger' : b.severity === 'high' ? 'warning' : 'default'} className="ml-auto">{b.severity}</Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-sm text-emerald-600 flex items-center justify-center gap-2">
                          <CheckCircle2 size={16} />
                          No active blockers
                        </div>
                      )}
                    </Card>
                  </div>

                  <div className="space-y-4">
                    {/* Campaign meta */}
                    <Card>
                      <CardHeader title="Campaign Details" />
                      <div className="space-y-2.5">
                        {[
                          { label: 'Brand', value: brand?.name },
                          { label: 'Type', value: campaign.type.replace('_', ' ').replace('-', ' ') },
                          { label: 'Owner', value: campaign.owner },
                          { label: 'Start', value: new Date(campaign.startDate).toLocaleDateString('fr-BE') },
                          { label: 'End', value: new Date(campaign.endDate).toLocaleDateString('fr-BE') },
                          { label: 'Budget', value: formatCurrency(campaign.budget) },
                          { label: 'Spent', value: formatCurrency(campaign.spent) },
                          { label: 'Remaining', value: formatCurrency(campaign.budget - campaign.spent) },
                        ].map((row) => (
                          <div key={row.label} className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">{row.label}</span>
                            <span className="font-medium text-slate-800">{row.value ?? '—'}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Approvals */}
                    <Card>
                      <CardHeader title="Approvals" />
                      <div className="space-y-2">
                        {[
                          { label: 'Campaign Brief', status: campaign.approvalStatus },
                          { label: 'Creative Assets', status: 'not-submitted' },
                          { label: 'Compliance Review', status: campaign.approvalStatus === 'approved' ? 'approved' : 'pending' },
                          { label: 'Marketing Director', status: campaign.approvalStatus },
                        ].map((a) => (
                          <div key={a.label} className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">{a.label}</span>
                            <StatusBadge status={a.status} />
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {tab === 'brief' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  <Card>
                    <CardHeader title="Campaign Brief" subtitle="Core strategic foundation" />
                    <div className="space-y-4">
                      {[
                        { label: 'Objective', content: campaign.objective },
                        { label: 'Target Audience', content: 'Belgian office and administrative professionals, 25–45 years old, open to new opportunities. Active in Brussels, Antwerp, Ghent.' },
                        { label: 'Key Message', content: 'Unique connects you with your next opportunity — fast, personal and with expert support.' },
                        { label: 'CTA', content: 'Apply now — Get matched in 48 hours' },
                        { label: 'Tone of Voice', content: 'Professional yet warm, encouraging, solution-oriented, Belgian-relevant.' },
                      ].map((item) => (
                        <div key={item.label}>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{item.label}</p>
                          <p className="text-sm text-slate-800">{item.content}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card>
                    <CardHeader title="KPI Targets" subtitle="Measurable outcomes to track" />
                    <div className="space-y-3">
                      {campaign.kpis.map((kpi) => (
                        <div key={kpi.label} className="p-3 bg-slate-50 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700">{kpi.label}</span>
                            {kpi.achieved
                              ? <CheckCircle2 size={15} className="text-emerald-500" />
                              : <Circle size={15} className="text-slate-300" />}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span>Target: <strong className="text-slate-700">{kpi.target}</strong></span>
                            <span>Actual: <strong className={kpi.achieved ? 'text-emerald-600' : 'text-slate-700'}>{kpi.actual !== '0' ? kpi.actual : '—'}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {tab === 'digital' && (
                <div className="space-y-5">
                  <UTMBuilder brand={campaign.brand} campaignName={campaign.name} />
                  <TrackingQA />
                </div>
              )}

              {tab === 'checklist' && (
                <Card>
                  <CardHeader
                    title="Campaign Launch Checklist"
                    subtitle="All critical items must be completed before launch"
                    action={<span className={cn('text-xs font-bold', campaign.readiness >= 80 ? 'text-emerald-600' : 'text-amber-600')}>{campaign.readiness}% complete</span>}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      { label: 'Brief validated', done: campaign.readiness > 50 },
                      { label: 'Brand selected', done: true },
                      { label: 'Audience defined', done: true },
                      { label: 'Objective defined', done: true },
                      { label: 'KPIs defined', done: true },
                      { label: 'Content assets created', done: campaign.readiness > 60 },
                      { label: 'Sales assets created', done: campaign.readiness > 70 },
                      { label: 'Brand score acceptable (>70)', done: campaign.readiness > 70 },
                      { label: 'Compliance check completed', done: campaign.approvalStatus === 'approved' },
                      { label: 'Approvals completed', done: campaign.approvalStatus === 'approved' },
                      { label: 'Landing page ready', done: campaign.readiness > 80 },
                      { label: 'UTM parameters generated', done: campaign.readiness > 85 },
                      { label: 'Tracking QA completed', done: campaign.readiness > 90 },
                      { label: 'Publication date confirmed', done: campaign.status !== 'draft' },
                      { label: 'Owners assigned', done: true },
                      { label: 'Retrospective template prepared', done: campaign.readiness > 95 },
                    ].map((item) => (
                      <div key={item.label} className={cn('flex items-center gap-2.5 p-2.5 rounded-lg border', item.done ? 'border-emerald-100 bg-emerald-50/50' : 'border-slate-100 bg-white')}>
                        {item.done
                          ? <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                          : <Circle size={15} className="text-slate-300 shrink-0" />}
                        <span className={cn('text-sm', item.done ? 'text-slate-500' : 'text-slate-800 font-medium')}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                  {campaign.readiness < 100 && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700 font-medium">
                      ⚠️ Campaign cannot go live until all critical checklist items are completed. An authorized user can override with justification.
                    </div>
                  )}
                </Card>
              )}

              {tab === 'assets' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['LinkedIn Ad Set (3 variants)', 'Email Sequence (5 emails)', 'Instagram Reel', 'Landing Page Copy'].map((asset) => (
                    <Card key={asset} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center shrink-0">
                        <FileText size={14} className="text-violet-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{asset}</p>
                        <StatusBadge status={campaign.status === 'approved' ? 'approved' : 'review'} />
                      </div>
                      <button className="text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors">
                        View →
                      </button>
                    </Card>
                  ))}
                </div>
              )}

              {tab === 'performance' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {campaign.kpis.map((kpi) => (
                    <Card key={kpi.label}>
                      <p className="text-xs text-slate-500 mb-1">{kpi.label}</p>
                      <div className="flex items-end justify-between gap-2">
                        <span className="text-2xl font-bold text-slate-900">{kpi.actual !== '0' ? kpi.actual : '—'}</span>
                        <span className="text-xs text-slate-400 pb-0.5">target {kpi.target}</span>
                      </div>
                      {kpi.achieved && <Badge variant="success" className="mt-2">Target achieved ✓</Badge>}
                    </Card>
                  ))}
                  <Card className="flex items-center justify-center py-8 text-slate-400 col-span-full text-sm">
                    <BarChart3 size={20} className="mr-2 opacity-40" />
                    Full performance analytics available when campaign is live
                  </Card>
                </div>
              )}
            </div>
          )}
        </HubTabs>
      </div>
    </div>
  )
}
