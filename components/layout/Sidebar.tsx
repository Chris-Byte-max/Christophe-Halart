'use client'

import { useApp } from '@/lib/context'
import type { HubId } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Target,
  Megaphone,
  FileText,
  BarChart3,
} from 'lucide-react'

const HUBS: { id: HubId; label: string; icon: React.ElementType; shortLabel: string }[] = [
  { id: 'command-center', label: 'Command Center', shortLabel: 'Command', icon: LayoutDashboard },
  { id: 'strategy', label: 'Strategy Hub', shortLabel: 'Strategy', icon: Target },
  { id: 'campaigns', label: 'Campaign Hub', shortLabel: 'Campaigns', icon: Megaphone },
  { id: 'content-sales', label: 'Content & Sales Hub', shortLabel: 'Content', icon: FileText },
  { id: 'performance', label: 'Performance & Ops', shortLabel: 'Performance', icon: BarChart3 },
]

export default function Sidebar() {
  const { activeHub, setActiveHub } = useApp()

  return (
    <aside className="flex flex-col w-56 bg-slate-900 min-h-full shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-xs">RGF</span>
        </div>
        <div className="min-w-0">
          <p className="text-white font-semibold text-xs leading-tight truncate">Marketing OS</p>
          <p className="text-slate-400 text-[10px] truncate">RGF Staffing Belgium</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5">
        <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest px-2 mb-3">Navigation</p>
        {HUBS.map(({ id, label, icon: Icon }) => {
          const active = activeHub === id
          return (
            <button
              key={id}
              onClick={() => setActiveHub(id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all text-sm font-medium',
                active
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )}
            >
              <Icon size={16} className="shrink-0" />
              <span className="leading-tight">{label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-800">
        <p className="text-slate-600 text-[10px] text-center">v1.0 · April 2026</p>
      </div>
    </aside>
  )
}
