import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'RGF Staffing – BA-BI Analytics Portal',
  description: 'Portail analytique pour les Data Stratégistes de RGF Staffing',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full antialiased" style={{ background: '#F0F9FF', color: '#0C4A6E', fontFamily: 'Inter, Arial, Helvetica, sans-serif' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
