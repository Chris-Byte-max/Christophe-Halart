'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getCallsByYearAndOpco, getCallsByCategory, getCallsByOpco, mockCalls, OPCO_COLORS, OPCO_NAMES } from '@/lib/data/omnitracker';
import { useTranslation } from '@/lib/i18n/context';
import KpiCard from '@/components/KpiCard';
import { BarChart2, Calendar, Clock, Building } from 'lucide-react';

const OPCOS = ['STP', 'UNQ', 'SSC', 'BPL', 'EMI', 'USP', 'SLV'] as const;
const CATEGORY_COLORS = ['#0369A1', '#0EA5E9', '#7C3AED', '#F59E0B', '#10B981', '#EF4444', '#6B7280', '#0891B2'];

export default function DashboardPage() {
  const { t } = useTranslation();
  const yearlyData = useMemo(() => getCallsByYearAndOpco(), []);
  const categoryData2026 = useMemo(() => getCallsByCategory(2026), []);
  const opcoData2026 = useMemo(() => getCallsByOpco(2026), []);
  const calls2026 = useMemo(() => mockCalls.filter((c) => c.year === 2026), []);
  const callsThisMonth = useMemo(() => calls2026.filter((c) => c.month === 4).length, [calls2026]);
  const pendingCalls = useMemo(() => mockCalls.filter((c) => ['Open', 'Wachten op feedback', 'In behandeling'].includes(c.State)).length, []);
  const activeBrands = opcoData2026.filter((o) => o.count > 0).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black" style={{ color: '#0C4A6E' }}>{t.dashboard.title}</h1>
        <p className="text-sm mt-1" style={{ color: '#64748B' }}>Portail BA-BI Analytics · RGF Staffing · 2026</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title={t.dashboard.totalCalls} value={calls2026.length} icon={<BarChart2 size={20} />} color="#0369A1" delay={0} />
        <KpiCard title={t.dashboard.callsThisMonth} value={callsThisMonth} icon={<Calendar size={20} />} color="#0EA5E9" delay={100} />
        <KpiCard title={t.dashboard.pendingCalls} value={pendingCalls} icon={<Clock size={20} />} color="#F59E0B" delay={200} />
        <KpiCard title={t.dashboard.activeBrands} value={activeBrands} icon={<Building size={20} />} color="#22C55E" delay={300} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="lg:col-span-2 bg-white rounded-2xl p-6" style={{ border: '1px solid #E0F2FE', boxShadow: '0 2px 8px rgba(3,105,161,0.06)' }}>
          <h2 className="text-base font-bold mb-4" style={{ color: '#0C4A6E' }}>{t.dashboard.evolutionTitle}</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0F2FE" />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E0F2FE', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {OPCOS.map((opco) => <Bar key={opco} dataKey={opco} stackId="a" fill={OPCO_COLORS[opco]} />)}
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E0F2FE', boxShadow: '0 2px 8px rgba(3,105,161,0.06)' }}>
          <h2 className="text-base font-bold mb-4" style={{ color: '#0C4A6E' }}>{t.dashboard.categoryTitle}</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categoryData2026} dataKey="count" nameKey="shortName" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {categoryData2026.map((_, index) => <Cell key={index} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E0F2FE', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1.5 mt-2">
            {categoryData2026.slice(0, 5).map((cat, idx) => (
              <div key={cat.shortName} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full shrink-0" style={{ background: CATEGORY_COLORS[idx] }} /><span style={{ color: '#64748B' }}>{cat.shortName}</span></div>
                <span className="font-semibold" style={{ color: '#0C4A6E' }}>{cat.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <div>
        <h2 className="text-base font-bold mb-4" style={{ color: '#0C4A6E' }}>{t.dashboard.brandsTitle}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {opcoData2026.map((item, idx) => (
            <motion.div key={item.opco} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.4 + idx * 0.05 }} whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
              <Link href={`/dashboard/brands/${item.opco}`}>
                <div className="bg-white rounded-2xl p-4 flex flex-col gap-2 cursor-pointer" style={{ border: `2px solid ${OPCO_COLORS[item.opco]}25` }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: OPCO_COLORS[item.opco] }}>
                    <span className="text-white text-xs font-black">{item.opco}</span>
                  </div>
                  <p className="text-xs font-semibold truncate" style={{ color: '#64748B' }}>{OPCO_NAMES[item.opco]}</p>
                  <p className="text-2xl font-black" style={{ color: OPCO_COLORS[item.opco] }}>{item.count}</p>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>{t.dashboard.viewDetails} →</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
