import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'RETROUVO — Honneur · Fraternité · Vérité',
    template: '%s | RETROUVO',
  },
  description:
    'Infrastructure citoyenne camerounaise dédiée à la restitution de documents perdus et à la recherche de personnes disparues. Douala & Yaoundé.',
  keywords: ['documents perdus', 'CNI perdue', 'Cameroun', 'Douala', 'Yaoundé', 'personnes disparues'],
  authors: [{ name: 'RETROUVO' }],
  openGraph: {
    title: 'RETROUVO — Honneur · Fraternité · Vérité',
    description: "Retrouver ce qu'on a perdu. Protéger ceux qui ont disparu. Gratuit pour les familles.",
    locale: 'fr_CM',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Syne:wght@700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body min-h-screen" style={{ background: 'var(--cream)' }}>
        {children}
      </body>
    </html>
  )
}
