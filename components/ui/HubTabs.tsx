'use client'

import { useState, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
  badge?: number | string
}

interface HubTabsProps {
  tabs: Tab[]
  children: (activeTab: string) => ReactNode
  defaultTab?: string
  className?: string
}

export function HubTabs({ tabs, children, defaultTab, className }: HubTabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id)

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Tab bar */}
      <div className="flex border-b border-slate-200 gap-0 px-6 bg-white sticky top-0 z-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px whitespace-nowrap',
              active === tab.id
                ? 'text-violet-700 border-violet-600'
                : 'text-slate-500 border-transparent hover:text-slate-800 hover:border-slate-300'
            )}
          >
            {tab.label}
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                  active === tab.id ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-500'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1">{children(active)}</div>
    </div>
  )
}
