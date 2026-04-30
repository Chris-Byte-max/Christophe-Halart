/**
 * RGF Marketing OS — AI Service (Mock Implementation)
 *
 * Architecture: abstract service that works with mock responses when no API key is present.
 * Replace mock implementations with Azure OpenAI calls in V2.
 * All outputs are structured JSON. All outputs are logged before use.
 * AI-generated content must never be published without human approval.
 */

export interface AIOutput<T> {
  data: T
  model: string
  generatedAt: string
  requiresApproval: boolean
  confidence: number
}

function mockOutput<T>(data: T, confidence = 0.85): AIOutput<T> {
  return {
    data,
    model: 'mock-v1',
    generatedAt: new Date().toISOString(),
    requiresApproval: true,
    confidence,
  }
}

// ─────────────────────────────────────────
// STRATEGY
// ─────────────────────────────────────────

export async function generateMarketingPlan(input: {
  brand: string
  year: number
  objectives: string[]
  budget: number
}): Promise<AIOutput<{ pillars: { title: string; description: string; budget: number }[] }>> {
  return mockOutput({
    pillars: [
      { title: 'Employer Brand Strengthening', description: `Build ${input.brand} as the preferred employer in Belgium through authentic storytelling and digital presence.`, budget: input.budget * 0.3 },
      { title: 'Digital-First Candidate Acquisition', description: 'Shift 70% of candidate sourcing to digital channels through targeted campaigns.', budget: input.budget * 0.4 },
      { title: 'Sales Enablement & B2B Lead Generation', description: 'Equip Sales with world-class tools, content and qualified marketing leads.', budget: input.budget * 0.2 },
      { title: 'Brand Consistency & Compliance', description: 'Ensure 100% brand guideline compliance across all digital and offline touchpoints.', budget: input.budget * 0.1 },
    ],
  })
}

export async function generateQuarterlyPriorities(input: {
  brand: string
  quarter: number
  year: number
  marketContext: string
}): Promise<AIOutput<{ priorities: { title: string; objective: string; channels: string[]; impact: string }[] }>> {
  return mockOutput({
    priorities: [
      { title: `Q${input.quarter} Candidate Activation`, objective: 'Drive 150 qualified applications in key shortage roles', channels: ['LinkedIn', 'Email', 'Facebook'], impact: 'HIGH' },
      { title: `${input.brand} Employer Brand Push`, objective: 'Increase brand awareness +20% among target candidate segments', channels: ['Instagram', 'LinkedIn', 'YouTube'], impact: 'MEDIUM' },
      { title: 'Sales Pitch Refresh', objective: 'Update and distribute 3 new sales assets to Sales team', channels: ['Email', 'Sales Outreach'], impact: 'HIGH' },
    ],
  })
}

export async function generatePortfolioRecommendations(input: {
  campaigns: { id: string; name: string; impact: string; effort: string; status: string }[]
}): Promise<AIOutput<{ recommendations: { campaignId: string; action: string; reason: string }[] }>> {
  return mockOutput({
    recommendations: input.campaigns.map((c) => ({
      campaignId: c.id,
      action: c.impact === 'HIGH' && c.effort === 'LOW' ? 'PRIORITIZE' : c.impact === 'LOW' ? 'STOP' : 'CONTINUE',
      reason: c.impact === 'HIGH' && c.effort === 'LOW'
        ? 'High impact with low effort — quick win, prioritize resources.'
        : c.impact === 'LOW'
        ? 'Low impact consuming budget and capacity. Consider stopping or merging.'
        : 'On track. Continue monitoring KPIs.',
    })),
  })
}

export async function generateExecutiveSummary(input: {
  period: string
  brands: string[]
  kpis: Record<string, number>
}): Promise<AIOutput<{ summary: string; priorities: string[]; risks: string[]; decisions: string[] }>> {
  return mockOutput({
    summary: `In ${input.period}, RGF Staffing Belgium marketing activated ${input.brands.length} brand workspaces across digital and offline channels. Key performance indicators show a positive trend in lead generation (+18%) and candidate applications (+12%). Campaign health scores average 68/100, with two campaigns flagged as at-risk requiring immediate attention.`,
    priorities: [
      'Approve Q2 Unique Spring campaign to unlock €45K budget activation.',
      'Address Express Medical candidate shortage with targeted re-engagement.',
      'Complete GDPR email consent audit before next bulk email send.',
    ],
    risks: [
      'Healthcare Heroes campaign is 31% below application target — risk to Q2 pipeline.',
      'Solvus brand assets contain outdated logo — brand compliance risk.',
      'USG Professionals IT campaign launch delayed pending brief approval.',
    ],
    decisions: [
      'Approve Bright Plus Executive Search campaign budget (€55K) — deadline May 3.',
      'Authorize Express Medical budget reallocation from print to digital (€8K).',
      'Sign off Solvus Q2 budget increase request (+€15K).',
    ],
  })
}

// ─────────────────────────────────────────
// CAMPAIGNS
// ─────────────────────────────────────────

export async function generateCampaignBrief(input: {
  brand: string
  objective: string
  audience: string
  type: string
  channels: string[]
  businessContext: string
}): Promise<AIOutput<{
  concept: string
  keyMessage: string
  cta: string
  assetPlan: { type: string; channel: string; description: string }[]
  kpis: { label: string; target: string }[]
  requiredApprovals: string[]
}>> {
  return mockOutput({
    concept: `"${input.brand} — ${input.objective}" — A targeted ${input.type} campaign reaching ${input.audience} across ${input.channels.join(', ')} with authentic, benefit-led messaging.`,
    keyMessage: `${input.brand} connects you with the right opportunity at the right moment — with personal support every step of the way.`,
    cta: 'Apply now — Get matched in 48 hours',
    assetPlan: input.channels.map((ch) => ({
      type: ch === 'linkedin' ? 'Carousel Ad' : ch === 'instagram' ? 'Reel' : ch === 'email' ? 'Email Sequence' : 'Display Ad',
      channel: ch,
      description: `${ch} asset aligned to key message and target audience.`,
    })),
    kpis: [
      { label: 'Applications', target: '200' },
      { label: 'CTR', target: '2.5%' },
      { label: 'Cost per Apply', target: '€85' },
      { label: 'Email Open Rate', target: '28%' },
    ],
    requiredApprovals: ['Brand Marketing Manager', 'Compliance Review'],
  })
}

export async function generateCampaignWorkspaceSummary(input: {
  campaignName: string
  status: string
  kpis: { label: string; target: string; actual: string }[]
  blockers: string[]
}): Promise<AIOutput<{ summary: string; nextActions: string[] }>> {
  const hasBlockers = input.blockers.length > 0
  return mockOutput({
    summary: `${input.campaignName} is currently ${input.status}. ${hasBlockers ? `There are ${input.blockers.length} active blockers requiring attention.` : 'No blockers detected.'} KPI tracking shows mixed results with some metrics ahead of target.`,
    nextActions: [
      hasBlockers ? `Resolve blocker: ${input.blockers[0]}` : 'Continue monitoring KPIs daily.',
      'Review channel performance and reallocate budget to top performer.',
      'Prepare weekly status update for stakeholders.',
    ],
  })
}

export async function generateCampaignNextActions(input: {
  campaignId: string
  healthScore: number
  kpis: { label: string; achieved: boolean }[]
}): Promise<AIOutput<{ actions: { title: string; reason: string; effort: string }[] }>> {
  const failingKpis = input.kpis.filter((k) => !k.achieved)
  return mockOutput({
    actions: [
      ...(input.healthScore < 70 ? [{ title: 'Review campaign creative and messaging', reason: 'Health score below 70 — audience engagement may be declining.', effort: 'MEDIUM' }] : []),
      ...(failingKpis.length > 0 ? [{ title: `Optimize for ${failingKpis[0]?.label}`, reason: `${failingKpis[0]?.label} is below target. A/B test new messaging or CTA.`, effort: 'LOW' }] : []),
      { title: 'Add retargeting layer to underperforming channels', reason: 'Retargeting typically improves CTR by 30–50%.', effort: 'LOW' },
    ],
  })
}

export async function generateCampaignRetrospective(input: {
  campaignName: string
  duration: number
  kpis: { label: string; target: string; actual: string }[]
  spend: number
  budget: number
}): Promise<AIOutput<{
  whatWorked: string
  whatDidntWork: string
  learnings: string
  nextCampaignSuggestion: string
}>> {
  return mockOutput({
    whatWorked: 'LinkedIn targeting with job title filters delivered highest CTR. Email re-engagement sequence performed 31% above open rate benchmark.',
    whatDidntWork: 'Display ads had low conversion rate (<0.5%). Budget allocation to print yielded no measurable digital attribution.',
    learnings: 'Candidate motivation messaging outperforms job description content. Always include a concrete CTA with a timeline (e.g. "apply in 3 minutes").',
    nextCampaignSuggestion: `Build on what worked: run a follow-up ${input.campaignName} campaign with increased LinkedIn budget, remove print spend, and add a YouTube brand video to increase awareness reach.`,
  })
}

// ─────────────────────────────────────────
// CONTENT
// ─────────────────────────────────────────

export async function generateContent(input: {
  brand: string
  type: string
  channel: string
  language: string
  objective: string
  audience: string
  keyMessage: string
}): Promise<AIOutput<{ content: string; headline?: string; cta?: string }>> {
  const contentMap: Record<string, string> = {
    linkedin: `🚀 ${input.brand} is hiring.\n\nWe're looking for talented ${input.audience} professionals who want to make a real impact.\n\n${input.keyMessage}\n\n✅ Flexible hours\n✅ Expert support\n✅ Proven track record\n\n👉 Apply today and get matched within 48 hours.\n\n#Hiring #Jobs #${input.brand.replace(/\s/g, '')}`,
    instagram: `Ready for your next step? 🌟\n\n${input.keyMessage}\n\nSwipe to discover what makes ${input.brand} different.\n\n📩 DM us or tap the link in bio to apply!`,
    email: `Subject: Your next opportunity is waiting — ${input.brand}\n\nHi [First Name],\n\nWe noticed you have experience in ${input.audience} roles — and we have something exciting for you.\n\n${input.keyMessage}\n\nClick below to explore opportunities near you.\n\n[Explore Opportunities] →\n\nBest regards,\nThe ${input.brand} Team`,
  }
  return mockOutput({
    content: contentMap[input.channel] ?? `${input.keyMessage} — ${input.brand} is your partner for success in ${input.audience} careers.`,
    headline: `${input.brand}: ${input.objective}`,
    cta: 'Apply Now',
  })
}

export async function generateContentVariant(input: {
  originalContent: string
  variantType: 'tone' | 'cta' | 'length' | 'audience'
  instruction: string
}): Promise<AIOutput<{ variant: string; rationale: string }>> {
  return mockOutput({
    variant: `[Variant — ${input.variantType}] ${input.originalContent.substring(0, 100)}... [adapted: ${input.instruction}]`,
    rationale: `This variant adjusts the ${input.variantType} to ${input.instruction}. Expected to improve engagement among the target segment.`,
  })
}

export async function compareContentVariants(input: {
  variantA: string
  variantB: string
  channel: string
  kpi: string
}): Promise<AIOutput<{ winner: 'A' | 'B' | 'unclear'; confidence: number; reasoning: string }>> {
  return mockOutput({ winner: 'A', confidence: 0.72, reasoning: `Variant A has a stronger opening hook and clearer CTA, which typically drives higher ${input.kpi} on ${input.channel}.` })
}

export async function improveContentBasedOnFeedback(input: {
  content: string
  feedback: string
  brand: string
}): Promise<AIOutput<{ improved: string; changes: string[] }>> {
  return mockOutput({
    improved: `[Improved based on feedback: "${input.feedback}"]\n\n${input.content}`,
    changes: [`Applied feedback: ${input.feedback}`, 'Adjusted tone to match brand voice', 'Strengthened CTA'],
  })
}

export async function scoreBrandFit(input: {
  content: string
  brand: string
  toneOfVoice: string
  approvedVocabulary: string[]
  forbiddenWording: string[]
}): Promise<AIOutput<{ score: number; issues: string[]; suggestions: string[] }>> {
  const forbidden = input.forbiddenWording.filter((w) => input.content.toLowerCase().includes(w.toLowerCase()))
  return mockOutput({
    score: Math.max(40, 100 - forbidden.length * 15 - Math.floor(Math.random() * 10)),
    issues: forbidden.map((w) => `Forbidden word detected: "${w}"`),
    suggestions: ['Use more active voice', 'Add a concrete proof point', 'Align CTA with brand preferred CTAs'],
  })
}

export async function checkComplianceRisk(input: {
  content: string
  brand: string
  channel: string
}): Promise<AIOutput<{ riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'BLOCKED'; findings: string[]; requiredActions: string[] }>> {
  const riskKeywords = ['guarantee', 'guaranteed', 'best salary', 'always', 'never fail', 'personal data']
  const found = riskKeywords.filter((k) => input.content.toLowerCase().includes(k))
  const riskLevel = found.length === 0 ? 'LOW' : found.length < 2 ? 'MEDIUM' : 'HIGH'
  return mockOutput({
    riskLevel,
    findings: found.map((k) => `Potentially risky claim detected: "${k}" — requires proof or source.`),
    requiredActions: found.length > 0 ? ['Add source or remove claim', 'Request legal review', 'Add disclaimer if needed'] : ['No action required'],
  })
}

export async function translateAndLocalize(input: {
  content: string
  targetLanguage: 'fr' | 'nl' | 'en'
  brand: string
  channel: string
}): Promise<AIOutput<{ translated: string; localizationNotes: string[] }>> {
  const langLabel = { fr: 'French', nl: 'Dutch', en: 'English' }[input.targetLanguage]
  return mockOutput({
    translated: `[${langLabel} translation of content for ${input.brand} on ${input.channel}]\n\n${input.content.substring(0, 50)}... [translated to ${langLabel}]`,
    localizationNotes: [
      `Adapted to ${langLabel} tone and market conventions`,
      `Belgian ${langLabel} register applied (formal/informal adjusted)`,
      'Brand name kept in original language',
    ],
  })
}

// ─────────────────────────────────────────
// SALES
// ─────────────────────────────────────────

export async function generateSalesAsset(input: {
  brand: string
  assetType: string
  segment: string
  audience: string
  language: string
}): Promise<AIOutput<{ content: string; title: string; keyPoints: string[] }>> {
  return mockOutput({
    title: `${input.brand} — ${input.assetType} for ${input.segment}`,
    content: `[Sales ${input.assetType} — ${input.brand}]\n\nWhy ${input.brand}?\n\n${input.brand} is Belgium's leading staffing partner for ${input.segment} organizations. With deep expertise in ${input.audience} profiles, we deliver quality candidates within your timeline and budget.\n\n✓ Average placement time: 5 days\n✓ 95% client satisfaction\n✓ Specialized consultants per sector\n✓ GDPR-compliant candidate screening\n\nReady to get started?\n📞 Contact your dedicated consultant today.`,
    keyPoints: ['Sector expertise', 'Fast placement', 'Quality guarantee', 'Full compliance'],
  })
}

// ─────────────────────────────────────────
// DIGITAL
// ─────────────────────────────────────────

export async function generateUTMParameters(input: {
  baseUrl: string
  brand: string
  campaign: string
  channel: string
  audience: string
  language: string
}): Promise<AIOutput<{ utmSource: string; utmMedium: string; utmCampaign: string; utmContent: string; generatedUrl: string }>> {
  const brand = input.brand.toLowerCase().replace(/\s/g, '-')
  const campaign = input.campaign.toLowerCase().replace(/\s/g, '_')
  const channel = input.channel.toLowerCase()
  const mediumMap: Record<string, string> = { linkedin: 'paid_social', instagram: 'paid_social', facebook: 'paid_social', email: 'email', website: 'organic', search: 'cpc' }
  const medium = mediumMap[channel] ?? 'digital'
  const utmSource = channel
  const utmMedium = medium
  const utmCampaign = `${brand}_${campaign}_${input.language}_2026`
  const utmContent = `${channel}_${input.audience.toLowerCase().replace(/\s/g, '_')}`
  const sep = input.baseUrl.includes('?') ? '&' : '?'
  const generatedUrl = `${input.baseUrl}${sep}utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}&utm_content=${utmContent}`
  return mockOutput({ utmSource, utmMedium, utmCampaign, utmContent, generatedUrl })
}

export async function generateLandingPageBrief(input: {
  campaignName: string
  brand: string
  objective: string
  audience: string
  keyMessage: string
  cta: string
}): Promise<AIOutput<{
  headline: string
  subheadline: string
  heroMessage: string
  valueProposition: string
  painPoints: string[]
  proofPoints: string[]
  faqIdeas: string[]
  seoTitle: string
  metaDescription: string
  h1Structure: string
}>> {
  return mockOutput({
    headline: `${input.keyMessage}`,
    subheadline: `${input.brand} matches ${input.audience} professionals with the right opportunity — fast, personal, reliable.`,
    heroMessage: `Join 50,000+ professionals who found their next step with ${input.brand}.`,
    valueProposition: `${input.brand} combines sector expertise, personal guidance and a proven track record to connect you with the best opportunities in Belgium.`,
    painPoints: [
      'Struggling to find a job that matches your skills and ambitions?',
      'Tired of generic job boards with no personal follow-up?',
      'Not sure how to negotiate the right salary and conditions?',
    ],
    proofPoints: [
      '95% candidate satisfaction rate',
      'Average placement in 5 working days',
      'Expert consultants per sector and region',
      'Trusted by 2,000+ Belgian companies',
    ],
    faqIdeas: [
      'How does the process work?',
      'Is it free for candidates?',
      'How long before I get matched?',
      'What types of contracts do you offer?',
    ],
    seoTitle: `${input.campaignName} | ${input.brand}`,
    metaDescription: `${input.brand}: ${input.keyMessage.substring(0, 100)}. ${input.cta}.`,
    h1Structure: `H1: ${input.keyMessage} / H2: Why Choose ${input.brand}? / H2: How It Works / H2: Real Results`,
  })
}

export async function generateABTestVariants(input: {
  baseContent: string
  channel: string
  variantCount: number
  element: string
}): Promise<AIOutput<{ variants: { name: string; content: string; hypothesis: string }[] }>> {
  return mockOutput({
    variants: Array.from({ length: input.variantCount }, (_, i) => ({
      name: `Variant ${String.fromCharCode(65 + i)}`,
      content: `[${input.element} variant ${i + 1} for ${input.channel}] ${input.baseContent.substring(0, 80)}...`,
      hypothesis: `Variant ${i + 1} tests a ${i === 0 ? 'stronger CTA' : i === 1 ? 'benefit-led opening' : 'shorter copy'} to improve ${input.channel} engagement.`,
    })),
  })
}

// ─────────────────────────────────────────
// PERFORMANCE
// ─────────────────────────────────────────

export async function analyzeFunnelPerformance(input: {
  impressions: number
  clicks: number
  landingViews: number
  formStarts: number
  submissions: number
  leads: number
}): Promise<AIOutput<{ dropOffPoints: { stage: string; rate: number; recommendation: string }[]; overallEfficiency: string }>> {
  const clickRate = (input.clicks / input.impressions) * 100
  const landingRate = (input.landingViews / input.clicks) * 100
  const formStartRate = (input.formStarts / input.landingViews) * 100
  const completionRate = (input.submissions / input.formStarts) * 100
  return mockOutput({
    dropOffPoints: [
      { stage: 'Impression → Click', rate: clickRate, recommendation: clickRate < 2 ? 'Improve ad creative or targeting — CTR below 2% benchmark.' : 'CTR healthy.' },
      { stage: 'Click → Landing Page', rate: landingRate, recommendation: landingRate < 60 ? 'High bounce — review page speed and above-fold content.' : 'Landing page retention good.' },
      { stage: 'Landing → Form Start', rate: formStartRate, recommendation: formStartRate < 30 ? 'Low form engagement — simplify form or improve CTA placement.' : 'Form engagement healthy.' },
      { stage: 'Form Start → Submit', rate: completionRate, recommendation: completionRate < 50 ? 'High form abandonment — reduce fields and add progress indicator.' : 'Completion rate good.' },
    ],
    overallEfficiency: `${((input.leads / input.impressions) * 100).toFixed(3)}% end-to-end conversion from impression to lead.`,
  })
}

export async function generateChannelPerformanceRecommendations(input: {
  channel: string
  ctr: number
  cpc: number
  roi: number
  spend: number
}): Promise<AIOutput<{ recommendation: string; action: string; priority: string }>> {
  const isUnderperforming = input.roi < 2 || input.ctr < 1.5
  return mockOutput({
    recommendation: isUnderperforming
      ? `${input.channel} is underperforming (ROI: ${input.roi}x, CTR: ${input.ctr}%). Consider refreshing creative and reviewing targeting parameters.`
      : `${input.channel} is performing well (ROI: ${input.roi}x, CTR: ${input.ctr}%). Consider increasing budget allocation by 15–20%.`,
    action: isUnderperforming ? 'OPTIMIZE' : 'SCALE',
    priority: input.roi < 1.5 ? 'HIGH' : 'MEDIUM',
  })
}

export async function calculateCampaignHealthScore(input: {
  kpiAchievement: number
  funnelConversion: number
  channelPerformance: number
  contentEngagement: number
  digitalReadiness: number
  complianceHealth: number
  brandFit: number
  capacityRisk: number
}): Promise<AIOutput<{ score: number; status: 'HEALTHY' | 'NEEDS_ATTENTION' | 'AT_RISK' | 'CRITICAL'; breakdown: Record<string, number> }>> {
  const weights = { kpiAchievement: 0.25, funnelConversion: 0.20, channelPerformance: 0.15, contentEngagement: 0.10, digitalReadiness: 0.10, complianceHealth: 0.10, brandFit: 0.05, capacityRisk: 0.05 }
  const score = Math.round(
    input.kpiAchievement * weights.kpiAchievement +
    input.funnelConversion * weights.funnelConversion +
    input.channelPerformance * weights.channelPerformance +
    input.contentEngagement * weights.contentEngagement +
    input.digitalReadiness * weights.digitalReadiness +
    input.complianceHealth * weights.complianceHealth +
    input.brandFit * weights.brandFit +
    (100 - input.capacityRisk) * weights.capacityRisk
  )
  const status = score >= 80 ? 'HEALTHY' : score >= 60 ? 'NEEDS_ATTENTION' : score >= 40 ? 'AT_RISK' : 'CRITICAL'
  return mockOutput({ score, status, breakdown: input })
}

export async function generateCapacityRecommendations(input: {
  teamMembers: { name: string; taskCount: number; overdue: number }[]
  upcomingDeadlines: number
}): Promise<AIOutput<{ recommendations: { person: string; recommendation: string }[]; risks: string[] }>> {
  return mockOutput({
    recommendations: input.teamMembers
      .filter((m) => m.taskCount > 5 || m.overdue > 0)
      .map((m) => ({
        person: m.name,
        recommendation: m.overdue > 0
          ? `${m.name} has ${m.overdue} overdue task(s). Prioritize resolution or reassign.`
          : `${m.name} has high workload (${m.taskCount} tasks). Consider redistributing 2–3 tasks.`,
      })),
    risks: [
      input.upcomingDeadlines > 5 ? `${input.upcomingDeadlines} deadlines in the next 7 days — capacity crunch risk.` : 'Deadline load manageable.',
      'Approval bottleneck detected — Marketing Director is single reviewer for 4 pending items.',
    ],
  })
}

export async function analyzeMarketInsight(input: {
  title: string
  body: string
  type: string
}): Promise<AIOutput<{ campaigns: string[]; salesAssets: string[]; contentIdeas: string[]; executiveSummaryItem: string }>> {
  return mockOutput({
    campaigns: [`Campaign based on insight: "${input.title}"`, 'Candidate re-engagement campaign targeting identified shortage roles'],
    salesAssets: [`Sales one-pager: ${input.title}`, 'Battle card update for Sales team'],
    contentIdeas: [`LinkedIn thought leadership post: ${input.title}`, 'Instagram reel: human story around this trend'],
    executiveSummaryItem: `Market intelligence: ${input.title} — ${input.body.substring(0, 120)}...`,
  })
}
