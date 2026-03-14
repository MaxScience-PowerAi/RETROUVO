'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  Users, User, Star, Globe, Zap, Handshake, Heart,
  Search, RefreshCw, UserPlus, MapPin, Calendar,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { CommunityRole } from '@/lib/types'

// ─── Types ───────────────────────────────────────────────
interface Membre {
  id:        number
  prenom:    string
  ville:     string
  role:      CommunityRole
  statut:    string
  joined_at: string
}

type FilterTab = 'tous' | CommunityRole

// ─── Config rôles ────────────────────────────────────────
const ROLE_CONFIG: Record<CommunityRole, {
  label: string; icon: React.ElementType; color: string; bg: string
}> = {
  citoyen:    { label: 'Citoyen actif',        icon: User,      color: 'var(--navy)',     bg: 'rgba(30,58,138,.07)'   },
  samaritain: { label: 'Samaritain de terrain', icon: Star,      color: 'var(--cm-green)', bg: 'rgba(0,122,94,.07)'    },
  relais:     { label: 'Point relais',          icon: Globe,     color: '#92700a',         bg: 'rgba(146,112,10,.07)'  },
  technique:  { label: 'Volontaire technique',  icon: Zap,       color: '#7c3aed',         bg: 'rgba(124,58,237,.07)'  },
  partenaire: { label: 'Partenaire',            icon: Handshake, color: '#0891b2',         bg: 'rgba(8,145,178,.07)'   },
  ami:        { label: 'Ami de la cause',       icon: Heart,     color: 'var(--cm-red)',   bg: 'rgba(206,17,38,.07)'   },
}

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'tous',       label: 'Tous'        },
  { id: 'citoyen',    label: 'Citoyens'    },
  { id: 'samaritain', label: 'Samaritains' },
  { id: 'relais',     label: 'Relais'      },
  { id: 'technique',  label: 'Techniques'  },
  { id: 'partenaire', label: 'Partenaires' },
  { id: 'ami',        label: 'Amis'        },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function FamilleClient() {
  const [membres, setMembres]       = useState<Membre[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)
  const [activeTab, setActiveTab]   = useState<FilterTab>('tous')
  const [search, setSearch]         = useState('')

  // ── Charger les membres actifs ──────────────────────────
  const fetchMembres = async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('membres')
      .select('*')
      .eq('statut', 'actif')
      .order('joined_at', { ascending: false })

    if (err) {
      setError('Connexion Supabase impossible. Vérifie tes variables d\'environnement.')
    } else {
      setMembres(data ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMembres()

    // ── Temps réel : ajout / suppression automatique ──────
    const channel = supabase
      .channel('membres_realtime')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'membres' },
        (payload) => {
          const newMembre = payload.new as Membre
          if (newMembre.statut === 'actif') {
            setMembres(prev => [newMembre, ...prev])
          }
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'membres' },
        (payload) => {
          const updated = payload.new as Membre
          if (updated.statut !== 'actif') {
            // Membre retiré/suspendu → on le supprime de la liste
            setMembres(prev => prev.filter(m => m.id !== updated.id))
          } else {
            // Membre réactivé → on le met à jour
            setMembres(prev => {
              const exists = prev.find(m => m.id === updated.id)
              if (exists) {
                return prev.map(m => m.id === updated.id ? updated : m)
              }
              return [updated, ...prev]
            })
          }
        }
      )
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'membres' },
        (payload) => {
          const deleted = payload.old as Membre
          setMembres(prev => prev.filter(m => m.id !== deleted.id))
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  // ── Filtrage ────────────────────────────────────────────
  const filtered = useMemo(() => {
    return membres.filter(m => {
      const matchTab = activeTab === 'tous' || m.role === activeTab
      const matchSearch = search.trim() === '' ||
        m.prenom.toLowerCase().includes(search.toLowerCase()) ||
        m.ville.toLowerCase().includes(search.toLowerCase())
      return matchTab && matchSearch
    })
  }, [membres, activeTab, search])

  // ── Statistiques ────────────────────────────────────────
  const stats = useMemo(() => ({
    total:       membres.length,
    citoyens:    membres.filter(m => m.role === 'citoyen').length,
    samaritains: membres.filter(m => m.role === 'samaritain').length,
    autres:      membres.filter(m => !['citoyen', 'samaritain'].includes(m.role)).length,
  }), [membres])

  return (
    <div className="space-y-10">

      {/* ── Hero ── */}
      <div className="hero-soft rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden">
        <div className="relative z-10 space-y-5 max-w-2xl mx-auto">
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto"
            style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)' }}
          >
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-serif text-white" style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 600 }}>
            La Famille RETROUVO
          </h1>
          <p className="font-medium" style={{ color: 'rgba(255,255,255,.75)', fontSize: '16px', lineHeight: 1.85 }}>
            Chaque nom ici représente un citoyen qui a choisi de faire partie de quelque chose
            de plus grand que lui. Bienvenue dans la famille.
          </p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total membres',  value: String(stats.total),       color: 'var(--navy)',     icon: Users     },
          { label: 'Citoyens',       value: String(stats.citoyens),    color: 'var(--navy)',     icon: User      },
          { label: 'Samaritains',    value: String(stats.samaritains), color: 'var(--cm-green)', icon: Star      },
          { label: 'Autres rôles',   value: String(stats.autres),      color: '#7c3aed',         icon: Handshake },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border p-5 space-y-3" style={{ borderColor: 'var(--warm-border)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${s.color}14` }}>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <div>
              <p className="font-syne font-bold" style={{ fontSize: '26px', color: s.color }}>{s.value}</p>
              <p className="text-slate-400 font-medium" style={{ fontSize: '11px', marginTop: '2px' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Erreur Supabase ── */}
      {error && (
        <div className="rounded-2xl p-5" style={{ background: 'rgba(206,17,38,.05)', border: '1px solid rgba(206,17,38,.2)' }}>
          <p className="text-[13px] font-medium" style={{ color: 'var(--cm-red)' }}>⚠ {error}</p>
        </div>
      )}

      {/* ── Barre d'actions ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="bg-white rounded-2xl border p-3 flex-1 w-full" style={{ borderColor: 'var(--warm-border)' }}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un membre..."
              className="input-soft w-full py-4 pl-12 pr-6 bg-slate-50 rounded-xl font-medium border outline-none transition-all"
              style={{ fontSize: '14px', borderColor: 'var(--warm-border)' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchMembres}
            className="p-3 rounded-xl border bg-white hover:bg-slate-50 transition-colors"
            style={{ borderColor: 'var(--warm-border)' }}
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/rejoindre"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-semibold text-[12px] transition-all hover:opacity-90"
            style={{ background: 'var(--navy)', letterSpacing: '0.02em' }}
          >
            <UserPlus className="w-4 h-4" /> Rejoindre
          </Link>
        </div>
      </div>

      {/* ── Onglets rôle ── */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex-wrap gap-1 w-fit">
        {FILTER_TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === tab.id ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'
            }`} style={{ letterSpacing: '0.07em' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Indicateur temps réel ── */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full animate-gentle-pulse" style={{ background: 'var(--cm-green)' }} />
        <span className="text-slate-400 font-medium" style={{ fontSize: '11px', letterSpacing: '0.06em' }}>
          Mise à jour en temps réel — les membres apparaissent et disparaissent automatiquement
        </span>
      </div>

      {/* ── Chargement ── */}
      {loading && (
        <div className="bg-white rounded-2xl border p-16 text-center" style={{ borderColor: 'var(--warm-border)' }}>
          <RefreshCw className="w-8 h-8 text-slate-300 mx-auto mb-3 animate-spin" />
          <p className="text-slate-400 font-medium" style={{ fontSize: '14px' }}>Chargement de la famille...</p>
        </div>
      )}

      {/* ── Page vide ── */}
      {!loading && membres.length === 0 && !error && (
        <div className="bg-white rounded-2xl border p-16 text-center space-y-5" style={{ borderColor: 'var(--warm-border)' }}>
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto" style={{ background: 'rgba(30,58,138,.06)' }}>
            <Users className="w-10 h-10" style={{ color: 'var(--navy)' }} />
          </div>
          <div className="space-y-2">
            <h2 className="font-syne text-slate-900" style={{ fontSize: '24px' }}>La famille commence ici</h2>
            <p className="text-slate-400 font-medium max-w-sm mx-auto" style={{ fontSize: '14px', lineHeight: 1.75 }}>
              Dès qu&apos;un citoyen rejoint le mouvement, son nom apparaîtra automatiquement ici.
              Sois le premier.
            </p>
          </div>
          <Link
            href="/rejoindre"
            className="inline-flex items-center gap-2 mt-4 px-8 py-4 rounded-2xl text-white font-semibold text-[14px] transition-all hover:opacity-90"
            style={{ background: 'var(--navy)' }}
          >
            <UserPlus className="w-5 h-5" /> Rejoindre RETROUVO
          </Link>
        </div>
      )}

      {/* ── Grille des membres ── */}
      {!loading && filtered.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(membre => {
            const cfg = ROLE_CONFIG[membre.role] ?? ROLE_CONFIG.citoyen
            const Icon = cfg.icon
            return (
              <div
                key={membre.id}
                className="bg-white rounded-2xl border p-6 space-y-4 hover:shadow-md transition-shadow"
                style={{ borderColor: 'var(--warm-border)', borderLeft: `3px solid ${cfg.color}` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center font-syne font-bold text-white"
                      style={{ background: cfg.color, fontSize: '16px' }}
                    >
                      {membre.prenom.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-syne text-slate-900" style={{ fontSize: '17px' }}>
                        {membre.prenom}
                      </h3>
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold"
                        style={{ fontSize: '10px', background: cfg.bg, color: cfg.color, letterSpacing: '0.05em' }}
                      >
                        <Icon className="w-3 h-3" /> {cfg.label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600">
                    <MapPin className="w-3 h-3" style={{ color: cfg.color }} /> {membre.ville}
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400">
                    <Calendar className="w-3 h-3" /> {formatDate(membre.joined_at)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Aucun résultat pour le filtre ── */}
      {!loading && membres.length > 0 && filtered.length === 0 && (
        <div className="bg-white rounded-2xl border p-12 text-center" style={{ borderColor: 'var(--warm-border)' }}>
          <p className="text-slate-400 font-medium" style={{ fontSize: '14px' }}>
            Aucun membre trouvé pour ce filtre.
          </p>
        </div>
      )}

      {/* ── Compteur total ── */}
      {membres.length > 0 && (
        <div
          className="rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ background: 'var(--navy-dark)' }}
        >
          <div>
            <p className="font-semibold uppercase text-blue-300" style={{ fontSize: '11px', letterSpacing: '0.12em' }}>
              La Famille RETROUVO
            </p>
            <p className="text-white font-medium mt-1" style={{ fontSize: '13px', opacity: 0.7 }}>
              Chaque membre compte. Chaque geste honnête bâtit le Cameroun qu&apos;on veut.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="font-syne font-bold text-white" style={{ fontSize: '28px' }}>{stats.total}</p>
              <p className="text-slate-400 font-medium" style={{ fontSize: '11px' }}>Membres actifs</p>
            </div>
            <Link
              href="/rejoindre"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-[12px] transition-all hover:opacity-90"
              style={{ background: 'var(--cm-green)', color: '#fff', letterSpacing: '0.02em' }}
            >
              <UserPlus className="w-4 h-4" /> Rejoindre
            </Link>
          </div>
        </div>
      )}

    </div>
  )
}
