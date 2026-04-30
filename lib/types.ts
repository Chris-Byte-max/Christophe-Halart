export type BrandId =
  | 'group'
  | 'start-people'
  | 'unique'
  | 'express-medical'
  | 'solvus'
  | 'bright-plus'
  | 'usg-professionals'

export type AccessScope = 'brand_only' | 'multi_brand' | 'group_all_brands'

export type UserRole =
  | 'group_marketing_director'
  | 'brand_marketing_manager'
  | 'campaign_manager'
  | 'content_creator'
  | 'sales_enablement'
  | 'digital_manager'
  | 'compliance_officer'
  | 'leadership'

export type HubId =
  | 'command-center'
  | 'strategy'
  | 'campaigns'
  | 'content-sales'
  | 'performance'

export interface Brand {
  id: BrandId
  name: string
  shortName: string
  color: string
  accentColor: string
  bgColor: string
  description: string
}

export interface AppUser {
  id: string
  name: string
  initials: string
  role: UserRole
  roleLabel: string
  accessScope: AccessScope
  primaryBrand: BrandId
  allowedBrands: BrandId[]
}

export interface KPI {
  label: string
  value: string
  change: number
  trend: 'up' | 'down' | 'flat'
  period: string
}

export interface PriorityTask {
  id: string
  title: string
  description: string
  brand: BrandId
  deadline: string
  owner: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  impact: string
  status: 'overdue' | 'at-risk' | 'on-track' | 'done'
  hub: HubId
}

export interface AIAction {
  id: string
  title: string
  description: string
  type: 'opportunity' | 'risk' | 'recommendation' | 'alert'
  impact: 'high' | 'medium' | 'low'
  effort: 'high' | 'medium' | 'low'
  brand?: BrandId
}

export interface Campaign {
  id: string
  name: string
  brand: BrandId
  type: 'awareness' | 'recruitment' | 'employer-branding' | 'lead-gen' | 'retention' | 'seasonal'
  status: 'planning' | 'approved' | 'live' | 'paused' | 'completed' | 'draft'
  startDate: string
  endDate: string
  budget: number
  spent: number
  healthScore: number
  channels: ChannelId[]
  owner: string
  objective: string
  kpis: { label: string; target: string; actual: string; achieved: boolean }[]
  readiness: number
  approvalStatus: 'pending' | 'approved' | 'changes-requested' | 'not-submitted'
}

export type ChannelId =
  | 'linkedin'
  | 'instagram'
  | 'facebook'
  | 'youtube'
  | 'email'
  | 'website'
  | 'display'
  | 'search'
  | 'print'

export interface StrategyPillar {
  id: string
  title: string
  description: string
  priority: number
  brand: BrandId
  budget: number
  budgetUsed: number
  campaigns: number
  status: 'on-track' | 'at-risk' | 'behind'
}

export interface BudgetAllocation {
  brand: BrandId
  total: number
  allocated: number
  spent: number
  remaining: number
}

export interface ContentAsset {
  id: string
  title: string
  type: 'visual' | 'copy' | 'video' | 'deck' | 'template' | 'guide'
  brand: BrandId
  campaign?: string
  channel?: ChannelId
  status: 'draft' | 'review' | 'approved' | 'published'
  createdAt: string
  owner: string
  tags: string[]
}

export interface SalesAsset {
  id: string
  title: string
  type: 'pitch-deck' | 'case-study' | 'brochure' | 'email-template' | 'battle-card' | 'one-pager'
  brand: BrandId
  segment: string
  language: 'fr' | 'nl' | 'en'
  status: 'draft' | 'review' | 'approved'
  downloads: number
  updatedAt: string
}

export interface PerformanceMetric {
  channel: ChannelId
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  cpc: number
  spend: number
  roi: number
}

export interface ApprovalRequest {
  id: string
  title: string
  type: 'campaign' | 'content' | 'budget' | 'strategy'
  brand: BrandId
  submittedBy: string
  submittedAt: string
  deadline: string
  status: 'pending' | 'approved' | 'rejected' | 'changes-requested'
  reviewers: string[]
  priority: 'urgent' | 'normal' | 'low'
}

export interface ComplianceItem {
  id: string
  title: string
  brand: BrandId
  category: 'gdpr' | 'brand-guidelines' | 'legal' | 'content-policy'
  status: 'compliant' | 'review-needed' | 'non-compliant'
  lastChecked: string
  owner: string
}
