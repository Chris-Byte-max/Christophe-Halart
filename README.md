# RGF Marketing Team OS

**AI-powered Marketing Intelligence & Campaign Operating System**

An internal Marketing Operating System for **RGF Staffing Belgium** — managing strategy, campaigns, content, sales enablement, digital execution, compliance and performance across all brands in one platform.

---

## Core Principle

**Simple in surface, powerful in depth.**

5 main hubs. Role-based access. Brand-scoped workspaces. Progressive disclosure.

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/rgf_marketing_os"
```

### 3. Run database migrations (PostgreSQL required)

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Demo (No Database Required)

The app runs fully on **mock data** without a database.  
Just run:

```bash
npm install
npm run dev
```

All hubs, brand switching, role simulation and AI mock responses work out of the box.

---

## Architecture

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Data Model | Prisma ORM |
| Database | PostgreSQL (Azure Database for PostgreSQL in production) |
| Auth | Mock auth (V1) → Microsoft Entra ID / Azure AD SSO (V2) |
| AI | Mock AI service (V1) → Azure OpenAI (V2) |
| Deployment | Azure App Service / Azure Container Apps |

### Project Structure

```
├── app/
│   ├── page.tsx                    # Main app entry
│   ├── campaigns/[id]/page.tsx     # Campaign Workspace route
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx            # Root shell with hub router
│   │   ├── Sidebar.tsx             # 5-hub navigation
│   │   └── TopBar.tsx              # Brand switcher + user menu
│   ├── hubs/
│   │   ├── CommandCenter.tsx       # Hub 1: KPIs, priorities, AI actions
│   │   ├── StrategyHub.tsx         # Hub 2: Plan, portfolio, brands, insights
│   │   ├── CampaignHub.tsx         # Hub 3: Campaigns, factory, readiness
│   │   ├── ContentSalesHub.tsx     # Hub 4: Content, sales assets, channels
│   │   └── PerformanceHub.tsx      # Hub 5: Analytics, approvals, compliance, calendar
│   ├── campaign/
│   │   ├── CampaignWorkspace.tsx   # Full campaign workspace (/campaigns/[id])
│   │   ├── CampaignFactory.tsx     # Guided campaign builder (5-step wizard)
│   │   ├── UTMBuilder.tsx          # UTM parameter generator with AI naming
│   │   └── TrackingQA.tsx          # Tracking QA checklist
│   └── ui/
│       ├── Card.tsx, Badge.tsx, ProgressBar.tsx
│       ├── HubTabs.tsx, HubHeader.tsx
├── lib/
│   ├── types.ts                    # All TypeScript types
│   ├── data.ts                     # Mock data (campaigns, brands, KPIs, etc.)
│   ├── context.tsx                 # App context (brand + role state)
│   ├── ai-service.ts               # Mock AI service (24 functions)
│   └── utils.ts                    # Utility functions
├── prisma/
│   ├── schema.prisma               # Full data model (35+ entities)
│   └── seed.ts                     # Seed script (7 brands, 12 users, all demo data)
```

---

## Multi-Brand Access Model

```
brand_only      → User sees only their assigned brand
multi_brand     → User sees selected set of brands
group_all_brands → User sees all brands, can switch workspace
```

### Demo Users (all available via user switcher in UI)

| User | Role | Access |
|------|------|--------|
| Christophe Halart | Group Marketing Director | All brands |
| Sophie Martens | Brand Marketing Manager | Unique only |
| Thomas Dubois | Campaign Manager | Start People + Solvus |
| Emma Claes | Brand Marketing Manager | Express Medical only |
| Digital Team | Digital Marketeer | 6 brands |
| Legal & Compliance | Compliance Reviewer | All brands |
| Sales User Unique | Sales User | Unique only |
| Leadership Viewer | Leadership Viewer | All brands (read-only) |

---

## 5 Hubs

### Hub 1 — Command Center
- KPI cards (tasks, campaigns, readiness, compliance risk)
- Priority task list with brand scope, deadline, owner, business impact
- AI Next-Best Actions with impact/effort classification
- Live campaign health scores
- Channel mix donut chart
- Monthly performance area chart

### Hub 2 — Strategy Hub
- **Strategic Pillars** — 4 pillars with budget progress
- **Budget Overview** — by brand, visual distribution
- **Annual Plan** — quarterly roadmap table
- **Portfolio View** — Quick Win / Strategic Bet / Fill-in / Low Value matrix
- **Candidate Marketing** — persona-based recruitment campaigns
- **Market Insights** — intelligence cards with "Convert to campaign/content" CTAs
- **Brand Strategy** — brand-by-brand readiness cards
- **Executive Summary** — exportable leadership summary with decisions required

### Hub 3 — Campaign Hub
- **All Campaigns** — table + card view with health rings
- **Live / Planning** — filtered views
- **Campaign Factory** — 5-step guided campaign builder with AI brief generation
- **Readiness Tracker** — sorted by readiness score + launch checklist
- **Awaiting Approval** — one-click approve/review

### Hub 4 — Content & Sales Hub
- **Content Library** — filterable by type, brand, channel, status
- **Sales Asset Library** — by brand, segment, language, with downloads tracking
- **Brand Assets** — brand kit cards with color, logo, typography
- **Channel Guide** — LinkedIn, Instagram, Facebook, YouTube, Email, Website specs

### Hub 5 — Performance & Operations Hub
- **Analytics Dashboard** — line/bar charts, funnel visualization, top channels
- **Channel Performance** — detailed metric cards per channel with ROI
- **Approvals** — request cards with SLA tracking and audit trail
- **Compliance** — GDPR, brand guidelines, legal status with audit schedule
- **Capacity** — team workload bars, bottleneck detection, approval SLA
- **Calendar** — May 2026 monthly view with campaign milestones
- **Reports** — downloadable reports library

### Campaign Workspace (/campaigns/[id])
- Health score ring
- Full brief, KPIs, budget progress
- Digital Setup: UTM Builder + Tracking QA
- Launch Checklist (16 critical items, override with authorization)
- Asset library
- AI Next Actions (on-demand generation)
- Approval status per reviewer

---

## AI Service (lib/ai-service.ts)

The AI service works with **mock responses** in V1 (no API key needed).  
All functions are structured JSON outputs with `requiresApproval: true` by default.

**AI-generated content cannot be published without human approval.**

24 functions including:
- `generateCampaignBrief()` — full campaign brief from inputs
- `generateContent()` — channel-specific content generation
- `scoreBrandFit()` — content vs. brand guidelines scoring
- `checkComplianceRisk()` — risk level detection
- `generateUTMParameters()` — consistent UTM naming
- `analyzeFunnelPerformance()` — drop-off identification
- `calculateCampaignHealthScore()` — weighted health score
- `generateExecutiveSummary()` — leadership-ready summary
- `translateAndLocalize()` — FR/NL/EN with Belgian conventions
- ...and 15 more

In V2, replace mock implementations with `azure-openai` SDK calls.

---

## Data Model (prisma/schema.prisma)

35+ entities covering:

**Organization & Access**: Organization, Brand, User, UserBrandAccess, Workspace  
**Strategy**: MarketingPlan, QuarterlyPriority, MarketInsight, CompetitorInsight  
**Campaigns**: Campaign, CampaignBrief, CampaignWorkspace, CampaignDigitalSetup, CampaignLaunchChecklist, LandingPageBrief, ABTest, ABTestVariant, CampaignRetrospective  
**Content**: ContentAsset, ContentVersion, ContentComment  
**Sales**: SalesAsset, SalesAssetUsage  
**Approvals & Compliance**: Approval, ApprovalAuditEntry, ApprovalMatrixEntry, ComplianceCheck  
**Candidate Marketing**: CandidatePersona, CandidateCampaign, RecruitmentMarketingWorkflow  
**Performance**: PerformanceMetric, FunnelMetric, ChannelPerformance, CampaignHealthScore  
**Operations**: Task, CalendarItem  
**AI**: AIAgent, AITask, AIOutputLog, Recommendation  

---

## Deployment

### Azure (target)

```
Azure App Service or Azure Container Apps
Azure Database for PostgreSQL (Flexible Server)
Azure Key Vault (secrets)
Application Insights (monitoring)
```

### Environment Variables

```env
DATABASE_URL=               # PostgreSQL connection string
AZURE_OPENAI_ENDPOINT=      # For V2 AI integration
AZURE_OPENAI_KEY=           # For V2 AI integration
NEXTAUTH_SECRET=            # For auth
AZURE_AD_CLIENT_ID=         # For Microsoft Entra SSO (V2)
AZURE_AD_CLIENT_SECRET=     # For Microsoft Entra SSO (V2)
AZURE_AD_TENANT_ID=         # For Microsoft Entra SSO (V2)
```

---

## Roadmap

### V1 — Current (MVP)
- 5-hub navigation with brand workspace scoping
- Role-based mock authentication
- Command Center with AI next-best actions
- Strategy Hub with pillars, budget, portfolio, insights, executive summary
- Campaign Hub with factory, readiness tracker, approval workflow
- Content & Sales Hub with library, brand assets, channel guide
- Performance Hub with analytics, compliance, capacity, calendar
- Campaign Workspace with UTM builder, tracking QA, launch checklist
- Mock AI service (24 functions)
- Prisma schema (35+ entities)
- Seed data (7 brands, 12 users)

### V1.5 — Digital Optimization Layer
- Landing Page Brief Generator (full form)
- A/B Testing management UI
- Full funnel analytics view
- Social Distribution Plan with per-channel scheduler
- Email Campaign Builder with sequence management
- SEO briefing module
- Campaign Retrospective UI
- Capacity planning with resource suggestions

### V2 — Integrations & Automation
- Microsoft Entra ID / Azure AD SSO
- Azure OpenAI integration (replace mock AI)
- Microsoft 365 (SharePoint, Teams, Outlook drafts)
- Google Analytics 4 connector
- LinkedIn Campaign Manager integration
- Meta Ads integration
- Power BI embedded reporting
- Bullhorn/CRM connector
- Automated reporting (never auto-publishing)

---

## Security & Governance

- No automatic publishing in V1 — all content requires human approval
- No automatic email sending — all communications manual
- Strict brand scope enforcement — users cannot access other brands
- All AI outputs logged with `AIOutputLog`
- All approvals tracked with audit trail (`ApprovalAuditEntry`)
- High-risk content blocked until authorized reviewer approves
- All content versioned (`ContentVersion`)
- GDPR by design — no sensitive personal data in mock/seed data
- Compliance guardrail on all content generation

---

*RGF Marketing Team OS — Built for RGF Staffing Belgium · April 2026*
