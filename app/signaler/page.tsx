import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SignalerClient from './SignalerClient'

export const metadata: Metadata = {
  title: "J'ai quelque chose pour quelqu'un",
  description: "Tu as trouvé un document ou tu protèges un citoyen égaré. Enregistre ton acte citoyen sur RETROUVO.",
}

export default function SignalerPage() {
  return (
    <div className="min-h-screen">
      <div className="flag-bar w-full" />
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <SignalerClient />
      </main>
      <Footer />
    </div>
  )
}
