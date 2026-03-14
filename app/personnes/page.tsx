import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PersonnesClient from './PersonnesClient'

export const metadata: Metadata = {
  title: 'Personnes disparues',
  description: 'Quand quelqu\'un disparaît, toute une famille s\'arrête de vivre. Signalez gratuitement. RETROUVO protège votre famille.',
}

export default function PersonnesPage() {
  return (
    <div className="min-h-screen">
      <div className="flag-bar w-full" />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <PersonnesClient />
      </main>
      <Footer />
    </div>
  )
}
