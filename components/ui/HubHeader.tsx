import { ReactNode } from 'react'

interface HubHeaderProps {
  title: string
  subtitle: string
  children?: ReactNode
}

export function HubHeader({ title, subtitle, children }: HubHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 pt-6 pb-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}
