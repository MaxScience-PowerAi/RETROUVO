import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FamilleClient from './FamilleClient'

export const metadata: Metadata = {
  title: 'La Famille',
  description: 'Les citoyens qui bâtissent RETROUVO. Samaritains, relais, volontaires — chaque membre compte.',
}

export default function FamillePage() {
  return (
    <div className="min-h-screen">
      <div className="flag-bar w-full" />
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <FamilleClient />
      </main>
      <Footer />
    </div>
  )
}
