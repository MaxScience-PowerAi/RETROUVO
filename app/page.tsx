import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import RetrouvoLogo from '@/components/ui/RetrouvoLogo'
import {
  FileText, Users, Heart, Scale, HandHeart,
  Globe, ArrowRight, ShieldCheck,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Accueil',
  description:
    'Il y a des jours où l\'on perd quelque chose. Il y a des gens qui veillent à ce qu\'on le retrouve. RETROUVO — Cameroun.',
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="flag-bar w-full" />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12 md:py-20 space-y-16">

        {/* ── HERO ── */}
        <section className="hero-soft rounded-[2.5rem] overflow-hidden relative">
          <div className="p-10 md:p-16 lg:p-20 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-8">
              <div
                className="inline-flex items-center gap-2 glass-card px-4 py-2"
                style={{ fontSize: '12px' }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-gentle-pulse"
                  style={{ background: 'var(--cm-green)' }}
                />
                <span className="text-slate-300 font-medium" style={{ letterSpacing: '0.08em' }}>
                  Cameroun — Douala &amp; Yaoundé
                </span>
              </div>

              <div className="animate-fade-up">
                <h1
                  className="font-serif text-white leading-tight"
                  style={{ fontSize: 'clamp(38px, 5.5vw, 70px)', fontWeight: 600 }}
                >
                  Il y a des jours où<br />
                  <em style={{ color: 'var(--cm-yellow)' }}>l&apos;on perd quelque chose.</em>
                </h1>
                <h2
                  className="font-serif text-white leading-tight mt-2"
                  style={{ fontSize: 'clamp(38px, 5.5vw, 70px)', fontWeight: 400, opacity: 0.85 }}
                >
                  Il y a des gens qui<br />veillent à ce qu&apos;on le retrouve.
                </h2>
              </div>

              <p className="text-slate-300 font-medium leading-relaxed max-w-lg" style={{ fontSize: '16px', lineHeight: 1.85 }}>
                RETROUVO est né d&apos;une conviction simple : au Cameroun, il y a bien plus de bonnes personnes
                que de mauvaises. Nous sommes là pour les connecter — avec amour, avec justice, sans rien demander de plus.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/pieces"
                  className="flex items-center gap-2 px-7 py-4 rounded-2xl font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: 'var(--navy)', fontSize: '14px' }}
                >
                  <FileText className="w-5 h-5" /> Chercher une pièce
                </Link>
                <Link
                  href="/personnes"
                  className="flex items-center gap-2 px-7 py-4 rounded-2xl font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: 'rgba(206,17,38,.85)', fontSize: '14px' }}
                >
                  <Heart className="w-5 h-5" /> Un proche a disparu
                </Link>
              </div>
            </div>

            <div className="hidden md:block flex-shrink-0">
              <RetrouvoLogo className="w-44 h-44 opacity-[0.12]" />
            </div>
          </div>

          {/* Stats */}
          <div
            className="border-t px-10 md:px-16 py-6 grid grid-cols-3 gap-4"
            style={{ borderColor: 'rgba(255,255,255,.08)' }}
          >
            {[
              { val: 'Gratuit',  label: 'Pour les familles en deuil d\'un proche' },
              { val: '50 / 50', label: 'Récompense partagée avec équité'         },
              { val: '0 jug.',  label: 'Juste de l\'aide, rien d\'autre'          },
            ].map(s => (
              <div key={s.label} className="glass-card px-4 py-4 text-center">
                <p className="font-serif font-semibold" style={{ fontSize: '22px', color: 'var(--cm-yellow)' }}>
                  {s.val}
                </p>
                <p className="text-slate-400 font-medium mt-1" style={{ fontSize: '11px', lineHeight: 1.5 }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── DEUX CARTES PRINCIPALES ── */}
        <div className="grid md:grid-cols-2 gap-8">
          <Link
            href="/pieces"
            className="hover-lift cursor-pointer rounded-[2rem] overflow-hidden border bg-white block"
            style={{ borderColor: 'var(--warm-border)' }}
          >
            <div className="h-1.5" style={{ background: 'var(--navy)' }} />
            <div className="p-10 md:p-12">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-8"
                style={{ background: 'rgba(30,58,138,.07)' }}
              >
                <FileText className="w-6 h-6" style={{ color: 'var(--navy)' }} />
              </div>
              <h3 className="font-syne text-slate-900 mb-4 text-[26px]" style={{ letterSpacing: '-0.02em' }}>
                Pièces de vie
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed" style={{ fontSize: '15px', lineHeight: 1.8 }}>
                Quelqu&apos;un a trouvé ta pièce. Il ne l&apos;a pas jetée. Il l&apos;a gardée, parce qu&apos;il sait
                que derrière ce document il y a une personne qui attend — et cette personne, c&apos;est peut-être toi.
              </p>
              <div className="mt-8 flex items-center gap-2 font-semibold" style={{ color: 'var(--navy)', fontSize: '13px' }}>
                Voir les pièces trouvées <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          <Link
            href="/personnes"
            className="hover-lift cursor-pointer rounded-[2rem] overflow-hidden relative block"
            style={{ background: '#1a0a0d' }}
          >
            <div className="h-1.5" style={{ background: 'var(--cm-red)' }} />
            <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none">
              <Heart style={{ width: '200px', height: '200px', color: '#ce1126' }} />
            </div>
            <div className="p-10 md:p-12 relative z-10">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-8"
                style={{ background: 'rgba(206,17,38,.15)' }}
              >
                <Heart className="w-6 h-6 animate-heartbeat" style={{ color: '#f87171' }} />
              </div>
              <h3 className="font-syne text-white mb-4 text-[26px]" style={{ letterSpacing: '-0.02em' }}>
                Personnes disparues
              </h3>
              <p className="font-medium leading-relaxed" style={{ color: 'rgba(255,255,255,.7)', fontSize: '15px', lineHeight: 1.8 }}>
                Quand quelqu&apos;un disparaît, toute une famille s&apos;arrête de vivre. Si tu vois quelque chose —
                dis-le. Juste ça. Rien d&apos;autre ne te sera demandé.
              </p>
              <div className="mt-8 flex items-center gap-2 font-semibold text-red-300" style={{ fontSize: '13px' }}>
                Voir les alertes <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>

        {/* ── SOUTENIR + REJOINDRE ── */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/soutenir"
            className="hover-lift cursor-pointer rounded-[2rem] p-8 flex items-start gap-6 bg-white border block"
            style={{ borderColor: 'var(--warm-border)' }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 animate-heartbeat"
              style={{ background: 'rgba(0,122,94,.07)' }}
            >
              <HandHeart className="w-6 h-6" style={{ color: 'var(--cm-green)' }} />
            </div>
            <div>
              <h4 className="font-syne text-slate-900 mb-2 text-[18px]">Nous soutenir</h4>
              <p className="text-slate-500 font-medium" style={{ fontSize: '13px', lineHeight: 1.75 }}>
                Cette plateforme tourne grâce à des gens comme toi, qui ont décidé qu&apos;aider les autres valait quelque chose.
              </p>
            </div>
          </Link>

          <Link
            href="/rejoindre"
            className="hover-lift cursor-pointer rounded-[2rem] p-8 flex items-start gap-6 bg-white border block"
            style={{ borderColor: 'var(--warm-border)' }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(30,58,138,.07)' }}
            >
              <Globe className="w-6 h-6" style={{ color: 'var(--navy)' }} />
            </div>
            <div>
              <h4 className="font-syne text-slate-900 mb-2 text-[18px]">Rejoindre le mouvement</h4>
              <p className="text-slate-500 font-medium" style={{ fontSize: '13px', lineHeight: 1.75 }}>
                On ne construit pas RETROUVO pour être célèbres. On le construit parce que chaque pièce rendue, c&apos;est quelque chose de beau.
              </p>
            </div>
          </Link>
        </div>

        {/* ── ÉTHIQUE BANDEAU ── */}
        <Link
          href="/ethique"
          className="hover-lift cursor-pointer rounded-[2rem] p-10 md:p-14 flex flex-col md:flex-row items-center gap-8 bg-white border block"
          style={{ borderColor: 'var(--warm-border)' }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(252,209,22,.12)' }}
          >
            <Scale className="w-7 h-7" style={{ color: '#92700a' }} />
          </div>
          <div className="flex-1">
            <h3 className="font-syne text-slate-900 mb-2 text-[20px]">
              Rendre ce qu&apos;on a trouvé — notre philosophie
            </h3>
            <p className="text-slate-500 font-medium" style={{ fontSize: '14px', lineHeight: 1.75 }}>
              La récompense n&apos;est pas une transaction. C&apos;est juste la façon qu&apos;a la société de te dire merci
              pour avoir été honnête quand personne ne regardait.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 flex-shrink-0" />
        </Link>

      </main>
      <Footer />
    </div>
  )
}
