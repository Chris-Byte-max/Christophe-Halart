# TODO — RGF Marketing Team OS

## Completed ✅

- [x] Next.js 14 project setup (TypeScript, Tailwind, App Router)
- [x] App context with brand/role switching (lib/context.tsx)
- [x] Full mock data layer (lib/data.ts) — 7 brands, campaigns, KPIs, assets
- [x] TypeScript types (lib/types.ts)
- [x] Utility functions (lib/utils.ts)
- [x] Core layout: AppShell, Sidebar (5-hub nav), TopBar (brand switcher + user menu)
- [x] Shared UI components: Card, Badge, ProgressBar, HubTabs, HubHeader
- [x] Hub 1 — Command Center (KPIs, priority tasks, AI actions, health scores, channel mix, performance chart)
- [x] Hub 2 — Strategy Hub (pillars, budget, annual plan, portfolio, candidate marketing, market insights, brand strategy, executive summary)
- [x] Hub 3 — Campaign Hub (all campaigns, factory, readiness, approvals)
- [x] Hub 4 — Content & Sales Hub (library, sales assets, brand assets, channel guide)
- [x] Hub 5 — Performance Hub (analytics, channel, approvals, compliance, capacity, calendar, reports)
- [x] Campaign Workspace route /campaigns/[id] with full workspace UI
- [x] Campaign Factory — 5-step guided builder with AI brief generation
- [x] UTM Builder with AI naming suggestions and URL generator
- [x] Tracking QA checklist with auto-check simulation
- [x] Prisma schema — 35+ entities (full data model)
- [x] Mock AI service — 24 functions (lib/ai-service.ts)
- [x] Seed script — 7 brands, 12 users, campaigns, approvals, compliance items
- [x] README with setup, architecture, roadmap V1.5/V2
- [x] Build passing (npx next build ✅)

## Pending — V1.5 Enhancements

- [ ] Landing Page Brief Generator (full interactive form)
- [ ] A/B Testing management UI (variant comparison, winner tracking)
- [ ] Content Editor with FR/NL/EN tabs, version history, AI variants
- [ ] Social Distribution Plan with per-channel scheduler
- [ ] Email Campaign Builder with sequence management
- [ ] Funnel analytics deep-dive (step-by-step drop-off)
- [ ] Candidate Persona editor
- [ ] Recruitment Marketing Workflow builder
- [ ] Capacity planning with AI resource suggestions
- [ ] Campaign Retrospective UI

## Pending — V2 Integrations

- [ ] Microsoft Entra ID SSO (replace mock auth)
- [ ] Azure OpenAI integration (replace mock AI service)
- [ ] Microsoft 365 connector (SharePoint, Teams, Outlook)
- [ ] Google Analytics 4 live data
- [ ] LinkedIn Campaign Manager integration
- [ ] Meta Ads integration
- [ ] Power BI embedded reports
- [ ] Automated reporting pipeline (no auto-publishing)
