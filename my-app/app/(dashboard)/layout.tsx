'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/context';
import { LayoutDashboard, ListChecks, Building2, FileBarChart, LogOut, Menu, X, ChevronRight } from 'lucide-react';

function NavItem({ href, icon: Icon, label, collapsed }: { href: string; icon: React.ComponentType<{ size?: number; className?: string }>; label: string; collapsed: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
  return (
    <Link href={href}>
      <motion.div whileHover={{ x: 2 }} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all`} style={isActive ? { background: 'rgba(255,255,255,0.2)', color: 'white' } : { color: 'rgba(255,255,255,0.8)' }}>
        <Icon size={20} className="shrink-0" />
        <AnimatePresence>
          {!collapsed && (
            <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="text-sm font-semibold whitespace-nowrap overflow-hidden">
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { t, lang, setLang } = useTranslation();
  const { data: session } = useSession();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: t.nav.overview },
    { href: '/dashboard/omnitracker', icon: ListChecks, label: t.nav.omnitracker },
    { href: '/dashboard/brands', icon: Building2, label: t.nav.brands },
    { href: '/dashboard/reports', icon: FileBarChart, label: t.nav.reports },
  ];

  async function handleLogout() {
    await signOut({ redirect: false });
    router.push('/login');
  }

  const sidebarContent = (
    <div className="flex flex-col h-full" style={{ background: 'linear-gradient(180deg, #0369A1 0%, #0C4A6E 100%)' }}>
      <div className="flex items-center gap-3 p-4 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
          <span className="text-xs font-black" style={{ color: '#0369A1' }}>RGF</span>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden">
              <p className="text-white font-bold text-sm leading-tight">RGF Staffing</p>
              <p className="text-blue-200 text-xs">BA-BI Portal</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {navItems.map((item) => <NavItem key={item.href} {...item} collapsed={collapsed} />)}
      </nav>
      <div className="p-3 border-t border-white/10">
        <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex w-full items-center justify-center gap-2 py-2 rounded-xl text-blue-200 hover:bg-white/10 transition-all text-sm">
          <ChevronRight size={16} className={`transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`} />
          {!collapsed && <span>Réduire</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F0F9FF' }}>
      <motion.aside animate={{ width: collapsed ? 64 : 240 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="hidden lg:flex flex-col shrink-0 overflow-hidden" style={{ borderRight: '1px solid #BAE6FD' }}>
        {sidebarContent}
      </motion.aside>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black z-40 lg:hidden" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 25 }} className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden">
              <div className="h-full relative">
                <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-white z-10"><X size={20} /></button>
                {sidebarContent}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-3 border-b shrink-0" style={{ borderColor: '#BAE6FD', background: 'white' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100" style={{ color: '#0369A1' }}><Menu size={20} /></button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button onClick={() => setLang('fr')} className="px-3 py-1 rounded-md text-xs font-bold transition-all" style={lang === 'fr' ? { background: '#0369A1', color: 'white' } : { color: '#6B7280' }}>FR</button>
              <button onClick={() => setLang('nl')} className="px-3 py-1 rounded-md text-xs font-bold transition-all" style={lang === 'nl' ? { background: '#0369A1', color: 'white' } : { color: '#6B7280' }}>NL</button>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold" style={{ color: '#0C4A6E' }}>{session?.user?.name || 'Utilisateur'}</p>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: '#E0F2FE', color: '#0369A1' }}>{t.topbar.role}</span>
              </div>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: '#0369A1' }}>DS</div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:bg-red-50" style={{ color: '#EF4444' }}>
              <LogOut size={16} />
              <span className="hidden sm:inline">{t.topbar.logout}</span>
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <motion.div key={typeof window !== 'undefined' ? window.location.pathname : 'page'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
