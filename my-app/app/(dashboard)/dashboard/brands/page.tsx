'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { getCallsByOpco, OPCO_COLORS, OPCO_NAMES } from '@/lib/data/omnitracker';
import { useTranslation } from '@/lib/i18n/context';
import { ArrowRight } from 'lucide-react';

const OPCOS = ['STP', 'UNQ', 'SSC', 'BPL', 'EMI', 'USP', 'SLV'];

export default function BrandsPage() {
  const { t } = useTranslation();
  const allOpcoData = getCallsByOpco();
  const opcoMap = Object.fromEntries(allOpcoData.map((d) => [d.opco, d.count]));

  return (
    <div className="flex flex-col gap-6">
      <div><h1 className="text-3xl font-black" style={{ color: '#0C4A6E' }}>{t.nav.brands}</h1><p className="text-sm mt-1" style={{ color: '#64748B' }}>Sélectionnez une marque pour voir ses détails</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {OPCOS.map((opco, idx) => {
          const count = opcoMap[opco] || 0;
          const color = OPCO_COLORS[opco];
          return (
            <motion.div key={opco} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: idx * 0.07 }} whileHover={{ y: -4, boxShadow: `0 12px 32px ${color}20` }}>
              <Link href={`/dashboard/brands/${opco}`}>
                <div className="bg-white rounded-2xl p-6 cursor-pointer" style={{ border: `2px solid ${color}20` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: color }}><span className="text-white font-black text-sm">{opco}</span></div>
                    <ArrowRight size={20} style={{ color: '#CBD5E1' }} />
                  </div>
                  <h3 className="text-lg font-bold mb-1" style={{ color: '#0C4A6E' }}>{OPCO_NAMES[opco]}</h3>
                  <p className="text-sm" style={{ color: '#64748B' }}>{opco} · RGF Staffing Belgium</p>
                  <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: '#F1F5F9' }}>
                    <div><p className="text-xs" style={{ color: '#94A3B8' }}>Total calls</p><p className="text-3xl font-black" style={{ color }}>{count}</p></div>
                    <div className="w-2 h-16 rounded-full" style={{ background: `linear-gradient(180deg, ${color} 0%, ${color}40 100%)` }} />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
