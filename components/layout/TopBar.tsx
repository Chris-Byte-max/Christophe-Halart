'use client'

import { useState } from 'react'
import { useApp } from '@/lib/context'
import { BRANDS, USERS } from '@/lib/data'
import { getBrandColorClass } from '@/lib/utils'
import { ChevronDown, Bell, Settings, Building2, User, LogOut, ChevronRight } from 'lucide-react'
import type { BrandId } from '@/lib/types'

export default function TopBar() {
  const { currentUser, currentBrand, setCurrentBrand, setCurrentUser, allowedBrands } = useApp()
  const [brandOpen, setBrandOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20 relative">
      {/* Left: Workspace indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-slate-500 text-sm">
          <Building2 size={14} />
          <span>Workspace:</span>
        </div>

        {/* Brand switcher */}
        <div className="relative">
          <button
            onClick={() => { setBrandOpen(!brandOpen); setUserOpen(false) }}
            className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: currentBrand.color }}
            />
            <span>{currentBrand.name}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {brandOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50">
              {allowedBrands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => { setCurrentBrand(brand.id as BrandId); setBrandOpen(false) }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-slate-50 transition-colors ${
                    currentBrand.id === brand.id ? 'text-violet-700 font-medium' : 'text-slate-700'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: brand.color }} />
                  <span>{brand.name}</span>
                  {currentBrand.id === brand.id && (
                    <ChevronRight size={12} className="ml-auto text-violet-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="text-slate-300 text-sm">·</span>
        <span className="text-slate-500 text-sm">{currentBrand.description}</span>
      </div>

      {/* Right: Actions + User */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Settings */}
        <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700">
          <Settings size={17} />
        </button>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => { setUserOpen(!userOpen); setBrandOpen(false) }}
            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-slate-100 transition-colors"
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${getBrandColorClass(currentUser.primaryBrand)}`}>
              {currentUser.initials}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-slate-800 leading-tight">{currentUser.name}</p>
              <p className="text-xs text-slate-500 leading-tight">{currentUser.roleLabel}</p>
            </div>
            <ChevronDown size={13} className="text-slate-400" />
          </button>

          {userOpen && (
            <div className="absolute top-full right-0 mt-1.5 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Switch User</p>
                {USERS.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => { setCurrentUser(user); setUserOpen(false) }}
                    className={`w-full flex items-center gap-2 py-1.5 text-sm rounded-lg px-1 hover:bg-slate-50 transition-colors ${
                      currentUser.id === user.id ? 'text-violet-700 font-medium' : 'text-slate-700'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${getBrandColorClass(user.primaryBrand)}`}>
                      {user.initials}
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-xs font-medium truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user.roleLabel}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                <User size={14} />
                <span>Profile Settings</span>
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click-outside overlay */}
      {(brandOpen || userOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setBrandOpen(false); setUserOpen(false) }} />
      )}
    </header>
  )
}
