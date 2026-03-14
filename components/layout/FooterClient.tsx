'use client'

import Link from 'next/link'
import RetrouvoLogo from '../ui/RetrouvoLogo'
import { useAgenceSecret } from '@/lib/useAgenceSecret'

export default function FooterClient() {
  // Active l'écoute du secret agence sur toutes les pages
  useAgenceSecret()

  return (
    <footer className="mt-24 bg-white" style={{ borderTop: '1px solid var(--warm-border)' }}>
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">

        {/* Logo avec ID secret — 7 clics pour activer l'entrée */}
        <div
          id="retrouvo-footer-logo"
          className="flex items-center gap-3 cursor-pointer group opacity-50 hover:opacity-100 transition-opacity"
          onClick={() => {}}
        >
          <RetrouvoLogo className="w-10 h-10" />
          <div>
            <span className="font-syne text-slate-700 text-[20px]">RETROUVO</span>
            <p className="text-slate-400 font-medium text-[10px] uppercase" style={{ letterSpacing: '0.12em' }}>
              HONNEUR · FRATERNITÉ · VÉRITÉ
            </p>
          </div>
        </div>

        <div className="flex gap-8">
          {[
            ['Nous soutenir', '/soutenir'],
            ['Rejoindre',     '/rejoindre'],
            ['Notre éthique', '/ethique'],
          ].map(([l, h]) => (
            <Link key={h} href={h} className="text-slate-400 hover:text-slate-600 font-medium text-[13px] transition-colors">
              {l}
            </Link>
          ))}
        </div>

        <div className="text-center md:text-right space-y-1">
          <p className="text-slate-400 font-medium text-[10px] uppercase" style={{ letterSpacing: '0.3em' }}>
            DOUALA · YAOUNDÉ · CAMEROUN
          </p>
          <p className="text-slate-300 font-medium italic text-[11px]" style={{ lineHeight: 1.6 }}>
            Bâtie avec amour, pour les citoyens camerounais.
          </p>
        </div>
      </div>
      <div className="flag-bar w-full" />
    </footer>
  )
}
