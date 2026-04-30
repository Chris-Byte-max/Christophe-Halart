'use client'

import { useState } from 'react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { generateUTMParameters } from '@/lib/ai-service'
import { cn } from '@/lib/utils'
import { Copy, Check, Sparkles, RefreshCw, AlertCircle, Link, Globe } from 'lucide-react'

interface UTMBuilderProps {
  brand: string
  campaignName: string
}

const SOURCES = ['linkedin', 'instagram', 'facebook', 'youtube', 'email', 'google', 'bing', 'newsletter', 'organic']
const MEDIA = ['paid_social', 'organic_social', 'email', 'cpc', 'display', 'referral', 'organic']
const LANGUAGES = ['fr', 'nl', 'en']

export default function UTMBuilder({ brand, campaignName }: UTMBuilderProps) {
  const [baseUrl, setBaseUrl] = useState('https://www.unique.be/candidats')
  const [source, setSource] = useState('linkedin')
  const [medium, setMedium] = useState('paid_social')
  const [campaign, setCampaign] = useState(campaignName.toLowerCase().replace(/\s/g, '_'))
  const [content, setContent] = useState('')
  const [term, setTerm] = useState('')
  const [language, setLanguage] = useState('fr')
  const [audience, setAudience] = useState('office_professionals')
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const validate = () => {
    const errs: string[] = []
    if (!baseUrl.startsWith('http')) errs.push('Base URL must start with http:// or https://')
    if (!source) errs.push('Source is required')
    if (!medium) errs.push('Medium is required')
    if (!campaign) errs.push('Campaign is required')
    setErrors(errs)
    return errs.length === 0
  }

  const buildUrl = () => {
    if (!validate()) return
    const sep = baseUrl.includes('?') ? '&' : '?'
    const params = new URLSearchParams()
    params.set('utm_source', source)
    params.set('utm_medium', medium)
    params.set('utm_campaign', campaign)
    if (content) params.set('utm_content', content)
    if (term) params.set('utm_term', term)
    setGeneratedUrl(`${baseUrl}${sep}${params.toString()}`)
  }

  const handleAISuggest = async () => {
    setAiLoading(true)
    const result = await generateUTMParameters({ baseUrl, brand, campaign: campaignName, channel: source, audience, language })
    setCampaign(result.data.utmCampaign)
    setContent(result.data.utmContent)
    setGeneratedUrl(result.data.generatedUrl)
    setAiLoading(false)
  }

  const handleCopy = () => {
    if (!generatedUrl) return
    navigator.clipboard.writeText(generatedUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader
        title="UTM Builder"
        subtitle="Generate consistent tracking URLs with naming convention validation"
        action={
          <button
            onClick={handleAISuggest}
            disabled={aiLoading}
            className="flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors bg-violet-50 border border-violet-200 px-2.5 py-1.5 rounded-lg"
          >
            {aiLoading ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
            AI Suggest
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Base URL */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Base URL *</label>
          <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 focus-within:border-violet-400 transition-colors bg-white">
            <Globe size={14} className="text-slate-400 shrink-0" />
            <input
              type="url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://www.unique.be/candidats"
              className="flex-1 text-sm text-slate-700 placeholder:text-slate-400 outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Source */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Source *</label>
          <div className="flex flex-wrap gap-1.5">
            {SOURCES.map((s) => (
              <button
                key={s}
                onClick={() => setSource(s)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-medium border transition-all',
                  source === s ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
                )}
              >
                {s}
              </button>
            ))}
            <input
              type="text"
              value={!SOURCES.includes(source) ? source : ''}
              onChange={(e) => setSource(e.target.value)}
              placeholder="custom..."
              className="px-2.5 py-1 border border-slate-200 rounded-lg text-xs text-slate-600 outline-none focus:border-violet-400 w-20"
            />
          </div>
        </div>

        {/* Medium */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Medium *</label>
          <div className="flex flex-wrap gap-1.5">
            {MEDIA.map((m) => (
              <button
                key={m}
                onClick={() => setMedium(m)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-medium border transition-all',
                  medium === m ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Campaign *</label>
          <input
            type="text"
            value={campaign}
            onChange={(e) => setCampaign(e.target.value.toLowerCase().replace(/\s/g, '_'))}
            placeholder="unique_spring_fr_2026"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-400 transition-colors"
          />
          <p className="text-[10px] text-slate-400 mt-1">Convention: brand_name_lang_year</p>
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Content</label>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="linkedin_office_fr"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-400 transition-colors"
          />
        </div>

        {/* Language */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Language</label>
          <div className="flex gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={cn(
                  'flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all uppercase',
                  language === l ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Audience */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Target Audience</label>
          <input
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="office_professionals"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-400 transition-colors"
          />
        </div>
      </div>

      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="mt-4 space-y-1">
          {errors.map((e) => (
            <div key={e} className="flex items-center gap-2 text-xs text-red-600">
              <AlertCircle size={12} />
              {e}
            </div>
          ))}
        </div>
      )}

      {/* Generate button */}
      <button
        onClick={buildUrl}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium text-sm py-2.5 rounded-lg transition-colors"
      >
        <Link size={14} />
        Generate Tracking URL
      </button>

      {/* Generated URL */}
      {generatedUrl && (
        <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="text-xs font-semibold text-slate-700">Generated URL</p>
            <button
              onClick={handleCopy}
              className={cn(
                'flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition-colors',
                copied ? 'bg-emerald-50 text-emerald-600' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              )}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy URL'}
            </button>
          </div>
          <p className="text-xs font-mono text-violet-700 break-all leading-relaxed">{generatedUrl}</p>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {[
              { label: 'source', value: source },
              { label: 'medium', value: medium },
              { label: 'campaign', value: campaign },
              ...(content ? [{ label: 'content', value: content }] : []),
            ].map((p) => (
              <div key={p.label} className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-2 py-0.5">
                <span className="text-[10px] text-slate-400">{p.label}:</span>
                <span className="text-[10px] font-medium text-slate-700">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
