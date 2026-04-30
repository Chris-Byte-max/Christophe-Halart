'use client'

import { useApp } from '@/lib/context'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import CommandCenter from '@/components/hubs/CommandCenter'
import StrategyHub from '@/components/hubs/StrategyHub'
import CampaignHub from '@/components/hubs/CampaignHub'
import ContentSalesHub from '@/components/hubs/ContentSalesHub'
import PerformanceHub from '@/components/hubs/PerformanceHub'

export default function AppShell() {
  const { activeHub } = useApp()

  const renderHub = () => {
    switch (activeHub) {
      case 'command-center': return <CommandCenter />
      case 'strategy': return <StrategyHub />
      case 'campaigns': return <CampaignHub />
      case 'content-sales': return <ContentSalesHub />
      case 'performance': return <PerformanceHub />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar />
        <main className="flex-1 overflow-auto scrollbar-thin">
          {renderHub()}
        </main>
      </div>
    </div>
  )
}
