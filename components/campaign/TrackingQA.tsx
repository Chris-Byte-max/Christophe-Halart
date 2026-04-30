'use client'

import { useState } from 'react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { CheckCircle2, Circle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react'

type TrackingStatus = 'not_started' | 'needs_setup' | 'ready_for_test' | 'tested' | 'live' | 'issue_detected'

interface QAItem {
  id: string
  label: string
  description: string
  status: TrackingStatus
  critical: boolean
  issue?: string
}

const STATUS_CONFIG: Record<TrackingStatus, { label: string; color: string; icon: React.ElementType }> = {
  not_started: { label: 'Not Started', color: 'text-slate-400', icon: Circle },
  needs_setup: { label: 'Needs Setup', color: 'text-amber-500', icon: AlertTriangle },
  ready_for_test: { label: 'Ready to Test', color: 'text-sky-500', icon: Circle },
  tested: { label: 'Tested', color: 'text-violet-600', icon: CheckCircle2 },
  live: { label: 'Live ✓', color: 'text-emerald-600', icon: CheckCircle2 },
  issue_detected: { label: 'Issue Detected', color: 'text-red-500', icon: XCircle },
}

const INITIAL_ITEMS: QAItem[] = [
  { id: 'url', label: 'Landing page URL works', description: 'URL returns 200 status, no redirect loops', status: 'live', critical: true },
  { id: 'utm', label: 'UTM parameters present', description: 'All 3 required UTMs (source, medium, campaign) in URL', status: 'live', critical: true },
  { id: 'convention', label: 'UTM naming convention valid', description: 'Follows brand_name_lang_year pattern', status: 'tested', critical: true },
  { id: 'form', label: 'Form tracking configured', description: 'Form submit event fires in analytics', status: 'tested', critical: true },
  { id: 'thankyou', label: 'Thank-you page tracking', description: 'Conversion event on thank-you page fires', status: 'needs_setup', critical: true },
  { id: 'conversion', label: 'Conversion event defined', description: 'Goal/event defined in GA4 or platform', status: 'needs_setup', critical: false },
  { id: 'analytics', label: 'Analytics readiness checked', description: 'GA4 / Tag Manager container live and firing', status: 'ready_for_test', critical: false },
  { id: 'mapping', label: 'Source/medium/campaign mapping valid', description: 'Traffic appears correctly segmented in analytics', status: 'not_started', critical: false },
  { id: 'issues', label: 'No issues detected', description: 'No 404s, no broken scripts, no console errors', status: 'not_started', critical: false },
]

const STATUS_ORDER: TrackingStatus[] = ['not_started', 'needs_setup', 'ready_for_test', 'tested', 'live', 'issue_detected']

export default function TrackingQA() {
  const [items, setItems] = useState<QAItem[]>(INITIAL_ITEMS)
  const [loading, setLoading] = useState(false)

  const cycleStatus = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const currentIdx = STATUS_ORDER.indexOf(item.status)
        const nextStatus = STATUS_ORDER[(currentIdx + 1) % STATUS_ORDER.length]
        return { ...item, status: nextStatus }
      })
    )
  }

  const simulateAutoCheck = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        status: item.id === 'thankyou' ? 'issue_detected' : item.status === 'not_started' ? 'needs_setup' : item.status,
        issue: item.id === 'thankyou' ? 'Conversion event not firing on thank-you page — check GTM trigger.' : undefined,
      }))
    )
    setLoading(false)
  }

  const live = items.filter((i) => i.status === 'live').length
  const issues = items.filter((i) => i.status === 'issue_detected').length
  const total = items.length
  const readinessScore = Math.round((live / total) * 100)

  return (
    <Card>
      <CardHeader
        title="Tracking QA Checklist"
        subtitle={`${live}/${total} items verified — Readiness: ${readinessScore}%`}
        action={
          <button
            onClick={simulateAutoCheck}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-800 bg-violet-50 border border-violet-200 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <RefreshCw size={12} className={cn(loading && 'animate-spin')} />
            Auto-Check
          </button>
        }
      />

      <div className="space-y-2">
        {items.map((item) => {
          const config = STATUS_CONFIG[item.status]
          const Icon = config.icon
          const isIssue = item.status === 'issue_detected'

          return (
            <div
              key={item.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer hover:bg-slate-50',
                isIssue ? 'border-red-200 bg-red-50/50' : 'border-slate-100 bg-white'
              )}
              onClick={() => cycleStatus(item.id)}
            >
              <Icon size={16} className={cn('shrink-0 mt-0.5', config.color)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-medium text-slate-800">{item.label}</p>
                  {item.critical && (
                    <span className="text-[10px] font-semibold text-red-500 border border-red-200 bg-red-50 px-1 rounded">CRITICAL</span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{item.description}</p>
                {item.issue && (
                  <p className="text-xs text-red-600 font-medium mt-1 flex items-center gap-1">
                    <AlertTriangle size={11} />
                    {item.issue}
                  </p>
                )}
              </div>
              <span className={cn('text-xs font-medium shrink-0 mt-0.5', config.color)}>{config.label}</span>
            </div>
          )
        })}
      </div>

      {issues > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-xs font-semibold text-red-700 flex items-center gap-2">
            <XCircle size={14} />
            {issues} issue(s) detected — campaign cannot go live until resolved.
          </p>
        </div>
      )}
    </Card>
  )
}
