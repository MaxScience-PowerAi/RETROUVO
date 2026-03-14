import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HistoriqueClient from './HistoriqueClient'

export const metadata: Metadata = {
  title: 'Historique',
  description: 'Historique de vos pièces récupérées, personnes retrouvées et transactions financières.',
}

export default function HistoriquePage() {
  return (
    <div className="min-h-screen">
      <div className="flag-bar w-full" />
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        <HistoriqueClient />
      </main>
      <Footer />
    </div>
  )
}
