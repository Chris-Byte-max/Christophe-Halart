'use client';

import { useMemo } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockCalls, OPCO_COLORS, OPCO_NAMES } from '@/lib/data/omnitracker';
import { useTranslation } from '@/lib/i18n/context';
import KpiCard from '@/components/KpiCard';
import StateBadge from '@/components/StateBadge';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

const SHORT_CATEGORIES: Record<string, string> = {'Rapportering -> Standard reporting':'Standard','Rapportering -> Rapportering Adhoc (Niet-standaard)':'Ad Hoc','Rapportering -> Atlas':'Atlas','Rapportering -> Rapportering Kantoor (Greenbook - bug/incident)':'Greenbook','Rapportering -> Rapportering Klant (Bluebook - bug/incident)':'Bluebook','Rapportering -> Schedule reporting':'Schedule','Rapportering -> TAC sheets':'TAC','Reporting -> Access Atlas (User Management)':'User Mgmt'};
const CATEGORY_COLORS = ['#0369A1','#0EA5E9','#7C3AED','#F59E0B','#10B981','#EF4444','#6B7280','#0891B2'];
const VALID_OPCOS = ['STP','UNQ','SSC','BPL','EMI','USP','SLV'];

export default function BrandPage({ params }: { params: Promise<{ opco: string }> }) {
  const { t } = useTranslation();
  const { opco } = use(params);
  const opcoUpper = opco.toUpperCase();
  if (!VALID_OPCOS.includes(opcoUpper)) notFound();

  const color = OPCO_COLORS[opcoUpper] || '#0369A1';
  const brandName = OPCO_NAMES[opcoUpper] || opcoUpper;
  const brandCalls = useMemo(() => mockCalls.filter((c) => c.OPCO === opcoUpper), [opcoUpper]);
  const openCalls = brandCalls.filter((c) => ['Open','Wachten op feedback','In behandeling'].includes(c.State)).length;
  const closedCalls = brandCalls.filter((c) => ['Gesloten','Opgelost'].includes(c.State)).length;
  const avgPerMonth = Math.round(brandCalls.length / 12);

  const monthlyData = useMemo(() => {
    const monthNames = ['','Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'];
    const counts: Record<number, number> = {};
    for (const c of brandCalls.filter((c) => c.year === 2026)) counts[c.month] = (counts[c.month] || 0) + 1;
    return Array.from({ length: 12 }, (_, i) => i + 1).map((m) => ({ month: m, count: counts[m] || 0, label: monthNames[m] }));
  }, [brandCalls]);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of brandCalls) counts[c.CategoryPath] = (counts[c.CategoryPath] || 0) + 1;
    return Object.entries(counts).map(([cat, count]) => ({ category: SHORT_CATEGORIES[cat] || cat, count })).sort((a, b) => b.count - a.count);
  }, [brandCalls]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/dashboard/brands"><button className="flex items-center gap-2 text-sm font-semibold mb-4" style={{ color: '#64748B' }}><ArrowLeft size={16} />{t.brands.back}</button></Link>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: color }}><span className="text-white font-black text-base">{opcoUpper}</span></div>
          <div>
            <h1 className="text-3xl font-black" style={{ color: '#0C4A6E' }}>{brandName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm px-3 py-1 rounded-full font-semibold" style={{ background: `${color}15`, color }}>{opcoUpper}</span>
              <span className="text-sm" style={{ color: '#64748B' }}>· RGF Staffing Belgium</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title={t.brands.totalCalls} value={brandCalls.length} color={color} delay={0} />
        <KpiCard title={t.brands.openCalls} value={openCalls} color="#F59E0B" delay={100} />
        <KpiCard title={t.brands.closedCalls} value={closedCalls} color="#10B981" delay={200} />
        <KpiCard title={t.brands.avgPerMonth} value={avgPerMonth} suffix="/mois" color={color} delay={300} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E0F2FE' }}>
          <h2 className="text-base font-bold mb-4" style={{ color: '#0C4A6E' }}>{t.brands.monthlyTrend} (2026)</h2>
          <ResponsiveContainer width="100%" height={200}><LineChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="#E0F2FE" /><XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748B' }} /><YAxis tick={{ fontSize: 11, fill: '#64748B' }} /><Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} /><Line type="monotone" dataKey="count" stroke={color} strokeWidth={2.5} dot={{ fill: color, r: 4, strokeWidth: 2, stroke: 'white' }} activeDot={{ r: 6 }} /></LineChart></ResponsiveContainer>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E0F2FE' }}>
          <h2 className="text-base font-bold mb-4" style={{ color: '#0C4A6E' }}>{t.brands.categoryBreakdown}</h2>
          <div className="flex gap-4 items-center">
            <ResponsiveContainer width="50%" height={170}><PieChart><Pie data={categoryData} dataKey="count" nameKey="category" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2}>{categoryData.map((_, i) => <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />)}</Pie><Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} /></PieChart></ResponsiveContainer>
            <div className="flex-1 flex flex-col gap-1.5">{categoryData.slice(0, 6).map((cat, idx) => <div key={cat.category} className="flex items-center justify-between text-xs"><div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: CATEGORY_COLORS[idx] }} /><span className="truncate" style={{ color: '#64748B' }}>{cat.category}</span></div><span className="font-bold ml-2" style={{ color: '#0C4A6E' }}>{cat.count}</span></div>)}</div>
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E0F2FE' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: '#E0F2FE' }}><h2 className="text-base font-bold" style={{ color: '#0C4A6E' }}>{t.brands.recentActivity}</h2></div>
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr style={{ background: '#F8FAFC' }}>{['Numéro','Catégorie','Titre','Département','Date','Statut'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide" style={{ color: '#94A3B8' }}>{h}</th>)}</tr></thead><tbody>{brandCalls.slice(0, 10).map((call) => <tr key={call.Number} className="border-t hover:bg-blue-50/30" style={{ borderColor: '#F1F5F9' }}><td className="px-4 py-3 font-mono text-xs font-semibold" style={{ color }}>{call.Number}</td><td className="px-4 py-3 text-xs truncate max-w-[130px]" style={{ color: '#64748B' }}>{SHORT_CATEGORIES[call.CategoryPath] || call.CategoryPath}</td><td className="px-4 py-3 text-xs truncate max-w-[200px]" style={{ color: '#0C4A6E' }}>{call.Title}</td><td className="px-4 py-3 text-xs" style={{ color: '#64748B' }}>{call.Afdeling}</td><td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#64748B' }}>{new Date(call.Created).toLocaleDateString('fr-BE', { day: '2-digit', month: 'short', year: 'numeric' })}</td><td className="px-4 py-3"><StateBadge state={call.State} /></td></tr>)}</tbody></table></div>
      </motion.div>
    </div>
  );
}
