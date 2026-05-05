'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/context';

export default function LoginPage() {
  const { t, lang, setLang } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (res?.ok) {
      router.push('/dashboard');
    } else {
      setError(t.login.error);
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12" style={{ background: 'linear-gradient(135deg, #0369A1 0%, #0EA5E9 100%)' }}>
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
              <span className="text-sm font-black" style={{ color: '#0369A1' }}>RGF</span>
            </div>
            <span className="text-white text-xl font-bold tracking-tight">RGF Staffing</span>
          </div>
        </div>
        <div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <h1 className="text-5xl font-black text-white leading-tight mb-4">BA-BI<br />Analytics<br />Portal</h1>
            <p className="text-blue-100 text-xl font-light italic">{t.login.slogan}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} className="mt-12 grid grid-cols-2 gap-4">
            {['Start People', 'Unique', 'Bright Plus', 'Solvus/SSC'].map((brand) => (
              <div key={brand} className="bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
                <p className="text-white/90 text-sm font-medium">{brand}</p>
              </div>
            ))}
          </motion.div>
        </div>
        <p className="text-blue-200 text-sm">© 2026 RGF Staffing Belgium</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8" style={{ background: '#F0F9FF' }}>
        <div className="absolute top-6 right-6 flex gap-2">
          <button onClick={() => setLang('fr')} className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-all" style={lang === 'fr' ? { background: '#0369A1', color: 'white' } : { color: '#0369A1' }}>FR</button>
          <button onClick={() => setLang('nl')} className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-all" style={lang === 'nl' ? { background: '#0369A1', color: 'white' } : { color: '#0369A1' }}>NL</button>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#0369A1' }}>
              <span className="text-xs font-black text-white">RGF</span>
            </div>
            <span className="text-xl font-bold" style={{ color: '#0369A1' }}>RGF Staffing</span>
          </div>
          <h2 className="text-3xl font-black mb-2" style={{ color: '#0C4A6E' }}>{t.login.title}</h2>
          <p className="mb-8 text-sm" style={{ color: '#0369A1' }}>{t.login.subtitle}</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#0C4A6E' }}>{t.login.email}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl border-2 outline-none text-sm" style={{ borderColor: '#BAE6FD', background: 'white', color: '#0C4A6E' }} placeholder="data@rgfstaffing.be" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#0C4A6E' }}>{t.login.password}</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-xl border-2 outline-none text-sm" style={{ borderColor: '#BAE6FD', background: 'white', color: '#0C4A6E' }} placeholder="••••••••" />
            </div>
            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="px-4 py-3 rounded-xl text-sm font-medium" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
                {error}
              </motion.div>
            )}
            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3.5 rounded-xl font-bold text-white text-sm" style={{ background: loading ? '#94A3B8' : '#0369A1' }}>
              {loading ? t.login.loading : t.login.submit}
            </motion.button>
          </form>
          <p className="mt-8 text-center text-xs" style={{ color: '#94A3B8' }}>{t.login.slogan} · RGF Staffing © 2026</p>
        </motion.div>
      </div>
    </div>
  );
}
