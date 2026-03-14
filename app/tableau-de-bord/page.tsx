'use client'

import Link from 'next/link'
import { FileText, Users, MessageSquare, Heart, PlusCircle, Bell, TrendingUp } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

// Données simulées pour la démo
const DEMO_STATS = [
  { label: 'Pièces signalées',    value: '0', icon: FileText, color: 'var(--navy)'     },
  { label: 'Alertes actives',     value: '0', icon: Bell,     color: 'var(--cm-red)'   },
  { label: 'Transactions closes', value: '0', icon: Heart,    color: 'var(--cm-green)' },
  { label: 'Messages reçus',      value: '0', icon: MessageSquare, color: '#7c3aed'    },
]

const QUICK_ACTIONS = [
  { label: "J'ai trouvé quelque chose", href: '/signaler',   color: 'var(--navy)',     icon: PlusCircle },
  { label: 'Signaler une disparition',  href: '/personnes',  color: 'var(--cm-red)',   icon: Users      },
  { label: 'Voir les pièces trouvées',  href: '/pieces',     color: 'var(--cm-green)', icon: FileText   },
  { label: 'Mon historique complet',    href: '/historique', color: '#b45309',         icon: TrendingUp  },
]

export default function TableauDeBordPage() {
  return (
    <div className="min-h-screen">
      <div className="flag-bar w-full" />
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20 space-y-12">

        {/* Bienvenue */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="font-syne text-slate-900 text-[32px]" style={{ letterSpacing: '-0.02em' }}>
              Bonjour, Samaritain.
            </h1>
            <p className="text-slate-500 font-medium mt-1 text-[15px]">
              Voici un aperçu de ton activité sur RETROUVO.
            </p>
          </div>
          <Link
            href="/signaler"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-semibold text-[13px] transition-all hover:opacity-90"
            style={{ background: 'var(--navy)' }}
          >
            <PlusCircle className="w-4 h-4" /> Nouveau signalement
          </Link>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {DEMO_STATS.map(s => (
            <div
              key={s.label}
              className="bg-white rounded-2xl border p-6 space-y-3"
              style={{ borderColor: 'var(--warm-border)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${s.color}14` }}
              >
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div>
                <p className="font-syne text-slate-900 text-[28px]">{s.value}</p>
                <p className="text-slate-400 font-medium text-[12px] mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions rapides */}
        <div>
          <h2 className="font-syne text-slate-900 mb-5 text-[20px]">Actions rapides</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {QUICK_ACTIONS.map(a => (
              <Link
                key={a.href}
                href={a.href}
                className="hover-lift bg-white rounded-2xl border p-6 flex items-center gap-4 transition-shadow hover:shadow-md"
                style={{ borderColor: 'var(--warm-border)' }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${a.color}14` }}
                >
                  <a.icon className="w-5 h-5" style={{ color: a.color }} />
                </div>
                <span className="font-semibold text-slate-700 text-[14px]">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Activité récente vide */}
        <div>
          <h2 className="font-syne text-slate-900 mb-5 text-[20px]">Activité récente</h2>
          <div
            className="bg-white rounded-2xl border p-16 text-center"
            style={{ borderColor: 'var(--warm-border)' }}
          >
            <Heart className="w-10 h-10 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium text-[14px]" style={{ lineHeight: 1.7 }}>
              Ton historique apparaîtra ici.<br />
              Commence par signaler une pièce trouvée ou une alerte.
            </p>
            <Link
              href="/signaler"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl text-white font-semibold text-[13px] transition-all hover:opacity-90"
              style={{ background: 'var(--navy)' }}
            >
              <PlusCircle className="w-4 h-4" /> Mon premier signalement
            </Link>
          </div>
        </div>

        {/* Note intégration */}
        <div
          className="rounded-2xl p-6"
          style={{ background: 'rgba(30,58,138,.04)', border: '1px solid rgba(30,58,138,.1)' }}
        >
          <p className="text-slate-500 font-medium text-[13px]" style={{ lineHeight: 1.7 }}>
            <span className="font-semibold text-slate-700">Prochaine étape :</span> Connecte Supabase pour que
            les données soient réelles. Le fichier <code className="bg-slate-100 px-2 py-0.5 rounded text-[12px]">.env.local</code> doit
            contenir tes clés Supabase. Consulte le README pour les instructions complètes.
          </p>
        </div>

      </main>
      <Footer />
    </div>
  )
}
