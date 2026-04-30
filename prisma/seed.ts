/**
 * RGF Marketing OS — Prisma Seed Script
 *
 * Creates all demo data: 7 brands, 12 users, campaigns, content, sales assets,
 * approvals, compliance items, performance metrics and AI recommendations.
 *
 * Run with: npx prisma db seed
 * Or: ts-node prisma/seed.ts
 *
 * Requires DATABASE_URL in .env
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding RGF Marketing OS database...')

  // ─── ORGANIZATION ────────────────────────────────────────────────────────
  const org = await prisma.organization.upsert({
    where: { slug: 'rgf-staffing-belgium' },
    update: {},
    create: {
      name: 'RGF Staffing Belgium',
      slug: 'rgf-staffing-belgium',
      country: 'BE',
    },
  })
  console.log('✅ Organization created:', org.name)

  // ─── BRANDS ──────────────────────────────────────────────────────────────
  const brandData = [
    { name: 'RGF Staffing Belgium', slug: 'group', shortName: 'Group', color: '#1e293b', accentColor: '#7c3aed', bgColor: '#f5f3ff', description: 'Group-level overview across all brands', positioning: 'Market leader in Belgian staffing', toneOfVoice: 'Professional, authoritative, inclusive', keyMessages: ['Belgium\'s leading staffing group', 'Connecting talent with opportunity'], brandMaturityScore: 90 },
    { name: 'Start People', slug: 'start-people', shortName: 'Start People', color: '#0ea5e9', accentColor: '#0284c7', bgColor: '#f0f9ff', description: 'Temporary staffing & flex workforce', positioning: 'The flex work specialist for Belgium', toneOfVoice: 'Energetic, accessible, direct, human', keyMessages: ['Your flex partner for life', 'Work your way'], brandMaturityScore: 85 },
    { name: 'Unique', slug: 'unique', shortName: 'Unique', color: '#f59e0b', accentColor: '#d97706', bgColor: '#fffbeb', description: 'Office & professional staffing', positioning: 'Premium office staffing with a personal touch', toneOfVoice: 'Warm, professional, personal, encouraging', keyMessages: ['Your career, your way', 'Find your unique opportunity'], brandMaturityScore: 88 },
    { name: 'Express Medical', slug: 'express-medical', shortName: 'Exp. Medical', color: '#10b981', accentColor: '#059669', bgColor: '#f0fdf4', description: 'Healthcare & medical staffing', positioning: 'The trusted partner for healthcare staffing in Belgium', toneOfVoice: 'Caring, professional, reassuring, expert', keyMessages: ['Caring for those who care', 'Healthcare staffing with heart'], brandMaturityScore: 82 },
    { name: 'Solvus', slug: 'solvus', shortName: 'Solvus', color: '#6366f1', accentColor: '#4f46e5', bgColor: '#eef2ff', description: 'HR services & workforce solutions', positioning: 'End-to-end HR solutions for forward-thinking organizations', toneOfVoice: 'Consultative, strategic, data-driven, expert', keyMessages: ['HR made simple', 'Your workforce, optimized'], brandMaturityScore: 79 },
    { name: 'Bright Plus', slug: 'bright-plus', shortName: 'Bright Plus', color: '#ec4899', accentColor: '#db2777', bgColor: '#fdf2f8', description: 'Executive & specialist recruitment', positioning: 'Belgium\'s executive and specialist recruitment boutique', toneOfVoice: 'Sophisticated, confident, exclusive, precise', keyMessages: ['Executive search, reimagined', 'Where ambition meets opportunity'], brandMaturityScore: 91 },
    { name: 'USG Professionals', slug: 'usg-professionals', shortName: 'USG Pro', color: '#f97316', accentColor: '#ea580c', bgColor: '#fff7ed', description: 'IT, engineering & finance professionals', positioning: 'The specialist partner for IT, engineering and finance talent', toneOfVoice: 'Technical, expert, results-focused, peer-to-peer', keyMessages: ['Professionals connecting professionals', 'Tech talent, delivered'], brandMaturityScore: 84 },
  ]

  const brands: Record<string, string> = {}
  for (const bd of brandData) {
    const brand = await prisma.brand.upsert({
      where: { organizationId_slug: { organizationId: org.id, slug: bd.slug } },
      update: {},
      create: {
        organizationId: org.id,
        ...bd,
        approvedVocabulary: ['connect', 'partner', 'talent', 'opportunity', 'expert', 'trusted'],
        forbiddenWording: ['cheapest', 'guaranteed salary', 'always succeed', 'best in the world'],
        serviceOfferings: [],
        preferredCTAs: ['Apply now', 'Discover opportunities', 'Talk to an expert', 'Get matched'],
      },
    })
    brands[bd.slug] = brand.id
    console.log('✅ Brand:', brand.name)
  }

  // ─── USERS ────────────────────────────────────────────────────────────────
  const usersData = [
    { email: 'christophe.halart@rgf.be', name: 'Christophe Halart', initials: 'CH', role: 'GROUP_MARKETING_DIRECTOR' as const, accessScope: 'group_all_brands' as const, primaryBrandSlug: 'group', allowedBrands: Object.keys(brands) },
    { email: 'sophie.martens@unique.be', name: 'Sophie Martens', initials: 'SM', role: 'BRAND_MARKETING_MANAGER' as const, accessScope: 'brand_only' as const, primaryBrandSlug: 'unique', allowedBrands: ['unique'] },
    { email: 'thomas.dubois@start-people.be', name: 'Thomas Dubois', initials: 'TD', role: 'CAMPAIGN_MANAGER' as const, accessScope: 'multi_brand' as const, primaryBrandSlug: 'start-people', allowedBrands: ['start-people', 'solvus'] },
    { email: 'emma.claes@express-medical.be', name: 'Emma Claes', initials: 'EC', role: 'BRAND_MARKETING_MANAGER' as const, accessScope: 'brand_only' as const, primaryBrandSlug: 'express-medical', allowedBrands: ['express-medical'] },
    { email: 'luc.peeters@solvus.be', name: 'Luc Peeters', initials: 'LP', role: 'MARKETING_MANAGER' as const, accessScope: 'brand_only' as const, primaryBrandSlug: 'solvus', allowedBrands: ['solvus'] },
    { email: 'marie.durant@bright-plus.be', name: 'Marie Durant', initials: 'MD', role: 'BRAND_MARKETING_MANAGER' as const, accessScope: 'brand_only' as const, primaryBrandSlug: 'bright-plus', allowedBrands: ['bright-plus'] },
    { email: 'jan.vermeersch@usg.be', name: 'Jan Vermeersch', initials: 'JV', role: 'MARKETING_MANAGER' as const, accessScope: 'brand_only' as const, primaryBrandSlug: 'usg-professionals', allowedBrands: ['usg-professionals'] },
    { email: 'digital@rgf.be', name: 'Digital Team RGF', initials: 'DT', role: 'DIGITAL_MARKETEER' as const, accessScope: 'multi_brand' as const, primaryBrandSlug: 'group', allowedBrands: ['start-people', 'unique', 'express-medical', 'solvus', 'bright-plus', 'usg-professionals'] },
    { email: 'content@rgf.be', name: 'Content Team RGF', initials: 'CT', role: 'CONTENT_MANAGER' as const, accessScope: 'multi_brand' as const, primaryBrandSlug: 'group', allowedBrands: ['start-people', 'unique', 'express-medical'] },
    { email: 'compliance@rgf.be', name: 'Legal & Compliance', initials: 'LC', role: 'COMPLIANCE_REVIEWER' as const, accessScope: 'group_all_brands' as const, primaryBrandSlug: 'group', allowedBrands: Object.keys(brands) },
    { email: 'sales@unique.be', name: 'Sales User Unique', initials: 'SU', role: 'SALES_USER' as const, accessScope: 'brand_only' as const, primaryBrandSlug: 'unique', allowedBrands: ['unique'] },
    { email: 'ceo@rgf.be', name: 'Leadership Viewer', initials: 'LV', role: 'LEADERSHIP_VIEWER' as const, accessScope: 'group_all_brands' as const, primaryBrandSlug: 'group', allowedBrands: Object.keys(brands) },
  ]

  for (const ud of usersData) {
    const { allowedBrands, primaryBrandSlug, ...userData } = ud
    const user = await prisma.user.upsert({
      where: { email: ud.email },
      update: {},
      create: {
        organizationId: org.id,
        ...userData,
        primaryBrandId: brands[primaryBrandSlug],
      },
    })

    // Create brand access entries
    for (const brandSlug of allowedBrands) {
      if (brands[brandSlug]) {
        await prisma.userBrandAccess.upsert({
          where: { userId_brandId: { userId: user.id, brandId: brands[brandSlug] } },
          update: {},
          create: { userId: user.id, brandId: brands[brandSlug] },
        })
      }
    }
    console.log('✅ User:', user.name, `(${user.role})`)
  }

  // ─── MARKETING PLANS ─────────────────────────────────────────────────────
  const director = await prisma.user.findFirst({ where: { role: 'GROUP_MARKETING_DIRECTOR' } })
  if (!director) throw new Error('Director not found')

  const plan = await prisma.marketingPlan.create({
    data: {
      organizationId: org.id,
      year: 2026,
      title: 'RGF Belgium Marketing Plan 2026',
      description: 'Group-level marketing strategy across all brands for 2026',
      status: 'ACTIVE',
      totalBudget: 690000,
      allocatedBudget: 627000,
      spentBudget: 196000,
      visibilityScope: 'group',
      createdBy: director.id,
      ownerId: director.id,
    },
  })
  console.log('✅ Marketing Plan created')

  // Quarterly priorities
  for (const q of [1, 2, 3, 4]) {
    await prisma.quarterlyPriority.create({
      data: {
        marketingPlanId: plan.id,
        quarter: q,
        year: 2026,
        title: q === 1 ? 'Employer Brand Launch' : q === 2 ? 'Digital Candidate Acquisition' : q === 3 ? 'Executive Campaign' : 'Year-End Performance Review',
        description: `Q${q} 2026 priority`,
        status: q <= 2 ? 'IN_PROGRESS' : 'PLANNED',
        impact: 'HIGH',
        effort: q === 1 ? 'HIGH' : 'MEDIUM',
        budget: 170000,
      },
    })
  }

  // ─── CAMPAIGNS ───────────────────────────────────────────────────────────
  const campaignsData = [
    { brandSlug: 'unique', name: 'Spring Office Revival', slug: 'spring-office-revival', type: 'RECRUITMENT' as const, status: 'APPROVED' as const, objective: 'Drive 200 qualified office profile applications in Q2', budget: 45000, spent: 0, healthScore: 82, readiness: 91, startDate: new Date('2026-05-05'), endDate: new Date('2026-06-15') },
    { brandSlug: 'start-people', name: 'Flex Work Month', slug: 'flex-work-month', type: 'AWARENESS' as const, status: 'LIVE' as const, objective: 'Increase flex worker registrations by 25% in April', budget: 32000, spent: 28400, healthScore: 74, readiness: 100, startDate: new Date('2026-04-01'), endDate: new Date('2026-04-30') },
    { brandSlug: 'express-medical', name: 'Healthcare Heroes', slug: 'healthcare-heroes', type: 'CANDIDATE_ATTRACTION' as const, status: 'LIVE' as const, objective: 'Source 150 healthcare professionals for Q2 pipeline', budget: 28000, spent: 14200, healthScore: 61, readiness: 100, startDate: new Date('2026-03-15'), endDate: new Date('2026-05-31') },
    { brandSlug: 'bright-plus', name: 'Executive Search 2026', slug: 'executive-search-2026', type: 'EMPLOYER_BRANDING' as const, status: 'PLANNING' as const, objective: 'Position Bright Plus as #1 executive search brand in Belgium', budget: 55000, spent: 0, healthScore: 45, readiness: 38, startDate: new Date('2026-06-01'), endDate: new Date('2026-08-31') },
    { brandSlug: 'usg-professionals', name: 'IT Talent Pipeline', slug: 'it-talent-pipeline', type: 'CANDIDATE_ATTRACTION' as const, status: 'PLANNING' as const, objective: 'Build IT candidate pipeline with 300 qualified profiles', budget: 38000, spent: 0, healthScore: 55, readiness: 62, startDate: new Date('2026-05-20'), endDate: new Date('2026-07-31') },
    { brandSlug: 'solvus', name: 'HR Solutions Spring', slug: 'hr-solutions-spring', type: 'LEAD_GEN' as const, status: 'LIVE' as const, objective: 'Generate 40 qualified HR outsourcing leads for Sales', budget: 22000, spent: 9800, healthScore: 88, readiness: 100, startDate: new Date('2026-04-10'), endDate: new Date('2026-05-31') },
  ]

  for (const cd of campaignsData) {
    const { brandSlug, ...data } = cd
    await prisma.campaign.create({
      data: {
        organizationId: org.id,
        brandId: brands[brandSlug],
        ...data,
        language: 'fr',
        visibilityScope: 'brand',
        ownerId: director.id,
        createdBy: director.id,
      },
    })
  }
  console.log('✅ Campaigns created:', campaignsData.length)

  // ─── RECOMMENDATIONS (AI) ────────────────────────────────────────────────
  await prisma.recommendation.createMany({
    data: [
      { organizationId: org.id, type: 'RECOMMENDATION', title: 'Boost Unique campaign with LinkedIn retargeting', description: 'CTR on Unique Spring campaign is 18% below benchmark. Add LinkedIn retargeting audience (website visitors, 30-day window).', impact: 'HIGH', effort: 'LOW' },
      { organizationId: org.id, type: 'ALERT', title: 'Candidate shortage alert — healthcare profiles', description: 'Express Medical job applications dropped 31% vs. last month. Activate candidate re-engagement email sequence.', impact: 'HIGH', effort: 'MEDIUM' },
      { organizationId: org.id, type: 'OPPORTUNITY', title: 'Repurpose top-performing Start People content', description: 'Your "Working Flex" reel has 3.2x average engagement. Adapt to Facebook and LinkedIn for organic amplification.', impact: 'MEDIUM', effort: 'LOW' },
      { organizationId: org.id, type: 'RISK', title: 'Brand consistency risk — Solvus digital assets', description: 'Automated brand scan detected 4 Solvus assets using outdated logo. Update before next campaign activation.', impact: 'MEDIUM', effort: 'LOW' },
    ],
  })
  console.log('✅ AI Recommendations created')

  // ─── COMPLIANCE CHECKS ───────────────────────────────────────────────────
  await prisma.complianceCheck.createMany({
    data: [
      { organizationId: org.id, brandId: brands['group'], title: 'Email consent database audit', category: 'GDPR', status: 'REVIEW_NEEDED', riskLevel: 'HIGH', checkedBy: director.id },
      { organizationId: org.id, brandId: brands['solvus'], title: 'Solvus logo usage on partner sites', category: 'BRAND_GUIDELINES', status: 'NON_COMPLIANT', riskLevel: 'MEDIUM' },
      { organizationId: org.id, brandId: brands['group'], title: 'GDPR cookie banner — all brand sites', category: 'GDPR', status: 'COMPLIANT', riskLevel: 'LOW' },
      { organizationId: org.id, brandId: brands['express-medical'], title: 'Healthcare advertising claims', category: 'HEALTHCARE_CLAIMS', status: 'REVIEW_NEEDED', riskLevel: 'HIGH' },
    ],
  })
  console.log('✅ Compliance checks created')

  // ─── CALENDAR ITEMS ──────────────────────────────────────────────────────
  await prisma.calendarItem.createMany({
    data: [
      { organizationId: org.id, brandId: brands['unique'], title: 'Unique Spring Campaign LIVE', type: 'CAMPAIGN_LAUNCH', date: new Date('2026-05-05') },
      { organizationId: org.id, brandId: brands['bright-plus'], title: 'Bright Plus Campaign Approval Deadline', type: 'APPROVAL_DEADLINE', date: new Date('2026-05-03') },
      { organizationId: org.id, title: 'Brussels Recruitment Fair 2026', type: 'EVENT', date: new Date('2026-05-14') },
      { organizationId: org.id, title: 'GDPR Consent Audit Deadline', type: 'APPROVAL_DEADLINE', date: new Date('2026-05-15') },
      { organizationId: org.id, brandId: brands['usg-professionals'], title: 'USG IT Campaign LIVE', type: 'CAMPAIGN_LAUNCH', date: new Date('2026-05-20') },
    ],
  })
  console.log('✅ Calendar items created')

  console.log('\n🎉 Database seeded successfully!')
  console.log('\nDemo users:')
  for (const ud of usersData) {
    console.log(`  ${ud.email} — ${ud.role} (${ud.accessScope})`)
  }
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
