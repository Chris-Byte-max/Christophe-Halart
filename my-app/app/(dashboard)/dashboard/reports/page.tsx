'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getCallsByCategory, getCallsByOpco, OPCO_COLORS, OPCO_NAMES } from '@/lib/data/omnitracker';
import { useTranslation } from '@/lib/i18n/context';
import { Download, TrendingDown, TrendingUp, Minus } from 'lucide-react';

const REAL_VOLUMES: Record<number, number> = { 2022: 1822, 2023: 1293, 2024: 1075, 2025: 1208, 2026: 559 };

export default function ReportsPage() {
  const { t } = useTranslation();
  const yearlyData = useMemo(() => Object.entries(REAL_VOLUMES).map(([year, count]) => ({ year: Number(year), count })), []);
  const categoryData = useMemo(() => getCallsByCategory(), []);
  const opcoData = useMemo(() => getCallsByOpco(), []);
  const topCategory = categoryData[0]?.shortName || '—';
  const topOpco = opcoData[0]?.opco || '—';

  const WORK_ITEMS = [
    { key: 'standard', icon: '📊', color: '#0369A1', count: categoryData.find((c) => c.shortName === 'Standard')?.count || 0 },
    { key: 'adhoc', icon: '🔍', color: '#7C3AED', count: categoryData.find((c) => c.shortName === 'Ad Hoc')?.count || 0 },
    { key: 'atlas', icon: '🗺️', color: '#0891B2', count: categoryData.find((c) => c.shortName === 'Atlas')?.count || 0 },
    { key: 'greenbook', icon: '🟢', color: '#16A34A', count: categoryData.find((c) => c.shortName === 'Greenbook')?.count || 0 },
    { key: 'bluebook', icon: '🔵', color: '#2563EB', count: categoryData.find((c) => c.shortName === 'Bluebook')?.count || 0 },
    { key: 'schedule', icon: '📅', color: '#0EA5E9', count: categoryData.find((c) => c.shortName === 'Schedule')?.count || 0 },
    { key: 'tac', icon: '📋', color: '#F59E0B', count: categoryData.find((c) => c.shortName === 'TAC')?.count || 0 },
    { key: 'userMgmt', icon: '👤', color: '#6B7280', count: categoryData.find((c) => c.shortName === 'User Mgmt')?.count || 0 },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div><h1 className="text-3xl font-black" style={{ color: '#0C4A6E' }}>{t.reports.title}</h1><p className="text-sm mt-1" style={{ color: '#64748B' }}>Vue direction · Données 2022–2026</p></div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => alert(t.reports.exportAlert)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: '#22C55E' }}><Download size={16} />{t.reports.exportPdf}</motion.button>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E0F2FE' }}>
        <h2 className="text-lg font-bold mb-5" style={{ color: '#0C4A6E' }}>{t.reports.executiveSummary}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[{label:'Total calls 2022-2026',value:Object.values(REAL_VOLUMES).reduce((a,b)=>a+b,0).toLocaleString('fr-BE')},{label:'Volume 2026 (4 mois)',value:'559'},{label:'Catégorie dominante',value:topCategory},{label:'OPCO le plus actif',value:OPCO_NAMES[topOpco]||topOpco}].map((item,idx) => <div key={idx} className="rounded-xl p-4" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}><p className="text-xs font-semibold mb-2" style={{ color: '#94A3B8' }}>{item.label}</p><p className="text-2xl font-black" style={{ color: '#0C4A6E' }}>{item.value}</p></div>)}
        </div>
        <h3 className="text-sm font-bold mb-3" style={{ color: '#64748B' }}>{t.reports.yearlyTrend}</h3>
        <ResponsiveContainer width="100%" height={200}><BarChart data={yearlyData}><CartesianGrid strokeDasharray="3 3" stroke="#E0F2FE" /><XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748B' }} /><YAxis tick={{ fontSize: 12, fill: '#64748B' }} /><Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v) => [typeof v==='number'?v.toLocaleString('fr-BE'):v,'Calls']} /><Bar dataKey="count" fill="#0369A1" radius={[6,6,0,0]} /></BarChart></ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[{period:'2022→2023',delta:'-29%',type:'down'},{period:'2023→2024',delta:'-17%',type:'down'},{period:'2024→2025',delta:'+12%',type:'up'},{period:'2025→2026*',delta:'proj. ~1.7k',type:'neutral'}].map((item) => <div key={item.period} className="flex items-center gap-2 text-xs">{item.type==='up'?<TrendingUp size={14} style={{color:'#22C55E'}}/>:item.type==='down'?<TrendingDown size={14} style={{color:'#EF4444'}}/>:<Minus size={14} style={{color:'#F59E0B'}}/>}<span style={{color:'#64748B'}}>{item.period}</span><span className="font-bold" style={{color:item.type==='up'?'#22C55E':item.type==='down'?'#EF4444':'#F59E0B'}}>{item.delta}</span></div>)}
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E0F2FE' }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: '#0C4A6E' }}>Répartition par OPCO</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {opcoData.map((item) => { const total=opcoData.reduce((acc,d)=>acc+d.count,0); const pct=total>0?Math.round((item.count/total)*100):0; const color=OPCO_COLORS[item.opco]||'#6B7280'; return <div key={item.opco} className="rounded-xl p-4 text-center" style={{background:`${color}10`,border:`1px solid ${color}25`}}><div className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{background:color}}><span className="text-white text-xs font-black">{item.opco}</span></div><p className="text-xs font-semibold truncate" style={{color:'#64748B'}}>{OPCO_NAMES[item.opco]}</p><p className="text-xl font-black mt-1" style={{color}}>{item.count}</p><p className="text-xs font-semibold" style={{color:'#94A3B8'}}>{pct}%</p></div>; })}
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E0F2FE' }}>
        <h2 className="text-lg font-bold mb-2" style={{ color: '#0C4A6E' }}>{t.reports.teamWork}</h2>
        <p className="text-sm mb-5" style={{ color: '#64748B' }}>{t.reports.teamActivity}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WORK_ITEMS.map((item, idx) => <motion.div key={item.key} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + idx * 0.06 }} whileHover={{ y: -2 }} className="rounded-xl p-4" style={{background:`${item.color}08`,border:`1px solid ${item.color}20`}}><div className="text-2xl mb-2">{item.icon}</div><p className="text-sm font-semibold leading-snug" style={{color:'#0C4A6E'}}>{t.reports.categories[item.key]}</p><p className="text-xl font-black mt-2" style={{color:item.color}}>{item.count}<span className="text-sm font-medium ml-1" style={{color:'#94A3B8'}}>calls</span></p></motion.div>)}
        </div>
      </motion.div>
      <div className="text-center py-4"><p className="text-xs" style={{ color: '#CBD5E1' }}>* Données 2026 partielles (Jan–Avr). Projections basées sur les tendances historiques. · RGF Staffing BA-BI Analytics Portal</p></div>
    </div>
  );
}
