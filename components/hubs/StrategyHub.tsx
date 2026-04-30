'use client'

import { useApp } from '@/lib/context'
import { STRATEGY_PILLARS, BUDGET_BY_BRAND, BRANDS } from '@/lib/data'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { HubTabs } from '@/components/ui/HubTabs'
import { HubHeader } from '@/components/ui/HubHeader'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { formatCurrency, getBrandBadgeClass, getBrandColorClass, cn } from '@/lib/utils'
import { Target, Layers, DollarSign, TrendingUp, Flag, CheckCircle, AlertTriangle, XCircle, Plus } from 'lucide-react'
import type { StrategyPillar, BudgetAllocation } from '@/lib/types'

function PillarCard({ pillar }: { pillar: StrategyPillar }) {
  const pctUsed = Math.round((pillar.budgetUsed / pillar.budget) * 100)
  const statusIcon = {
    'on-track': <CheckCircle size={14} className="text-emerald-500" />,
    'at-risk': <AlertTriangle size={14} className="text-amber-500" />,
    behind: <XCircle size={14} className="text-red-500" />,
  }[pillar.status]

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center shrink-0">
            {pillar.priority}
          </div>
          <h4 className="text-sm font-semibold text-slate-800">{pillar.title}</h4>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {statusIcon}
          <StatusBadge status={pillar.status} />
        </div>
      </div>
      <p className="text-xs text-slate-500 mb-4 leading-relaxed">{pillar.description}</p>
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-500">Budget utilization</span>
            <span className="font-semibold text-slate-700">
              {formatCurrency(pillar.budgetUsed, true)} / {formatCurrency(pillar.budget, true)}
            </span>
          </div>
          <ProgressBar value={pillar.budgetUsed} max={pillar.budget} color="auto" showLabel />
        </div>
        <div className="flex items-center gap-4 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Layers size={12} />
            <span>{pillar.campaigns} campaigns linked</span>
          </div>
          <button className="ml-auto text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors">
            View plan →
          </button>
        </div>
      </div>
    </Card>
  )
}

function BudgetRow({ alloc }: { alloc: BudgetAllocation }) {
  const brand = BRANDS.find((b) => b.id === alloc.brand)
  const pctSpent = Math.round((alloc.spent / alloc.total) * 100)
  const pctAllocated = Math.round((alloc.allocated / alloc.total) * 100)

  return (
    <div className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
      <div className={cn('px-2 py-0.5 rounded-md text-xs font-medium border w-28 text-center shrink-0', getBrandBadgeClass(alloc.brand))}>
        {brand?.shortName}
      </div>
      <div className="flex-1 space-y-1.5">
        <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full rounded-full opacity-30 transition-all"
            style={{ width: `${pctAllocated}%`, backgroundColor: brand?.color }}
          />
          <div
            className="absolute left-0 top-0 h-full rounded-full transition-all"
            style={{ width: `${pctSpent}%`, backgroundColor: brand?.color }}
          />
        </div>
      </div>
      <div className="text-right shrink-0 w-20">
        <p className="text-xs font-semibold text-slate-700">{formatCurrency(alloc.spent, true)} spent</p>
        <p className="text-[10px] text-slate-400">of {formatCurrency(alloc.total, true)}</p>
      </div>
      <div className="text-right shrink-0 w-16">
        <p className="text-xs font-semibold text-emerald-600">{formatCurrency(alloc.remaining, true)}</p>
        <p className="text-[10px] text-slate-400">remaining</p>
      </div>
    </div>
  )
}

const budgetChartData = BUDGET_BY_BRAND.map((a) => {
  const brand = BRANDS.find((b) => b.id === a.brand)
  return {
    name: brand?.shortName ?? a.brand,
    Spent: a.spent,
    Remaining: a.remaining,
    fill: brand?.color,
  }
})

export default function StrategyHub() {
  const { currentBrand } = useApp()

  const pillars = currentBrand.id === 'group'
    ? STRATEGY_PILLARS
    : STRATEGY_PILLARS.filter((p) => p.brand === currentBrand.id || p.brand === 'group')

  const budgets = currentBrand.id === 'group'
    ? BUDGET_BY_BRAND
    : BUDGET_BY_BRAND.filter((b) => b.brand === currentBrand.id)

  const totalBudget = BUDGET_BY_BRAND.reduce((s, a) => s + a.total, 0)
  const totalSpent = BUDGET_BY_BRAND.reduce((s, a) => s + a.spent, 0)
  const totalRemaining = BUDGET_BY_BRAND.reduce((s, a) => s + a.remaining, 0)

  const tabs = [
    { id: 'pillars', label: 'Strategic Pillars', badge: pillars.length },
    { id: 'budget', label: 'Budget Overview' },
    { id: 'annual-plan', label: 'Annual Plan' },
    { id: 'portfolio', label: 'Portfolio View' },
    { id: 'candidate-marketing', label: 'Candidate Marketing' },
    { id: 'market-insights', label: 'Market Insights' },
    { id: 'brand-strategy', label: 'Brand Strategy' },
    { id: 'executive-summary', label: 'Executive Summary' },
  ]

  return (
    <div className="pb-8">
      <HubHeader
        title="Strategy Hub"
        subtitle="Annual marketing strategy, pillars, budget allocation and brand planning"
      >
        <button className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors">
          <Plus size={13} />
          New Initiative
        </button>
      </HubHeader>

      {/* Summary KPIs */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Annual Budget', value: formatCurrency(totalBudget, true), icon: DollarSign, color: 'text-violet-600', bg: 'bg-violet-50' },
            { label: 'YTD Spend', value: formatCurrency(totalSpent, true), icon: TrendingUp, color: 'text-sky-600', bg: 'bg-sky-50' },
            { label: 'Remaining Budget', value: formatCurrency(totalRemaining, true), icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Strategic Pillars', value: String(STRATEGY_PILLARS.length), icon: Flag, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((item) => (
            <Card key={item.label} className="flex items-center gap-3">
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', item.bg)}>
                <item.icon size={18} className={item.color} />
              </div>
              <div>
                <p className="text-[11px] text-slate-500">{item.label}</p>
                <p className="text-lg font-bold text-slate-900">{item.value}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <HubTabs tabs={tabs}>
        {(activeTab) => (
          <div className="px-6 pt-5">
            {activeTab === 'pillars' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pillars.map((p) => <PillarCard key={p.id} pillar={p} />)}
              </div>
            )}

            {activeTab === 'budget' && (
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
                <div className="xl:col-span-3">
                  <Card>
                    <CardHeader title="Budget by Brand" subtitle="YTD spend vs. total allocation" />
                    <div className="divide-y divide-slate-50">
                      {budgets.map((a) => <BudgetRow key={a.brand} alloc={a} />)}
                    </div>
                  </Card>
                </div>
                <div className="xl:col-span-2">
                  <Card>
                    <CardHeader title="Spend Distribution" subtitle="Spent vs. remaining by brand" />
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={budgetChartData} layout="vertical" margin={{ left: 0, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `€${v / 1000}K`} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} width={70} />
                        <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #e2e8f0' }} />
                        <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                        <Bar dataKey="Spent" fill="#7c3aed" radius={[0, 3, 3, 0]} />
                        <Bar dataKey="Remaining" fill="#e2e8f0" radius={[0, 3, 3, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'annual-plan' && (
              <Card>
                <CardHeader title="2026 Annual Marketing Plan" subtitle="Strategic roadmap across all brands and quarters" />
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left py-2 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wide w-40">Initiative</th>
                        <th className="text-center py-2 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Q1</th>
                        <th className="text-center py-2 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Q2</th>
                        <th className="text-center py-2 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Q3</th>
                        <th className="text-center py-2 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Q4</th>
                        <th className="text-right py-2 pl-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Budget</th>
                        <th className="text-center py-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {[
                        { name: 'Employer Brand Refresh', q1: true, q2: true, q3: false, q4: false, budget: 180000, status: 'on-track' },
                        { name: 'Digital-First Candidate Acq.', q1: true, q2: true, q3: true, q4: true, budget: 240000, status: 'at-risk' },
                        { name: 'Sales Enablement Program', q1: false, q2: true, q3: true, q4: false, budget: 120000, status: 'on-track' },
                        { name: 'Brand Consistency Audit', q1: true, q2: false, q3: false, q4: true, budget: 60000, status: 'behind' },
                        { name: 'Executive Search Campaign', q1: false, q2: false, q3: true, q4: true, budget: 55000, status: 'on-track' },
                        { name: 'Healthcare Talent Pipeline', q1: true, q2: true, q3: false, q4: false, budget: 90000, status: 'at-risk' },
                      ].map((row) => (
                        <tr key={row.name} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 pr-4 text-sm font-medium text-slate-700">{row.name}</td>
                          {['q1', 'q2', 'q3', 'q4'].map((q) => (
                            <td key={q} className="text-center py-3 px-2">
                              {row[q as keyof typeof row] ? (
                                <div className="w-full h-5 bg-violet-200 rounded mx-auto max-w-16" />
                              ) : (
                                <div className="w-full h-5 bg-slate-100 rounded mx-auto max-w-16 opacity-40" />
                              )}
                            </td>
                          ))}
                          <td className="text-right py-3 pl-4 text-sm font-semibold text-slate-700">{formatCurrency(row.budget, true)}</td>
                          <td className="text-center py-3 px-4"><StatusBadge status={row.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {activeTab === 'brand-strategy' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {BRANDS.filter((b) => b.id !== 'group').map((brand) => (
                  <Card key={brand.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: brand.bgColor }}>
                        <span className="text-xs font-bold" style={{ color: brand.color }}>
                          {brand.shortName.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800">{brand.name}</h4>
                        <p className="text-xs text-slate-500">{brand.description}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: 'Brand Guidelines', status: 'approved' },
                        { label: 'Tone of Voice', status: 'approved' },
                        { label: 'Visual Identity', status: 'on-track' },
                        { label: 'Digital Strategy', status: brand.id === 'bright-plus' ? 'at-risk' : 'on-track' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">{item.label}</span>
                          <StatusBadge status={item.status} />
                        </div>
                      ))}
                    </div>
                    <button className="mt-3 w-full text-xs font-medium text-center py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors">
                      Open Brand Hub
                    </button>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'portfolio' && (
              <Card>
                <CardHeader title="Campaign Portfolio Matrix" subtitle="Classify campaigns by impact vs. effort to prioritize" />
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { quadrant: 'Quick Win', desc: 'High impact, Low effort', color: 'bg-emerald-50 border-emerald-200', badge: 'success' as const, campaigns: ['HR Solutions Spring — Solvus', 'Flex Work Month — Start People'] },
                    { quadrant: 'Strategic Bet', desc: 'High impact, High effort', color: 'bg-violet-50 border-violet-200', badge: 'purple' as const, campaigns: ['Spring Office Revival — Unique', 'Healthcare Heroes — Express Medical'] },
                    { quadrant: 'Fill-in', desc: 'Low impact, Low effort', color: 'bg-slate-50 border-slate-200', badge: 'default' as const, campaigns: [] },
                    { quadrant: 'Low Value', desc: 'Low impact, High effort', color: 'bg-red-50 border-red-200', badge: 'danger' as const, campaigns: [] },
                  ].map((q) => (
                    <div key={q.quadrant} className={cn('p-4 rounded-xl border-2', q.color)}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{q.quadrant}</p>
                          <p className="text-xs text-slate-500">{q.desc}</p>
                        </div>
                        <Badge variant={q.badge}>{q.campaigns.length}</Badge>
                      </div>
                      <div className="space-y-1.5">
                        {q.campaigns.map((c) => (
                          <div key={c} className="text-xs bg-white rounded-lg px-2.5 py-1.5 border border-slate-100 text-slate-700">{c}</div>
                        ))}
                        {q.campaigns.length === 0 && <p className="text-xs text-slate-400 italic">No campaigns in this quadrant</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'candidate-marketing' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {[
                  { brand: 'unique', persona: 'Office Professional', role: 'Admin / Secretariat', region: 'Brussels + Wallonia', shortage: false, status: 'active', applications: 412, target: 600, cpa: '€69' },
                  { brand: 'express-medical', persona: 'Healthcare Worker', role: 'Nurse / Care Assistant', region: 'Nationwide', shortage: true, status: 'at-risk', applications: 72, target: 150, cpa: '€197' },
                  { brand: 'usg-professionals', persona: 'IT Professional', role: 'Developer / Analyst', region: 'Antwerp + Brussels', shortage: true, status: 'planning', applications: 0, target: 300, cpa: '—' },
                  { brand: 'start-people', persona: 'Flex Worker', role: 'Warehouse / Logistics', region: 'Flanders', shortage: false, status: 'active', applications: 820, target: 1000, cpa: '€35' },
                  { brand: 'bright-plus', persona: 'Executive', role: 'C-Suite / Director', region: 'Belgium', shortage: false, status: 'planning', applications: 0, target: 80, cpa: '—' },
                ].map((item) => (
                  <Card key={item.persona} className="hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded-md border', getBrandBadgeClass(item.brand as any))}>{item.brand}</span>
                          {item.shortage && <Badge variant="danger">Shortage Role</Badge>}
                        </div>
                        <h4 className="text-sm font-semibold text-slate-800">{item.persona}</h4>
                        <p className="text-xs text-slate-500">{item.role} · {item.region}</p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Applications</span>
                        <span className="font-semibold text-slate-700">{item.applications} / {item.target}</span>
                      </div>
                      <ProgressBar value={item.applications} max={item.target} color="auto" />
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Cost per Apply</span>
                        <span className="font-semibold text-slate-700">{item.cpa}</span>
                      </div>
                    </div>
                    <button className="mt-3 w-full text-xs font-medium text-center py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-violet-600 transition-colors">
                      View Campaign →
                    </button>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'market-insights' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {[
                  { type: 'SHORTAGE_OCCUPATION', title: 'IT Developer shortage intensifies in Belgium', body: 'VDAB reports 23% increase in unfilled IT roles. Average time-to-fill: 87 days. Key risk for USG Professionals pipeline.', relevance: 'HIGH', date: 'Apr 28, 2026', convertible: true },
                  { type: 'STAFFING_TREND', title: 'Flex work demand up 18% vs. Q1 2025', body: 'Post-pandemic normalization of hybrid work is driving renewed interest in flexible staffing solutions across logistics and admin.', relevance: 'HIGH', date: 'Apr 20, 2026', convertible: true },
                  { type: 'COMPETITOR_SIGNAL', title: 'Randstad launches new employer brand campaign', body: 'Competitor activated a national TV + LinkedIn campaign targeting healthcare candidates. Budget estimated at €500K+.', relevance: 'MEDIUM', date: 'Apr 15, 2026', convertible: false },
                  { type: 'SECTOR_INSIGHT', title: 'Healthcare sector: 40% of candidates prefer flex contracts', body: 'New survey from Federgon shows strong preference for flex contracts among nursing and care professionals aged 25–35.', relevance: 'HIGH', date: 'Apr 10, 2026', convertible: true },
                  { type: 'REGIONAL_INSIGHT', title: 'Brussels tech job market: growing despite uncertainty', body: 'Despite macro headwinds, Brussels tech sector added 2,400 jobs in Q1 2026. Opportunity for USG Professionals and Bright Plus.', relevance: 'MEDIUM', date: 'Apr 5, 2026', convertible: true },
                  { type: 'MARKET_TREND', title: 'AI adoption driving demand for hybrid skill profiles', body: 'Employers increasingly seek candidates combining technical AI literacy with domain expertise. New candidate persona opportunity.', relevance: 'MEDIUM', date: 'Mar 28, 2026', convertible: true },
                ].map((insight) => (
                  <Card key={insight.title} className="hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant={insight.relevance === 'HIGH' ? 'danger' : 'warning'}>{insight.relevance} relevance</Badge>
                      <span className="text-xs text-slate-400">{insight.date}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-800 mb-1.5">{insight.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">{insight.body}</p>
                    {insight.convertible && (
                      <div className="flex gap-2">
                        <button className="flex-1 text-[10px] font-medium py-1.5 rounded-lg bg-violet-50 border border-violet-200 text-violet-700 hover:bg-violet-100 transition-colors">→ Campaign</button>
                        <button className="flex-1 text-[10px] font-medium py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 hover:bg-sky-100 transition-colors">→ Sales Asset</button>
                        <button className="flex-1 text-[10px] font-medium py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors">→ Content</button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'executive-summary' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <div className="xl:col-span-2 space-y-4">
                  <Card>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">Executive Marketing Summary — April 2026</h3>
                        <p className="text-xs text-slate-500">RGF Staffing Belgium · All Brands · Generated Apr 30, 2026</p>
                      </div>
                      <button className="flex items-center gap-1.5 text-xs font-medium text-violet-600 bg-violet-50 border border-violet-200 px-2.5 py-1.5 rounded-lg hover:bg-violet-100 transition-colors">
                        Export PDF
                      </button>
                    </div>
                    <div className="space-y-5">
                      {[
                        { section: 'Situation', content: 'In April 2026, RGF Staffing Belgium activated 12 campaigns across 6 brands. Digital spend reached €61K with €340K remaining in annual budget. Campaign health averages 68/100 — two campaigns flagged at-risk.' },
                        { section: 'Key Priorities', content: '(1) Approve Unique Spring campaign to unlock €45K activation. (2) Address Express Medical candidate shortage with targeted re-engagement. (3) Complete GDPR email consent audit before May 15 deadline.' },
                        { section: 'Performance Highlights', content: 'Solvus HR Solutions delivering 2.8% LinkedIn CTR (above 2.2% benchmark). Email open rates at 31% across all brands. Start People Flex Work Month reached 412/500 registrations target (82%).' },
                        { section: 'Risks & Blockers', content: 'Healthcare Heroes campaign 52% below target — requires immediate budget reallocation from print to digital. Bright Plus Executive campaign approval overdue by 3 days. Sophie Martens at 95% capacity — risk to Q2 delivery.' },
                        { section: 'Decisions Required', content: '(1) Approve Bright Plus campaign budget €55K by May 3. (2) Authorize Express Medical budget reallocation €8K. (3) Sign off Solvus Q2 budget increase +€15K. (4) Assign backup reviewer for Compliance Queue.' },
                      ].map((item) => (
                        <div key={item.section}>
                          <p className="text-xs font-bold text-violet-700 uppercase tracking-wide mb-1.5">{item.section}</p>
                          <p className="text-sm text-slate-700 leading-relaxed">{item.content}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
                <div className="space-y-4">
                  <Card>
                    <CardHeader title="Summary Metrics" />
                    {[
                      { label: 'Active Campaigns', value: '12' },
                      { label: 'Total YTD Spend', value: '€196K' },
                      { label: 'Annual Budget Remaining', value: '€494K' },
                      { label: 'Leads Generated (Apr)', value: '320' },
                      { label: 'Applications (Apr)', value: '540' },
                      { label: 'Avg Campaign Health', value: '68/100' },
                      { label: 'Pending Approvals', value: '4' },
                      { label: 'Compliance Issues', value: '2' },
                    ].map((m) => (
                      <div key={m.label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 text-sm">
                        <span className="text-slate-500">{m.label}</span>
                        <span className="font-bold text-slate-800">{m.value}</span>
                      </div>
                    ))}
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}
      </HubTabs>
    </div>
  )
}
