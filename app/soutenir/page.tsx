import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SoutenirClient from './SoutenirClient'

export const metadata: Metadata = {
  title: 'Nous soutenir',
  description: 'Cette plateforme tourne grâce à des gens comme toi. Soutiens RETROUVO — même 100 FCFA compte.',
}

export default function SoutenirPage() {
  return (
    <div className="min-h-screen">
      <div className="flag-bar w-full" />
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <SoutenirClient />
      </main>
      <Footer />
    </div>
  )
}
