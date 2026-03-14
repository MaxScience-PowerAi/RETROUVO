import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import RejoindreClient from './RejoindreClient'

export const metadata: Metadata = {
  title: 'Rejoindre',
  description: 'On ne construit pas RETROUVO pour être célèbres. Rejoins le mouvement — citoyen, samaritain, point relais ou volontaire.',
}

export default function RejoindreP() {
  return (
    <div className="min-h-screen">
      <div className="flag-bar w-full" />
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <RejoindreClient />
      </main>
      <Footer />
    </div>
  )
}
