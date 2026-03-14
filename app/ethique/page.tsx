import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Handshake, Heart, Users, Coins, FileText, Scale } from 'lucide-react'
import { DOC_TYPES } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Notre éthique',
  description: 'Rendre ce qu\'on a trouvé — ce n\'est pas une transaction. C\'est la façon qu\'a la société de dire merci. Le partage 50/50.',
}

export default function EthiquePage() {
  return (
    <div className="min-h-screen">
      <div className="flag-bar w-full" />
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-12 md:py-20 space-y-14">

        {/* Header */}
        <header className="text-center space-y-5">
          <h1
            className="font-syne text-slate-900"
            style={{ fontSize: 'clamp(40px, 7vw, 72px)', letterSpacing: '-0.03em' }}
          >
            Notre éthique
          </h1>
          <p className="text-slate-500 font-medium max-w-xl mx-auto text-[16px]" style={{ lineHeight: 1.85 }}>
            Rendre ce qu&apos;on a trouvé, c&apos;est déjà un acte rare et précieux.
            La récompense n&apos;est pas une transaction — c&apos;est juste la façon qu&apos;a la société
            de te dire merci pour avoir été honnête quand personne ne regardait.
          </p>
        </header>

        {/* Deux cartes */}
        <div className="grid md:grid-cols-2 gap-6">
          <div
            className="bg-white rounded-2xl p-10 border shadow-sm cm-stripe-green"
            style={{ borderColor: 'var(--warm-border)' }}
          >
            <Handshake className="w-10 h-10 mb-6" style={{ color: 'var(--navy)' }} />
            <h2 className="font-syne text-slate-900 mb-3 text-[24px]">Le partage 50/50</h2>
            <p className="text-slate-500 font-medium leading-relaxed text-[14px]" style={{ lineHeight: 1.85 }}>
              Chaque récompense est divisée équitablement : 50% pour le Samaritain honnête,
              50% pour financer la machine et garantir la gratuité totale pour toutes les familles
              qui cherchent un proche disparu.
            </p>
          </div>

          <div
            className="rounded-2xl p-10 text-white relative overflow-hidden cm-stripe-yellow"
            style={{ background: '#1a0505' }}
          >
            <Heart className="w-10 h-10 text-red-300 mb-6 relative z-10 animate-heartbeat" />
            <h2 className="font-syne text-white mb-3 relative z-10 text-[24px]">Gratuité pour les familles</h2>
            <p className="font-medium leading-relaxed relative z-10 text-[14px]" style={{ color: 'rgba(255,255,255,.75)', lineHeight: 1.85 }}>
              Aider une famille à retrouver l&apos;un des siens ne se monnaie pas.
              Ça ne se calcule pas. Ça se fait — et puis on rentre chez soi le cœur léger.
            </p>
            <Users className="w-40 h-40 absolute -right-8 -bottom-8 opacity-5" />
          </div>
        </div>

        {/* Tableau barème */}
        <div
          className="bg-white rounded-2xl border shadow-sm overflow-hidden"
          style={{ borderColor: 'var(--warm-border)' }}
        >
          <div className="flex items-center gap-3 px-8 py-5" style={{ background: 'var(--navy-dark)' }}>
            <Coins className="w-5 h-5 text-amber-400" />
            <h2 className="font-syne text-white text-[20px]" style={{ letterSpacing: '0.04em' }}>
              Barème de reconnaissance (documents)
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[560px]">
              <thead>
                <tr className="border-b" style={{ background: 'var(--warm)', borderColor: 'var(--warm-border)' }}>
                  {['Document', 'Total payé', 'Frais agence', 'Pour le Samaritain'].map((h, i) => (
                    <th
                      key={h}
                      className={`px-8 py-5 font-semibold uppercase text-slate-400 ${i > 1 ? 'bg-green-50 text-green-600' : ''}`}
                      style={{ fontSize: '10px', letterSpacing: '0.12em', borderLeft: i === 3 ? '1px solid #d1fae5' : 'none' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(Object.entries(DOC_TYPES) as [string, typeof DOC_TYPES[keyof typeof DOC_TYPES]][]).map(([k, v]) => (
                  <tr key={k} className="border-b hover:bg-slate-50 transition-colors" style={{ borderColor: 'var(--warm-border)' }}>
                    <td className="px-8 py-5 font-medium text-slate-700 text-[14px]">
                      <span className="flex items-center gap-3">
                        {k === 'OTHER'
                          ? <Scale className="w-4 h-4 text-amber-500 flex-shrink-0" />
                          : <FileText className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--navy)' }} />}
                        {v.label}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-semibold text-[15px]" style={{ color: 'var(--navy)' }}>
                      {v.price === 'VARIABLE' ? 'Selon accord' : `${(v.price as number) + (v.fees as number)} FCFA`}
                    </td>
                    <td className="px-8 py-5 text-slate-400 font-medium italic bg-green-50 text-[13px]">
                      {v.fees === 'DYNAMIC' ? '1% (min 100 FCFA)' : `${v.fees} FCFA`}
                    </td>
                    <td
                      className="px-8 py-5 font-semibold text-green-700 bg-green-50 text-[17px]"
                      style={{ borderLeft: '1px solid #d1fae5' }}
                    >
                      {v.price === 'VARIABLE' ? "50% de l'accord" : `${(v.price as number) / 2} FCFA`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Citation finale */}
        <div className="quote-block max-w-2xl mx-auto">
          <p className="font-serif text-slate-700 text-[18px]" style={{ lineHeight: 1.8 }}>
            &ldquo;L&apos;honnêteté mérite d&apos;être reconnue. Pas tout — la moitié.
            Parce que l&apos;autre moitié, tu l&apos;as déjà donnée en étant honnête.&rdquo;
          </p>
          <p className="mt-3 text-slate-400 font-medium text-[12px] uppercase" style={{ letterSpacing: '0.1em' }}>
            — La philosophie RETROUVO
          </p>
        </div>

      </main>
      <Footer />
    </div>
  )
}
