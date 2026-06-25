import type { Metadata, Viewport } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
