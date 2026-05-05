'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockCalls, OPCO_COLORS, type OmniTrackerCall } from '@/lib/data/omnitracker';
import { useTranslation } from '@/lib/i18n/context';
import KpiCard from '@/components/KpiCard';
import OpCoBadge from '@/components/OpCoBadge';
import StateBadge from '@/components/StateBadge';
import { Filter, RotateCcw, Hash } from 'lucide-react';

const OPCOS = ['STP', 'UNQ', 'SSC', 'BPL', 'EMI', 'USP', 'SLV'];
const YEARS = [2022, 2023, 2024, 2025, 2026];
const CATEGORIES = ['Rapportering -> Standard reporting','Rapportering -> Rapportering Adhoc (Niet-standaard)','Rapportering -> Atlas','Rapportering -> Rapportering Kantoor (Greenbook - bug/incident)','Rapportering -> Rapportering Klant (Bluebook - bug/incident)','Rapportering -> Schedule reporting','Rapportering -> TAC sheets','Reporting -> Access Atlas (User Management)'];
const SHORT_CATEGORIES: Record<string, string> = {'Rapportering -> Standard reporting':'Standard','Rapportering -> Rapportering Adhoc (Niet-standaard)':'Ad Hoc','Rapportering -> Atlas':'Atlas','Rapportering -> Rapportering Kantoor (Greenbook - bug/incident)':'Greenbook','Rapportering -> Rapportering Klant (Bluebook - bug/incident)':'Bluebook','Rapportering -> Schedule reporting':'Schedule','Rapportering -> TAC sheets':'TAC','Reporting -> Access Atlas (User Management)':'User Mgmt'};
const CATEGORY_COLORS = ['#0369A1','#0EA5E9','#7C3AED','#F59E0B','#10B981','#EF4444','#6B7280','#0891B2'];
const AFDELINGEN = ['Front Office','Mid Office','Finance','HR','Marketing','Sales/Tenderdesk','Legal','P&B','BPM/OPEX','IT','Projects/Implementatie','Credit & Collection','Safety & preventie','MIC','Audit','Accounting & Tax','L&D/Field Coach','Country/Corporate/Secretary'];

export default function OmniTrackerPage() {
  const { t } = useTranslation();
  const [selectedOpcos, setSelectedOpcos] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAfdeling, setSelectedAfdeling] = useState('');

  function toggleOpco(opco: string) { setSelectedOpcos((prev) => prev.includes(opco) ? prev.filter((o) => o !== opco) : [...prev, opco]); }
  function resetFilters() { setSelectedOpcos([]); setSelectedYear(null); setSelectedCategory(''); setSelectedAfdeling(''); }

  const filtered: OmniTrackerCall[] = useMemo(() => mockCalls.filter((c) => {
    if (selectedOpcos.length > 0 && !selectedOpcos.includes(c.OPCO)) return false;
    if (selectedYear !== null && c.year !== selectedYear) return false;
    if (selectedCategory && c.CategoryPath !== selectedCategory) return false;
    if (selectedAfdeling && c.Afdeling !== selectedAfdeling) return false;
    return true;
  }), [selectedOpcos, selectedYear, selectedCategory, selectedAfdeling]);

  const mainCategory = useMemo(() => { const counts: Record<string, number> = {}; for (const c of filtered) counts[c.CategoryPath] = (counts[c.CategoryPath] || 0) + 1; const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]); return sorted[0] ? SHORT_CATEGORIES[sorted[0][0]] || sorted[0][0] : '—'; }, [filtered]);
  const mostActiveOpco = useMemo(() => { const counts: Record<string, number> = {}; for (const c of filtered) counts[c.OPCO] = (counts[c.OPCO] || 0) + 1; const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]); return sorted[0] ? sorted[0][0] : '—'; }, [filtered]);
  const peakHour = useMemo(() => { const counts: Record<number, number> = {}; for (const c of filtered) counts[c.hour] = (counts[c.hour] || 0) + 1; const sorted = Object.entries(counts).sort((a, b) => Number(b[1]) - Number(a[1])); return sorted[0] ? `${sorted[0][0]}h` : '—'; }, [filtered]);

  const monthNames = ['','Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'];
  const monthlyData = useMemo(() => { const counts: Record<number, number> = {}; for (const c of filtered) counts[c.month] = (counts[c.month] || 0) + 1; return Array.from({ length: 12 }, (_, i) => i + 1).map((m) => ({ month: m, count: counts[m] || 0, label: monthNames[m] })); }, [filtered]);
  const afdelingData = useMemo(() => { const counts: Record<string, number> = {}; for (const c of filtered) counts[c.Afdeling] = (counts[c.Afdeling] || 0) + 1; return Object.entries(counts).map(([afdeling, count]) => ({ afdeling, count })).sort((a, b) => b.count - a.count).slice(0, 10); }, [filtered]);
  const categoryData = useMemo(() => { const counts: Record<string, number> = {}; for (const c of filtered) counts[c.CategoryPath] = (counts[c.CategoryPath] || 0) + 1; return Object.entries(counts).map(([cat, count]) => ({ category: SHORT_CATEGORIES[cat] || cat, count })).sort((a, b) => b.count - a.count); }, [filtered]);
  const recentCalls = filtered.slice(0, 20);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div><h1 className="text-3xl font-black" style={{ color: '#0C4A6E' }}>{t.omnitracker.title}</h1><p className="text-sm mt-1" style={{ color: '#64748B' }}>{filtered.length} calls sélectionnés</p></div>
        <button onClick={resetFilters} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ color: '#EF4444', border: '1px solid #FEE2E2' }}><RotateCcw size={14} />{t.omnitracker.reset}</button>
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5" style={{ border: '1px solid #E0F2FE' }}>
        <div className="flex items-center gap-2 mb-4"><Filter size={16} style={{ color: '#0369A1' }} /><span className="text-sm font-bold" style={{ color: '#0C4A6E' }}>{t.omnitracker.filters}</span></div>
        <div className="flex flex-wrap gap-4">
          <div><p className="text-xs font-semibold mb-2" style={{ color: '#64748B' }}>{t.omnitracker.opco}</p><div className="flex flex-wrap gap-1.5">{OPCOS.map((opco) => <button key={opco} onClick={() => toggleOpco(opco)} className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all" style={selectedOpcos.includes(opco) ? { background: OPCO_COLORS[opco], color: 'white' } : { background: `${OPCO_COLORS[opco]}15`, color: OPCO_COLORS[opco] }}>{opco}</button>)}</div></div>
          <div><p className="text-xs font-semibold mb-2" style={{ color: '#64748B' }}>{t.omnitracker.year}</p><select value={selectedYear ?? ''} onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : null)} className="px-3 py-2 rounded-xl text-sm border outline-none" style={{ borderColor: '#BAE6FD', color: '#0C4A6E', background: 'white' }}><option value="">{t.omnitracker.allYears}</option>{YEARS.map((y) => <option key={y} value={y}>{y}</option>)}</select></div>
          <div><p className="text-xs font-semibold mb-2" style={{ color: '#64748B' }}>{t.omnitracker.category}</p><select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 py-2 rounded-xl text-sm border outline-none" style={{ borderColor: '#BAE6FD', color: '#0C4A6E', background: 'white' }}><option value="">{t.omnitracker.allCategories}</option>{CATEGORIES.map((cat) => <option key={cat} value={cat}>{SHORT_CATEGORIES[cat]}</option>)}</select></div>
          <div><p className="text-xs font-semibold mb-2" style={{ color: '#64748B' }}>{t.omnitracker.afdeling}</p><select value={selectedAfdeling} onChange={(e) => setSelectedAfdeling(e.target.value)} className="px-3 py-2 rounded-xl text-sm border outline-none" style={{ borderColor: '#BAE6FD', color: '#0C4A6E', background: 'white' }}><option value="">{t.omnitracker.allAfdelingen}</option>{AFDELINGEN.map((a) => <option key={a} value={a}>{a}</option>)}</select></div>
        </div>
      </motion.div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title={t.omnitracker.totalCalls} value={filtered.length} icon={<Hash size={20} />} color="#0369A1" delay={0} />
        <div className="bg-white rounded-2xl p-6 flex flex-col gap-2" style={{ border: '1px solid #E0F2FE' }}><p className="text-sm font-semibold" style={{ color: '#64748B' }}>{t.omnitracker.mainCategory}</p><p className="text-xl font-black" style={{ color: '#0C4A6E' }}>{mainCategory}</p></div>
        <div className="bg-white rounded-2xl p-6 flex flex-col gap-2" style={{ border: '1px solid #E0F2FE' }}><p className="text-sm font-semibold" style={{ color: '#64748B' }}>{t.omnitracker.mostActiveOpco}</p><div className="mt-1">{mostActiveOpco !== '—' ? <OpCoBadge opco={mostActiveOpco} showName /> : <span className="text-xl font-black" style={{ color: '#0C4A6E' }}>—</span>}</div></div>
        <div className="bg-white rounded-2xl p-6 flex flex-col gap-2" style={{ border: '1px solid #E0F2FE' }}><p className="text-sm font-semibold" style={{ color: '#64748B' }}>{t.omnitracker.peakHour}</p><p className="text-2xl font-black" style={{ color: '#0C4A6E' }}>{peakHour}</p></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E0F2FE' }}>
          <h2 className="text-base font-bold mb-4" style={{ color: '#0C4A6E' }}>{t.omnitracker.monthlyEvolution}</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="#E0F2FE" /><XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748B' }} /><YAxis tick={{ fontSize: 11, fill: '#64748B' }} /><Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} /><Line type="monotone" dataKey="count" stroke="#0369A1" strokeWidth={2.5} dot={{ fill: '#0369A1', r: 4, strokeWidth: 2, stroke: 'white' }} activeDot={{ r: 6, fill: '#0EA5E9' }} /></LineChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E0F2FE' }}>
          <h2 className="text-base font-bold mb-4" style={{ color: '#0C4A6E' }}>{t.omnitracker.categoryDistribution}</h2>
          <div className="flex gap-4 items-center">
            <ResponsiveContainer width="50%" height={180}><PieChart><Pie data={categoryData} dataKey="count" nameKey="category" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2}>{categoryData.map((_, i) => <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />)}</Pie><Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} /></PieChart></ResponsiveContainer>
            <div className="flex-1 flex flex-col gap-1.5">{categoryData.slice(0, 6).map((cat, idx) => <div key={cat.category} className="flex items-center justify-between text-xs"><div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: CATEGORY_COLORS[idx] }} /><span style={{ color: '#64748B' }}>{cat.category}</span></div><span className="font-bold" style={{ color: '#0C4A6E' }}>{cat.count}</span></div>)}</div>
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E0F2FE' }}>
        <h2 className="text-base font-bold mb-4" style={{ color: '#0C4A6E' }}>{t.omnitracker.byAfdeling}</h2>
        <ResponsiveContainer width="100%" height={250}><BarChart data={afdelingData} layout="vertical" margin={{ left: 120, right: 20 }}><CartesianGrid strokeDasharray="3 3" stroke="#E0F2FE" horizontal={false} /><XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} /><YAxis type="category" dataKey="afdeling" tick={{ fontSize: 11, fill: '#64748B' }} width={120} /><Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} /><Bar dataKey="count" fill="#0369A1" radius={[0, 6, 6, 0]} /></BarChart></ResponsiveContainer>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E0F2FE' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: '#E0F2FE' }}><h2 className="text-base font-bold" style={{ color: '#0C4A6E' }}>{t.omnitracker.recentCalls}</h2></div>
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr style={{ background: '#F8FAFC' }}>{[t.omnitracker.number, t.omnitracker.opco, t.omnitracker.category, t.omnitracker.titleCol, t.omnitracker.date, t.omnitracker.state].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide" style={{ color: '#94A3B8' }}>{h}</th>)}</tr></thead><tbody>{recentCalls.map((call) => <tr key={call.Number} className="border-t hover:bg-blue-50/30" style={{ borderColor: '#F1F5F9' }}><td className="px-4 py-3 font-mono text-xs font-semibold" style={{ color: '#0369A1' }}>{call.Number}</td><td className="px-4 py-3"><OpCoBadge opco={call.OPCO} /></td><td className="px-4 py-3 text-xs max-w-[160px] truncate" style={{ color: '#64748B' }}>{SHORT_CATEGORIES[call.CategoryPath] || call.CategoryPath}</td><td className="px-4 py-3 text-xs max-w-[200px] truncate" style={{ color: '#0C4A6E' }}>{call.Title}</td><td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#64748B' }}>{new Date(call.Created).toLocaleDateString('fr-BE', { day: '2-digit', month: 'short', year: 'numeric' })}</td><td className="px-4 py-3"><StateBadge state={call.State} /></td></tr>)}{recentCalls.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-sm" style={{ color: '#94A3B8' }}>{t.common.noData}</td></tr>}</tbody></table></div>
      </motion.div>
    </div>
  );
}
