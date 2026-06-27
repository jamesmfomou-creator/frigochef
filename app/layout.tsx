import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import './globals.css'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'

export const metadata: Metadata = {
  title: 'FrigoChef — Cuisinez avec ce que vous avez',
  description:
    'Prenez une photo de vos ingrédients. Notre IA détecte ce que vous avez et propose instantanément des recettes adaptées.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        {children}
      </body>
    </html>
  )
}
