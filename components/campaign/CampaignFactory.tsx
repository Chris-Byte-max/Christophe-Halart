'use client'

import { useState } from 'react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { BRANDS } from '@/lib/data'
import { generateCampaignBrief } from '@/lib/ai-service'
import { cn, getBrandBadgeClass } from '@/lib/utils'
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Check,
  Target,
  Users,
  Globe,
  Megaphone,
  DollarSign,
  Loader2,
} from 'lucide-react'

type Step = 'brand' | 'objective' | 'audience' | 'channels' | 'context' | 'generate'

interface FactoryInput {
  brand: string
  objective: string
  audience: string
  campaignType: string
  channels: string[]
  language: string
  businessContext: string
  quarterlyPriority: string
}

const CAMPAIGN_TYPES = ['Recruitment', 'Employer Branding', 'Lead Generation', 'Awareness', 'Retention', 'Candidate Attraction', 'B2B Sales', 'Seasonal']
const CHANNELS = ['linkedin', 'instagram', 'facebook', 'youtube', 'email', 'website', 'search', 'display', 'print']
const AUDIENCES = [
  'Office & Admin Professionals', 'IT & Tech Professionals', 'Healthcare & Medical', 'Engineering & Industrial',
  'Executive & Senior Leadership', 'Flex & Temp Workers', 'HR Decision-Makers', 'Finance Professionals',
]
const PRIORITIES = ['Q2 Employer Brand Push', 'Digital Candidate Acquisition', 'Sales Lead Generation', 'Brand Awareness', 'Shortage Roles']

const STEPS: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: 'brand', label: 'Brand', icon: Target },
  { id: 'objective', label: 'Objective', icon: Target },
  { id: 'audience', label: 'Audience', icon: Users },
  { id: 'channels', label: 'Channels', icon: Globe },
  { id: 'context', label: 'Context', icon: Megaphone },
  { id: 'generate', label: 'Generate', icon: Sparkles },
]

export default function CampaignFactory() {
  const [currentStep, setCurrentStep] = useState<Step>('brand')
  const [input, setInput] = useState<FactoryInput>({
    brand: '', objective: '', audience: '', campaignType: '',
    channels: [], language: 'fr', businessContext: '', quarterlyPriority: '',
  })
  const [generated, setGenerated] = useState<Awaited<ReturnType<typeof generateCampaignBrief>>['data'] | null>(null)
  const [loading, setLoading] = useState(false)

  const stepIdx = STEPS.findIndex((s) => s.id === currentStep)
  const canNext = () => {
    if (currentStep === 'brand') return !!input.brand
    if (currentStep === 'objective') return !!input.objective && !!input.campaignType
    if (currentStep === 'audience') return !!input.audience
    if (currentStep === 'channels') return input.channels.length > 0
    return true
  }

  const next = () => {
    const nextStep = STEPS[stepIdx + 1]
    if (nextStep) setCurrentStep(nextStep.id)
  }
  const prev = () => {
    const prevStep = STEPS[stepIdx - 1]
    if (prevStep) setCurrentStep(prevStep.id)
  }

  const handleGenerate = async () => {
    setLoading(true)
    const result = await generateCampaignBrief({
      brand: input.brand,
      objective: input.objective,
      audience: input.audience,
      type: input.campaignType,
      channels: input.channels,
      businessContext: input.businessContext,
    })
    setGenerated(result.data)
    setLoading(false)
  }

  const toggleChannel = (ch: string) => {
    setInput((prev) => ({
      ...prev,
      channels: prev.channels.includes(ch) ? prev.channels.filter((c) => c !== ch) : [...prev.channels, ch],
    }))
  }

  return (
    <div className="space-y-4">
      {/* Step indicator */}
      <div className="flex items-center gap-1">
        {STEPS.map((step, i) => {
          const active = step.id === currentStep
          const done = i < stepIdx
          return (
            <div key={step.id} className="flex items-center gap-1">
              <button
                onClick={() => done ? setCurrentStep(step.id) : undefined}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  active ? 'bg-violet-600 text-white' : done ? 'bg-violet-100 text-violet-700 cursor-pointer' : 'bg-slate-100 text-slate-400'
                )}
              >
                {done ? <Check size={11} /> : <step.icon size={11} />}
                {step.label}
              </button>
              {i < STEPS.length - 1 && <ChevronRight size={12} className="text-slate-300" />}
            </div>
          )
        })}
      </div>

      <Card>
        {/* Step: Brand */}
        {currentStep === 'brand' && (
          <div>
            <CardHeader title="Select Brand" subtitle="Which brand is this campaign for?" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {BRANDS.filter((b) => b.id !== 'group').map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => setInput((p) => ({ ...p, brand: brand.id }))}
                  className={cn(
                    'flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left',
                    input.brand === brand.id ? 'border-violet-600 bg-violet-50' : 'border-slate-100 hover:border-slate-300 bg-white'
                  )}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: brand.bgColor }}>
                    <span className="text-xs font-bold" style={{ color: brand.color }}>{brand.shortName.substring(0, 2).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{brand.shortName}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{brand.description}</p>
                  </div>
                  {input.brand === brand.id && <Check size={14} className="text-violet-600 ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Objective */}
        {currentStep === 'objective' && (
          <div>
            <CardHeader title="Campaign Objective" subtitle="What do you want to achieve?" />
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">Campaign Type</label>
                <div className="flex flex-wrap gap-2">
                  {CAMPAIGN_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setInput((p) => ({ ...p, campaignType: t }))}
                      className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all', input.campaignType === t ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300')}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Objective Statement</label>
                <textarea
                  value={input.objective}
                  onChange={(e) => setInput((p) => ({ ...p, objective: e.target.value }))}
                  placeholder="e.g. Drive 200 qualified applications for office roles in Q2 2026"
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-400 transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">Quarterly Priority</label>
                <div className="flex flex-wrap gap-2">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p}
                      onClick={() => setInput((prev) => ({ ...prev, quarterlyPriority: p }))}
                      className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all', input.quarterlyPriority === p ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300')}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step: Audience */}
        {currentStep === 'audience' && (
          <div>
            <CardHeader title="Target Audience" subtitle="Who is this campaign for?" />
            <div className="grid grid-cols-2 gap-2 mb-4">
              {AUDIENCES.map((a) => (
                <button
                  key={a}
                  onClick={() => setInput((p) => ({ ...p, audience: a }))}
                  className={cn('p-3 rounded-xl border text-left text-sm transition-all', input.audience === a ? 'border-violet-600 bg-violet-50 font-medium text-violet-800' : 'border-slate-100 hover:border-slate-300 text-slate-700')}
                >
                  {a}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Or describe your audience</label>
              <input
                type="text"
                value={!AUDIENCES.includes(input.audience) ? input.audience : ''}
                onChange={(e) => setInput((p) => ({ ...p, audience: e.target.value }))}
                placeholder="e.g. Mid-career nurses in Brussels and Antwerp"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-400 transition-colors"
              />
            </div>
          </div>
        )}

        {/* Step: Channels */}
        {currentStep === 'channels' && (
          <div>
            <CardHeader title="Channels & Language" subtitle="Select all channels for this campaign" />
            <div className="flex flex-wrap gap-2 mb-5">
              {CHANNELS.map((ch) => {
                const selected = input.channels.includes(ch)
                return (
                  <button
                    key={ch}
                    onClick={() => toggleChannel(ch)}
                    className={cn('flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all capitalize', selected ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300')}
                  >
                    {selected && <Check size={13} />}
                    {ch}
                  </button>
                )
              })}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">Language</label>
              <div className="flex gap-2">
                {['fr', 'nl', 'en', 'fr+nl'].map((l) => (
                  <button
                    key={l}
                    onClick={() => setInput((p) => ({ ...p, language: l }))}
                    className={cn('px-4 py-2 rounded-lg text-sm font-medium border transition-all uppercase', input.language === l ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300')}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step: Context */}
        {currentStep === 'context' && (
          <div>
            <CardHeader title="Business Context" subtitle="Provide background to help the AI generate a better brief" />
            <textarea
              value={input.businessContext}
              onChange={(e) => setInput((p) => ({ ...p, businessContext: e.target.value }))}
              placeholder="e.g. We have a strong pipeline for office roles in Brussels but candidate applications dropped 20% vs. last quarter. Spring is traditionally a key hiring period. We want to reactivate passive candidates and attract new applicants before summer."
              rows={6}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-400 transition-colors resize-none"
            />
          </div>
        )}

        {/* Step: Generate */}
        {currentStep === 'generate' && (
          <div>
            <CardHeader title="Generate Campaign Brief" subtitle="AI will generate a full campaign brief based on your inputs" />
            {!generated ? (
              <div>
                <div className="bg-slate-50 rounded-xl p-4 mb-4 space-y-2">
                  {[
                    { label: 'Brand', value: BRANDS.find((b) => b.id === input.brand)?.name ?? input.brand },
                    { label: 'Type', value: input.campaignType },
                    { label: 'Objective', value: input.objective },
                    { label: 'Audience', value: input.audience },
                    { label: 'Channels', value: input.channels.join(', ') },
                    { label: 'Language', value: input.language.toUpperCase() },
                  ].map((row) => (
                    <div key={row.label} className="flex gap-3 text-sm">
                      <span className="text-slate-500 w-24 shrink-0">{row.label}</span>
                      <span className="font-medium text-slate-800">{row.value}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  {loading ? 'Generating Brief...' : 'Generate Campaign Brief with AI'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-violet-50 border border-violet-200 rounded-xl">
                  <p className="text-xs font-semibold text-violet-700 mb-1 flex items-center gap-1.5"><Sparkles size={12} /> AI-Generated Brief — Requires Human Approval</p>
                  <p className="text-sm font-semibold text-slate-800 mb-2">{generated.concept}</p>
                  <p className="text-xs text-slate-600 mb-3"><strong>Key Message:</strong> {generated.keyMessage}</p>
                  <p className="text-xs text-slate-600"><strong>CTA:</strong> {generated.cta}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-2">KPIs</p>
                    <div className="space-y-1">
                      {generated.kpis.map((kpi) => (
                        <div key={kpi.label} className="flex items-center justify-between text-xs bg-slate-50 rounded-lg px-3 py-1.5">
                          <span className="text-slate-600">{kpi.label}</span>
                          <span className="font-semibold text-slate-800">{kpi.target}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-2">Required Approvals</p>
                    <div className="space-y-1">
                      {generated.requiredApprovals.map((a) => (
                        <div key={a} className="flex items-center gap-2 text-xs text-slate-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-1.5">
                          <span>⚠️</span> {a}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors">
                    Submit for Approval
                  </button>
                  <button className="flex-1 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium rounded-xl transition-colors">
                    Save as Draft
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={prev}
            disabled={stepIdx === 0}
            className={cn('flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all', stepIdx === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100')}
          >
            <ChevronLeft size={16} /> Previous
          </button>
          {currentStep !== 'generate' ? (
            <button
              onClick={next}
              disabled={!canNext()}
              className={cn('flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all', canNext() ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed')}
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <span className="text-xs text-slate-400">Step {stepIdx + 1} of {STEPS.length}</span>
          )}
        </div>
      </Card>
    </div>
  )
}
