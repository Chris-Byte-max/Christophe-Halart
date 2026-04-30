import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RGF Marketing Team OS',
  description: 'AI-powered Marketing Intelligence & Campaign Operating System — RGF Staffing Belgium',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-50 antialiased">{children}</body>
    </html>
  )
}
