import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PiecesClient from './PiecesClient'

export const metadata: Metadata = {
  title: 'Pièces de vie',
  description: 'Retrouver une CNI, un passeport ou un diplôme perdu. Quelqu\'un l\'a trouvé et t\'attend.',
}

export default function PiecesPage() {
  return (
    <div className="min-h-screen">
      <div className="flag-bar w-full" />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <PiecesClient />
      </main>
      <Footer />
    </div>
  )
}
