'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface KpiCardProps {
  title: string;
  value: number;
  suffix?: string;
  icon?: React.ReactNode;
  color?: string;
  delay?: number;
  trend?: string;
}

function useCountUp(target: number, duration = 1500, delay = 0) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      function tick(now: number) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) frameRef.current = requestAnimationFrame(tick);
      }
      frameRef.current = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(timeout); cancelAnimationFrame(frameRef.current); };
  }, [target, duration, delay]);

  return count;
}

export default function KpiCard({ title, value, suffix = '', icon, color = '#0369A1', delay = 0, trend }: KpiCardProps) {
  const count = useCountUp(value, 1200, delay);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: delay / 1000 }} whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(3,105,161,0.12)' }} className="bg-white rounded-2xl p-6 flex flex-col gap-3" style={{ border: '1px solid #E0F2FE', boxShadow: '0 2px 8px rgba(3,105,161,0.06)' }}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-semibold" style={{ color: '#64748B' }}>{title}</p>
        {icon && <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}><span style={{ color }}>{icon}</span></div>}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-4xl font-black tabular-nums" style={{ color: '#0C4A6E' }}>{count.toLocaleString('fr-BE')}</span>
        {suffix && <span className="text-lg font-semibold pb-1" style={{ color }}>{suffix}</span>}
      </div>
      {trend && <p className="text-xs font-medium" style={{ color: '#94A3B8' }}>{trend}</p>}
    </motion.div>
  );
}
