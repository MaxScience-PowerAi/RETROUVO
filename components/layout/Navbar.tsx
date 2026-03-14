'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, PlusCircle, X, Menu } from 'lucide-react'
import RetrouvoLogo from '../ui/RetrouvoLogo'

const NAV_LINKS = [
  { label: 'Pièces perdues',      href: '/pieces'    },
  { label: 'Personnes disparues', href: '/personnes' },
  { label: 'Notre éthique',       href: '/ethique'   },
  { label: 'Nous soutenir',       href: '/soutenir'  },
  { label: 'Rejoindre',           href: '/rejoindre' },
  { label: 'La Famille',          href: '/famille'   },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav
      className="sticky top-0 z-50 bg-white"
      style={{ borderBottom: '1px solid var(--warm-border)', boxShadow: '0 1px 16px rgba(0,0,0,.04)' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <RetrouvoLogo className="w-11 h-11 transition-transform group-hover:scale-105" />
          <div>
            <p className="font-syne leading-none text-[22px]" style={{ color: 'var(--navy-dark)', letterSpacing: '-0.02em' }}>
              RETROUVO
            </p>
            <p className="text-slate-400 font-medium text-[9px] uppercase" style={{ letterSpacing: '0.18em' }}>
              HONNEUR · FRATERNITÉ · VÉRITÉ
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="font-medium text-[13px] transition-colors"
              style={{ color: pathname === href ? 'var(--navy-dark)' : '#6b7280' }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* CTA + Burger */}
        <div className="flex items-center gap-3">
          <Link
            href="/signaler"
            className="hidden md:flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-semibold text-[12px] transition-all hover:opacity-90"
            style={{ background: 'var(--navy)', letterSpacing: '0.02em' }}
          >
            <Heart className="w-4 h-4" />
            J&apos;ai quelque chose pour quelqu&apos;un
          </Link>
          <button
            className="lg:hidden p-2 rounded-xl border border-slate-200"
            onClick={() => setOpen(v => !v)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white px-6 py-4 space-y-1" style={{ borderTop: '1px solid var(--warm-border)' }}>
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block py-3 px-4 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors text-[14px]"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/signaler"
            onClick={() => setOpen(false)}
            className="block py-3 px-4 rounded-xl font-semibold text-[14px]"
            style={{ color: 'var(--navy)' }}
          >
            J&apos;ai quelque chose pour quelqu&apos;un
          </Link>
          <Link
            href="/connexion"
            onClick={() => setOpen(false)}
            className="block py-3 px-4 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors text-[13px]"
          >
            Se connecter →
          </Link>
        </div>
      )}
    </nav>
  )
}
