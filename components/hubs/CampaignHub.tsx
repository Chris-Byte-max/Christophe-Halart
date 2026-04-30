'use client'

import { useState } from 'react'
import { useApp } from '@/lib/context'
import { CAMPAIGNS, BRANDS } from '@/lib/data'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { HubTabs } from '@/components/ui/HubTabs'
import { HubHeader } from '@/components/ui/HubHeader'
import CampaignFactory from '@/components/campaign/CampaignFactory'
import {
  cn,
  formatCurrency,
  formatDeadline,
  getBrandBadgeClass,
  getChannelLabel,
  getChannelColor,
  getHealthColor,
  getHealthBg,
} from '@/lib/utils'
import {
  Megaphone,
  Calendar,
  Clock,
  User,
  TrendingUp,
  CheckCircle2,
  Circle,
  XCircle,
  Plus,
  Filter,
  Search,
  ChevronDown,
  Target,
  DollarSign,
} from 'lucide-react'
import type { Campaign } from '@/lib/types'

function HealthScoreRing({ score }: { score: number }) {
  const radius = 20
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'

  return (
    <div className="relative w-12 h-12 shrink-0">
      <svg width="48" height="48" className="-rotate-90">
        <circle cx="24" cy="24" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="4" />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color }}>
        {score}
      </span>
    </div>
  )
}

function CampaignRow({ campaign }: { campaign: Campaign }) {
  const { getBrand } = useApp()
  const brand = getBrand(campaign.brand)
  const pctSpent = campaign.budget > 0 ? Math.round((campaign.spent / campaign.budget) * 100) : 0

  return (
    <tr className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors cursor-pointer group">
      <td className="py-3.5 pl-5 pr-3">
        <div className="flex items-start gap-3">
          <HealthScoreRing score={campaign.healthScore} />
          <div>
            <p className="text-sm font-semibold text-slate-800 group-hover:text-violet-700 transition-colors">{campaign.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded-md border', getBrandBadgeClass(campaign.brand))}>
                {brand?.shortName}
              </span>
              <span className="text-xs text-slate-400 capitalize">{campaign.type.replace('-', ' ')}</span>
            </div>
          </div>
        </div>
      </td>
      <td className="py-3.5 px-3">
        <StatusBadge status={campaign.status} />
      </td>
      <td className="py-3.5 px-3">
        <div className="flex flex-wrap gap-1 max-w-36">
          {campaign.channels.map((ch) => (
            <span
              key={ch}
              className="text-[10px] font-medium px-1.5 py-0.5 rounded-full text-white"
              style={{ backgroundColor: getChannelColor(ch) }}
            >
              {getChannelLabel(ch)}
            </span>
          ))}
        </div>
      </td>
      <td className="py-3.5 px-3">
        <div className="w-28">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-500">{formatCurrency(campaign.spent, true)}</span>
            <span className="text-slate-400">{formatCurrency(campaign.budget, true)}</span>
          </div>
          <ProgressBar value={pctSpent} color="violet" size="sm" />
        </div>
      </td>
      <td className="py-3.5 px-3">
        <div className="w-24">
          <div className="text-xs text-slate-500 mb-1">{campaign.readiness}% ready</div>
          <ProgressBar value={campaign.readiness} color="auto" size="sm" />
        </div>
      </td>
      <td className="py-3.5 px-3">
        <StatusBadge status={campaign.approvalStatus} />
      </td>
      <td className="py-3.5 px-3 pr-5">
        <div className="text-xs text-slate-500">
          <p>{new Date(campaign.startDate).toLocaleDateString('fr-BE', { day: '2-digit', month: 'short' })}</p>
          <p className="text-slate-400">→ {new Date(campaign.endDate).toLocaleDateString('fr-BE', { day: '2-digit', month: 'short' })}</p>
        </div>
      </td>
    </tr>
  )
}

function CampaignDetailCard({ campaign }: { campaign: Campaign }) {
  const { getBrand } = useApp()
  const brand = getBrand(campaign.brand)

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded-md border', getBrandBadgeClass(campaign.brand))}>
              {brand?.shortName}
            </span>
            <StatusBadge status={campaign.status} />
          </div>
          <h4 className="text-sm font-semibold text-slate-800">{campaign.name}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{campaign.objective}</p>
        </div>
        <HealthScoreRing score={campaign.healthScore} />
      </div>

      {/* KPIs */}
      <div className="space-y-1.5 mb-3">
        {campaign.kpis.map((kpi) => (
          <div key={kpi.label} className="flex items-center justify-between text-xs">
            <span className="text-slate-500">{kpi.label}</span>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-slate-700">{kpi.actual !== '0' && kpi.actual !== '—' ? kpi.actual : '—'}</span>
              <span className="text-slate-400">/ {kpi.target}</span>
              {kpi.achieved ? (
                <CheckCircle2 size={12} className="text-emerald-500" />
              ) : (
                <Circle size={12} className="text-slate-300" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Budget */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-500">Budget</span>
          <span className="font-medium text-slate-700">
            {formatCurrency(campaign.spent, true)} / {formatCurrency(campaign.budget, true)}
          </span>
        </div>
        <ProgressBar value={campaign.spent} max={campaign.budget} color="violet" />
      </div>

      {/* Readiness */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-500">Campaign Readiness</span>
          <span className="font-medium">{campaign.readiness}%</span>
        </div>
        <ProgressBar value={campaign.readiness} color="auto" />
      </div>

      {/* Channels */}
      <div className="flex flex-wrap gap-1 mb-3">
        {campaign.channels.map((ch) => (
          <span
            key={ch}
            className="text-[10px] font-medium px-1.5 py-0.5 rounded-full text-white"
            style={{ backgroundColor: getChannelColor(ch) }}
          >
            {getChannelLabel(ch)}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <User size={11} />
          {campaign.owner}
        </span>
        <div className="flex items-center gap-2">
          <StatusBadge status={campaign.approvalStatus} />
          <button className="text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors">
            View →
          </button>
        </div>
      </div>
    </Card>
  )
}

function ReadinessSection({ campaigns }: { campaigns: Campaign[] }) {
  const sorted = [...campaigns].sort((a, b) => a.readiness - b.readiness)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <Card>
        <CardHeader title="Campaign Readiness Tracker" subtitle="All campaigns sorted by readiness score" />
        <div className="space-y-3">
          {sorted.map((c) => {
            const brand = BRANDS.find((b) => b.id === c.brand)
            return (
              <div key={c.id} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded border shrink-0', getBrandBadgeClass(c.brand))}>
                      {brand?.shortName}
                    </span>
                    <p className="text-xs font-medium text-slate-700 truncate">{c.name}</p>
                  </div>
                  <span className={cn('text-xs font-bold shrink-0', getHealthColor(c.readiness))}>
                    {c.readiness}%
                  </span>
                </div>
                <ProgressBar value={c.readiness} color="auto" />
              </div>
            )
          })}
        </div>
      </Card>

      <Card>
        <CardHeader title="Readiness Checklist — Next Launch" subtitle="Spring Office Revival — Unique (May 5)" />
        <div className="space-y-2.5">
          {[
            { item: 'Creative assets approved', done: true },
            { item: 'Landing page live & tracked', done: true },
            { item: 'LinkedIn ad set uploaded', done: true },
            { item: 'Email sequence configured', done: true },
            { item: 'UTM parameters set', done: true },
            { item: 'Budget allocated in platform', done: true },
            { item: 'Legal review signed off', done: true },
            { item: 'Campaign brief finalized', done: true },
            { item: 'Final marketing director approval', done: false },
            { item: 'Go-live confirmation sent to team', done: false },
          ].map((item) => (
            <div key={item.item} className="flex items-center gap-2.5">
              {item.done ? (
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
              ) : (
                <Circle size={15} className="text-slate-300 shrink-0" />
              )}
              <span className={cn('text-sm', item.done ? 'text-slate-500 line-through' : 'text-slate-800 font-medium')}>
                {item.item}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-500">Overall readiness</span>
            <span className="font-bold text-emerald-600">91%</span>
          </div>
          <ProgressBar value={91} color="auto" />
        </div>
      </Card>
    </div>
  )
}

export default function CampaignHub() {
  const { currentBrand } = useApp()
  const [view, setView] = useState<'table' | 'cards'>('table')
  const [search, setSearch] = useState('')

  const campaigns = currentBrand.id === 'group'
    ? CAMPAIGNS
    : CAMPAIGNS.filter((c) => c.brand === currentBrand.id)

  const filtered = campaigns.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  )

  const live = campaigns.filter((c) => c.status === 'live').length
  const planning = campaigns.filter((c) => c.status === 'planning').length
  const pending = campaigns.filter((c) => c.approvalStatus === 'pending').length

  const tabs = [
    { id: 'all', label: 'All Campaigns', badge: campaigns.length },
    { id: 'live', label: 'Live', badge: live },
    { id: 'planning', label: 'Planning', badge: planning },
    { id: 'factory', label: 'Campaign Factory' },
    { id: 'readiness', label: 'Readiness Tracker' },
    { id: 'approvals', label: 'Awaiting Approval', badge: pending },
  ]

  return (
    <div className="pb-8">
      <HubHeader
        title="Campaign Hub"
        subtitle="Create, track and optimize all campaigns across brands and channels"
      >
        <button className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors">
          <Plus size={13} />
          New Campaign
        </button>
      </HubHeader>

      <HubTabs tabs={tabs}>
        {(activeTab) => (
          <div className="px-6 pt-4">
            {(activeTab === 'all' || activeTab === 'live' || activeTab === 'planning') && (
              <>
                {/* Toolbar */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 max-w-72">
                    <Search size={14} className="text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search campaigns..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none flex-1"
                    />
                  </div>
                  <button className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                    <Filter size={13} />
                    Filter
                    <ChevronDown size={12} />
                  </button>
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 ml-auto">
                    <button onClick={() => setView('table')} className={cn('px-2 py-1 rounded text-xs font-medium transition-colors', view === 'table' ? 'bg-violet-600 text-white' : 'text-slate-500 hover:text-slate-700')}>
                      Table
                    </button>
                    <button onClick={() => setView('cards')} className={cn('px-2 py-1 rounded text-xs font-medium transition-colors', view === 'cards' ? 'bg-violet-600 text-white' : 'text-slate-500 hover:text-slate-700')}>
                      Cards
                    </button>
                  </div>
                </div>

                {view === 'table' ? (
                  <Card padding="none">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="text-left py-3 pl-5 pr-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Campaign</th>
                            <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                            <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Channels</th>
                            <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Budget</th>
                            <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Readiness</th>
                            <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Approval</th>
                            <th className="text-left py-3 px-3 pr-5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Timeline</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered
                            .filter((c) => activeTab === 'all' || c.status === activeTab)
                            .map((c) => <CampaignRow key={c.id} campaign={c} />)}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered
                      .filter((c) => activeTab === 'all' || c.status === activeTab)
                      .map((c) => <CampaignDetailCard key={c.id} campaign={c} />)}
                  </div>
                )}
              </>
            )}

            {activeTab === 'factory' && (
              <CampaignFactory />
            )}

            {activeTab === 'readiness' && (
              <ReadinessSection campaigns={campaigns} />
            )}

            {activeTab === 'approvals' && (
              <Card>
                <CardHeader
                  title="Campaigns Awaiting Approval"
                  subtitle="Review and approve campaign briefs before activation"
                />
                <div className="space-y-3">
                  {campaigns
                    .filter((c) => c.approvalStatus === 'pending')
                    .map((c) => {
                      const brand = BRANDS.find((b) => b.id === c.brand)
                      return (
                        <div key={c.id} className="flex items-center gap-4 p-3.5 rounded-xl border border-amber-100 bg-amber-50/30">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded-md border', getBrandBadgeClass(c.brand))}>
                                {brand?.shortName}
                              </span>
                              <span className="text-xs text-slate-400 capitalize">{c.type.replace('-', ' ')}</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{c.objective}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500">Budget</p>
                            <p className="text-sm font-bold text-slate-700">{formatCurrency(c.budget, true)}</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors">
                              Approve
                            </button>
                            <button className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-medium rounded-lg transition-colors">
                              Review
                            </button>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </Card>
            )}
          </div>
        )}
      </HubTabs>
    </div>
  )
}
