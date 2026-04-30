'use client'

import { useState } from 'react'
import { useApp } from '@/lib/context'
import { CONTENT_ASSETS, SALES_ASSETS, BRANDS } from '@/lib/data'
import { Card, CardHeader } from '@/components/ui/Card'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { HubTabs } from '@/components/ui/HubTabs'
import { HubHeader } from '@/components/ui/HubHeader'
import {
  cn,
  getBrandBadgeClass,
  getChannelColor,
  getChannelLabel,
} from '@/lib/utils'
import {
  FileText,
  Video,
  Image,
  Layout,
  BookOpen,
  File,
  Search,
  Plus,
  Download,
  Eye,
  Clock,
  User,
  Globe,
  ChevronRight,
  Star,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Mail,
  Monitor,
  Filter,
} from 'lucide-react'
import type { ContentAsset, SalesAsset } from '@/lib/types'

const contentTypeIcons: Record<ContentAsset['type'], React.ElementType> = {
  visual: Image,
  copy: FileText,
  video: Video,
  deck: Layout,
  template: File,
  guide: BookOpen,
}

const contentTypeBg: Record<ContentAsset['type'], string> = {
  visual: 'bg-pink-50 text-pink-600',
  copy: 'bg-violet-50 text-violet-600',
  video: 'bg-red-50 text-red-500',
  deck: 'bg-amber-50 text-amber-600',
  template: 'bg-sky-50 text-sky-600',
  guide: 'bg-emerald-50 text-emerald-600',
}

const salesTypeLabel: Record<SalesAsset['type'], string> = {
  'pitch-deck': 'Pitch Deck',
  'case-study': 'Case Study',
  brochure: 'Brochure',
  'email-template': 'Email Template',
  'battle-card': 'Battle Card',
  'one-pager': 'One Pager',
}

const langFlag: Record<SalesAsset['language'], string> = {
  fr: '🇫🇷 FR',
  nl: '🇳🇱 NL',
  en: '🇬🇧 EN',
}

function ContentAssetCard({ asset }: { asset: ContentAsset }) {
  const Icon = contentTypeIcons[asset.type]
  const iconStyle = contentTypeBg[asset.type]
  const brand = BRANDS.find((b) => b.id === asset.brand)

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex items-start gap-3 mb-3">
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', iconStyle)}>
          <Icon size={15} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 leading-snug group-hover:text-violet-700 transition-colors">
            {asset.title}
          </p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-md border', getBrandBadgeClass(asset.brand))}>
              {brand?.shortName}
            </span>
            {asset.channel && (
              <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-full text-white"
                style={{ backgroundColor: getChannelColor(asset.channel) }}
              >
                {getChannelLabel(asset.channel)}
              </span>
            )}
          </div>
        </div>
        <StatusBadge status={asset.status} />
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {asset.tags.map((tag) => (
          <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
        <span className="flex items-center gap-1">
          <Clock size={11} />
          {asset.createdAt}
        </span>
        <span className="flex items-center gap-1">
          <User size={11} />
          {asset.owner}
        </span>
        <button className="flex items-center gap-1 text-violet-600 font-medium hover:text-violet-800 transition-colors">
          <Eye size={12} />
          Preview
        </button>
      </div>
    </Card>
  )
}

function SalesAssetRow({ asset }: { asset: SalesAsset }) {
  const brand = BRANDS.find((b) => b.id === asset.brand)

  return (
    <div className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 rounded-lg px-2 transition-colors cursor-pointer">
      <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
        <FileText size={14} className="text-violet-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800">{asset.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-md border', getBrandBadgeClass(asset.brand))}>
            {brand?.shortName}
          </span>
          <span className="text-xs text-slate-400">{salesTypeLabel[asset.type]}</span>
          <span className="text-xs text-slate-400">{asset.segment}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs text-slate-400">
        <Globe size={11} />
        {langFlag[asset.language]}
      </div>
      <StatusBadge status={asset.status} />
      <div className="flex items-center gap-1 text-xs text-slate-500">
        <Download size={11} />
        {asset.downloads}
      </div>
      <span className="text-xs text-slate-400 w-20 text-right">{asset.updatedAt}</span>
      <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-violet-50 text-slate-400 hover:text-violet-600 transition-colors">
        <Download size={14} />
      </button>
    </div>
  )
}

function ChannelGuideCard({ channel, icon: Icon, color, items }: { channel: string; icon: React.ElementType; color: string; items: string[] }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
          <Icon size={16} style={{ color }} />
        </div>
        <h4 className="text-sm font-semibold text-slate-800">{channel}</h4>
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 mt-1.5" />
            {item}
          </li>
        ))}
      </ul>
      <button className="mt-3 text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors flex items-center gap-1">
        View templates <ChevronRight size={11} />
      </button>
    </Card>
  )
}

export default function ContentSalesHub() {
  const { currentBrand } = useApp()
  const [search, setSearch] = useState('')

  const content = currentBrand.id === 'group'
    ? CONTENT_ASSETS
    : CONTENT_ASSETS.filter((a) => a.brand === currentBrand.id)

  const sales = currentBrand.id === 'group'
    ? SALES_ASSETS
    : SALES_ASSETS.filter((a) => a.brand === currentBrand.id)

  const filtered = content.filter((a) =>
    !search || a.title.toLowerCase().includes(search.toLowerCase())
  )

  const tabs = [
    { id: 'content', label: 'Content Library', badge: content.length },
    { id: 'sales', label: 'Sales Assets', badge: sales.length },
    { id: 'brand-assets', label: 'Brand Assets' },
    { id: 'channel-guide', label: 'Channel Guide' },
  ]

  return (
    <div className="pb-8">
      <HubHeader
        title="Content & Sales Hub"
        subtitle="Manage content library, sales tools, brand assets and channel guidance"
      >
        <button className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors">
          <Plus size={13} />
          Upload Asset
        </button>
      </HubHeader>

      <HubTabs tabs={tabs}>
        {(activeTab) => (
          <div className="px-6 pt-4">
            {activeTab === 'content' && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 max-w-72">
                    <Search size={14} className="text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search content..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none flex-1"
                    />
                  </div>
                  <button className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                    <Filter size={13} />
                    Filter by type
                    <ChevronRight size={12} />
                  </button>
                  <div className="ml-auto flex gap-2">
                    {(['visual', 'copy', 'video', 'deck', 'template'] as const).map((type) => {
                      const Icon = contentTypeIcons[type]
                      const count = filtered.filter((a) => a.type === type).length
                      return (
                        <div key={type} className={cn('flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border', contentTypeBg[type], 'border-transparent')}>
                          <Icon size={12} />
                          {count}
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map((a) => <ContentAssetCard key={a.id} asset={a} />)}
                  {filtered.length === 0 && (
                    <div className="col-span-3 text-center py-12 text-slate-400">
                      <FileText size={32} className="mx-auto mb-3 opacity-40" />
                      <p className="text-sm">No content assets found</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'sales' && (
              <Card padding="none">
                <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">Sales Asset Library</h3>
                    <p className="text-xs text-slate-500">{sales.length} assets available</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                      <Search size={13} className="text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search sales assets..."
                        className="bg-transparent text-xs text-slate-700 placeholder:text-slate-400 outline-none w-40"
                      />
                    </div>
                    <button className="flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors px-2 py-1.5 border border-violet-200 rounded-lg">
                      <Download size={12} />
                      Export All
                    </button>
                  </div>
                </div>
                <div className="px-5 pb-5">
                  {sales.map((a) => <SalesAssetRow key={a.id} asset={a} />)}
                  {sales.length === 0 && (
                    <p className="text-center py-8 text-sm text-slate-400">No sales assets in this workspace</p>
                  )}
                </div>
              </Card>
            )}

            {activeTab === 'brand-assets' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {BRANDS.filter((b) => b.id !== 'group' && (currentBrand.id === 'group' || b.id === currentBrand.id)).map((brand) => (
                  <Card key={brand.id} className="hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: brand.bgColor }}>
                        <span className="text-sm font-bold" style={{ color: brand.color }}>
                          {brand.shortName.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800">{brand.name}</h4>
                        <p className="text-xs text-slate-500">Brand Asset Kit</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {[
                        { label: 'Logo Pack', files: 12 },
                        { label: 'Color Palette', files: 1 },
                        { label: 'Typography', files: 3 },
                        { label: 'Templates', files: 8 },
                        { label: 'Photography', files: 24 },
                        { label: 'Guidelines PDF', files: 1 },
                      ].map((item) => (
                        <button
                          key={item.label}
                          className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-violet-50 rounded-lg border border-slate-100 hover:border-violet-200 transition-all text-left"
                        >
                          <span className="text-xs font-medium text-slate-700">{item.label}</span>
                          <span className="text-[10px] text-slate-400">{item.files}</span>
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: brand.color }} />
                      <span>Brand color: </span>
                      <code className="font-mono font-medium text-slate-700">{brand.color}</code>
                    </div>
                    <button className="mt-3 w-full text-xs font-medium text-center py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors">
                      Open Brand Kit
                    </button>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'channel-guide' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <ChannelGuideCard
                  channel="LinkedIn"
                  icon={Linkedin}
                  color="#0077B5"
                  items={[
                    'Optimal post size: 1200×627px for ads, 1:1 for organic',
                    'Best posting times: Tue-Thu, 8–10am or 12–2pm',
                    'Character limit: 700 for posts, 150 for headlines',
                    'Video max: 30 min, MP4, under 5GB',
                    'Audience: B2B, professionals, decision-makers',
                  ]}
                />
                <ChannelGuideCard
                  channel="Instagram"
                  icon={Instagram}
                  color="#E4405F"
                  items={[
                    'Feed images: 1080×1080px or 1080×1350px',
                    'Reels: 1080×1920px, max 90 seconds',
                    'Stories: 1080×1920px, max 15 seconds per story',
                    'Ideal caption: 125–150 characters + hashtags',
                    'Audience: younger candidates, employer brand',
                  ]}
                />
                <ChannelGuideCard
                  channel="Facebook"
                  icon={Facebook}
                  color="#1877F2"
                  items={[
                    'Feed image: 1200×630px',
                    'Ad image max text: 20% overlay rule',
                    'Video: 1280×720px, under 240 min',
                    'Best reach: Tue-Thu, 1–3pm',
                    'Audience: flex workers, mass market',
                  ]}
                />
                <ChannelGuideCard
                  channel="YouTube"
                  icon={Youtube}
                  color="#FF0000"
                  items={[
                    'Video: 1920×1080px (1080p minimum)',
                    'Thumbnail: 1280×720px, max 2MB',
                    'Ideal video length: 7–15 min organic, 15–30s ads',
                    'Titles: under 60 characters for full display',
                    'Audience: IT, tech, engineering candidates',
                  ]}
                />
                <ChannelGuideCard
                  channel="Email"
                  icon={Mail}
                  color="#7c3aed"
                  items={[
                    'Template width: 600px max',
                    'Subject line: 40–50 characters optimal',
                    'Pre-header: 85–100 characters',
                    'CTA button: minimum 44×44px tap target',
                    'Best send times: Tue/Wed 10am or 2pm',
                  ]}
                />
                <ChannelGuideCard
                  channel="Website & Display"
                  icon={Monitor}
                  color="#0ea5e9"
                  items={[
                    'Landing page: above-fold CTA essential',
                    'Display sizes: 300×250, 728×90, 160×600',
                    'Page speed target: under 3s LCP',
                    'UTM parameters required on all campaign links',
                    'GDPR cookie consent banner mandatory',
                  ]}
                />
              </div>
            )}
          </div>
        )}
      </HubTabs>
    </div>
  )
}
