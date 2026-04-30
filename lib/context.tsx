'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import type { AppUser, BrandId, Brand, HubId } from './types'
import { USERS, BRANDS } from './data'

interface AppContextValue {
  currentUser: AppUser
  currentBrand: Brand
  activeHub: HubId
  setCurrentUser: (user: AppUser) => void
  setCurrentBrand: (brandId: BrandId) => void
  setActiveHub: (hub: HubId) => void
  getBrand: (id: BrandId) => Brand | undefined
  allowedBrands: Brand[]
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser>(USERS[0])
  const [currentBrandId, setCurrentBrandId] = useState<BrandId>('group')
  const [activeHub, setActiveHub] = useState<HubId>('command-center')

  const currentBrand = BRANDS.find((b) => b.id === currentBrandId) ?? BRANDS[0]
  const allowedBrands = BRANDS.filter((b) => currentUser.allowedBrands.includes(b.id))

  const setCurrentBrand = (brandId: BrandId) => {
    setCurrentBrandId(brandId)
  }

  const handleSetCurrentUser = (user: AppUser) => {
    setCurrentUser(user)
    setCurrentBrandId(user.primaryBrand)
  }

  const getBrand = (id: BrandId) => BRANDS.find((b) => b.id === id)

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentBrand,
        activeHub,
        setCurrentUser: handleSetCurrentUser,
        setCurrentBrand,
        setActiveHub,
        getBrand,
        allowedBrands,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
