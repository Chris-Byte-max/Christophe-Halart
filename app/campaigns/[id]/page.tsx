'use client'

import { AppProvider } from '@/lib/context'
import CampaignWorkspace from '@/components/campaign/CampaignWorkspace'

export default function CampaignWorkspacePage({ params }: { params: { id: string } }) {
  return (
    <AppProvider>
      <CampaignWorkspace campaignId={params.id} />
    </AppProvider>
  )
}
