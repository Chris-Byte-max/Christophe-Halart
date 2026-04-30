import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { BrandId, ChannelId } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, compact = false): string {
  if (compact && amount >= 1000) {
    return `€${(amount / 1000).toFixed(0)}K`
  }
  return new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount)
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

export function getBrandColorClass(brandId: BrandId): string {
  const map: Record<BrandId, string> = {
    group: 'bg-slate-800 text-white',
    'start-people': 'bg-sky-500 text-white',
    unique: 'bg-amber-500 text-white',
    'express-medical': 'bg-emerald-500 text-white',
    solvus: 'bg-indigo-500 text-white',
    'bright-plus': 'bg-pink-500 text-white',
    'usg-professionals': 'bg-orange-500 text-white',
  }
  return map[brandId] ?? 'bg-slate-500 text-white'
}

export function getBrandBadgeClass(brandId: BrandId): string {
  const map: Record<BrandId, string> = {
    group: 'bg-slate-100 text-slate-700 border-slate-200',
    'start-people': 'bg-sky-50 text-sky-700 border-sky-200',
    unique: 'bg-amber-50 text-amber-700 border-amber-200',
    'express-medical': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    solvus: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'bright-plus': 'bg-pink-50 text-pink-700 border-pink-200',
    'usg-professionals': 'bg-orange-50 text-orange-700 border-orange-200',
  }
  return map[brandId] ?? 'bg-slate-50 text-slate-600 border-slate-200'
}

export function getChannelLabel(channel: ChannelId): string {
  const map: Record<ChannelId, string> = {
    linkedin: 'LinkedIn',
    instagram: 'Instagram',
    facebook: 'Facebook',
    youtube: 'YouTube',
    email: 'Email',
    website: 'Website',
    display: 'Display',
    search: 'Search',
    print: 'Print',
  }
  return map[channel] ?? channel
}

export function getChannelColor(channel: ChannelId): string {
  const map: Record<ChannelId, string> = {
    linkedin: '#0077B5',
    instagram: '#E4405F',
    facebook: '#1877F2',
    youtube: '#FF0000',
    email: '#7c3aed',
    website: '#0ea5e9',
    display: '#f59e0b',
    search: '#34A853',
    print: '#6b7280',
  }
  return map[channel] ?? '#6b7280'
}

export function getHealthColor(score: number): string {
  if (score >= 80) return 'text-emerald-600'
  if (score >= 60) return 'text-amber-600'
  return 'text-red-500'
}

export function getHealthBg(score: number): string {
  if (score >= 80) return 'bg-emerald-500'
  if (score >= 60) return 'bg-amber-500'
  return 'bg-red-500'
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr)
  const today = new Date('2026-04-30')
  const diff = target.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function formatDeadline(dateStr: string): string {
  const days = daysUntil(dateStr)
  if (days < 0) return `${Math.abs(days)}d overdue`
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  return `${days}d remaining`
}
