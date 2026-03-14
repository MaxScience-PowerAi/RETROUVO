'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  FileText, ArrowUpRight, ArrowDownLeft,
  CheckCircle2, Heart, TrendingUp, Calendar, RefreshCw,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAgenceGuard } from '@/lib/useAgenceGuard'

// ─── Types ───────────────────────────────────────────────
type EntryType = 'objet_rendu' | 'objet_recu' | 'personne_retrouvee' | 'depot_recu' | 'transfert_envoye'
type FilterTab = 'tout' | 'objets' | 'personnes' | 'depots'

interface HistoryEntry {
  id:         number
  type:       EntryType
  titre:      string
  detail:     string
  montant:    number
  signe:      '+' | '-' | '0'
  methode:    string | null
  ville:      string | null
  quartier:   string | null
  created_at: string
}

const TYPE_CONFIG: Record<EntryType, {
  label: string; bg: string; text: string; dot: string; icon: React.ElementType
}> = {
  objet_rendu:        { label: 'Objet récupéré',  bg: 'rgba(0,122,94,.07)',   text: '#007a5e', dot: '#007a5e', icon: CheckCircle2  },
  objet_recu:         { label: 'Objet signalé',   bg: 'rgba(30,58,138,.07)',  text: '#1e3a8a', dot: '#1e3a8a', icon: FileText      },
  personne_retrouvee: { label: 'Famille réunie',  bg: 'rgba(206,17,38,.07)', text: '#9a0c1c', dot: '#ce1126', icon: Heart         },
  depot_recu:         { label: 'Don reçu',        bg: 'rgba(30,58,138,.07)', text: '#1e3a8a', dot: '#1e3a8a', icon: ArrowDownLeft },
  transfert_envoye:   { label: 'Transfert envoyé',bg: 'rgba(146,112,10,.1)', text: '#92700a', dot: '#b45309', icon: ArrowUpRight  },
}

const FILTER_MAP: Record<FilterTab, EntryType[] | 'all'> = {
  tout:      'all',
  objets:    ['objet_rendu', 'objet_recu'],
  personnes: ['personne_retrouvee'],
  depots:    ['depot_recu', 'transfert_envoye'],
}

const TABS: { id: FilterTab; label: string }[] = [
  { id: 'tout',      label: 'Tout'              },
  { id: 'objets',    label: 'Objets'            },
  { id: 'personnes', label: 'Personnes'         },
  { id: 'depots',    label: 'Dépôts & Transferts' },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function HistoriqueClient() {
  // ── Garde agence — redirige si pas autorisé ────────────
  const authorized = useAgenceGuard()

  const [entries, setEntries]     = useState<HistoryEntry[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<FilterTab>('tout')
  const [search, setSearch]       = useState('')

  const fetchEntries = async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('historique')
      .select('*')
      .order('created_at', { ascending: false })

    if (err) setError('Connexion Supabase impossible. Vérifie les variables d\'environnement.')
    else     setEntries(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (!authorized) return

    fetchEntries()

    // Écoute en temps réel
    const channel = supabase
      .channel('historique_realtime')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'historique' },
        (payload) => setEntries(prev => [payload.new as HistoryEntry, ...prev])
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [authorized])

  const filtered = useMemo(() => {
    const types = FILTER_MAP[activeTab]
    return entries.filter(e => {
      const matchType   = types === 'all' || types.includes(e.type)
      const matchSearch = search.trim() === '' ||
        e.titre.toLowerCase().includes(search.toLowerCase()) ||
        (e.detail ?? '').toLowerCase().includes(search.toLowerCase())
      return matchType && matchSearch
    })
  }, [entries, activeTab, search])

  const stats = useMemo(() => ({
    objetsRendus:     entries.filter(e => e.type === 'objet_rendu').length,
    personnesReunies: entries.filter(e => e.type === 'personne_retrouvee').length,
    totalRecu:        entries.filter(e => e.signe === '+').reduce((s, e) => s + (e.montant ?? 0), 0),
    totalEnvoye:      entries.filter(e => e.signe === '-').reduce((s, e) => s + (e.montant ?? 0), 0),
  }), [entries])

  // Pendant la vérification d'autorisation — écran blanc discret
  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-slate-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* En-tête */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-2"
            style={{ background: 'rgba(0,122,94,.08)', border: '1px solid rgba(0,122,94,.2)' }}
          >
            <div className="w-2 h-2 rounded-full animate-gentle-pulse" style={{ background: 'var(--cm-green)' }} />
            <span className="font-semibold text-[11px] uppercase" style={{ color: 'var(--cm-green)', letterSpacing: '0.1em' }}>
              Espace Agence — Accès privé
            </span>
          </div>
          <h1 className="font-syne text-slate-900" style={{ fontSize: '32px', letterSpacing: '-0.02em' }}>
            Historique complet
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-[13px]"
            style={{ background: 'rgba(0,122,94,.08)', border: '1px solid rgba(0,122,94,.2)', color: 'var(--cm-green)' }}
          >
            <Calendar className="w-4 h-4" />
            Temps réel
          </div>
          <button
            onClick={fetchEntries}
            className="p-2.5 rounded-xl border bg-white hover:bg-slate-50 transition-colors"
            style={{ borderColor: 'var(--warm-border)' }}
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Erreur Supabase */}
      {error && (
        <div className="rounded-2xl p-5" style={{ background: 'rgba(206,17,38,.05)', border: '1px solid rgba(206,17,38,.2)' }}>
          <p className="text-[13px] font-medium" style={{ color: 'var(--cm-red)' }}>⚠ {error}</p>
        </div>
      )}

      {/* Stats — visibles seulement si données */}
      {entries.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Pièces rendues',     value: String(stats.objetsRendus),             color: 'var(--cm-green)', icon: CheckCircle2  },
            { label: 'Familles réunies',   value: String(stats.personnesReunies),          color: 'var(--cm-red)',   icon: Heart         },
            { label: 'Total reçu (FCFA)',  value: stats.totalRecu.toLocaleString(),        color: 'var(--navy)',     icon: ArrowDownLeft },
            { label: 'Total envoyé (FCFA)',value: stats.totalEnvoye.toLocaleString(),      color: '#b45309',         icon: ArrowUpRight  },
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
      )}

      {/* Recherche */}
      {entries.length > 0 && (
        <div className="bg-white rounded-2xl border p-4" style={{ borderColor: 'var(--warm-border)' }}>
          <input
            type="text"
            placeholder="Rechercher dans l'historique..."
            className="input-soft w-full p-3 bg-slate-50 border rounded-xl font-medium outline-none transition-all"
            style={{ borderColor: 'var(--warm-border)', fontSize: '14px' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Onglets */}
      {entries.length > 0 && (
        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200 flex-wrap gap-1">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === tab.id ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'
              }`} style={{ letterSpacing: '0.07em' }}>
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Chargement */}
      {loading && (
        <div className="bg-white rounded-2xl border p-16 text-center" style={{ borderColor: 'var(--warm-border)' }}>
          <RefreshCw className="w-8 h-8 text-slate-300 mx-auto mb-3 animate-spin" />
          <p className="text-slate-400 font-medium" style={{ fontSize: '14px' }}>Chargement de l'historique...</p>
        </div>
      )}

      {/* Page vide */}
      {!loading && entries.length === 0 && !error && (
        <div className="bg-white rounded-2xl border p-16 text-center space-y-5" style={{ borderColor: 'var(--warm-border)' }}>
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto" style={{ background: 'rgba(0,122,94,.06)' }}>
            <TrendingUp className="w-10 h-10" style={{ color: 'var(--cm-green)' }} />
          </div>
          <div className="space-y-2">
            <h2 className="font-syne text-slate-900" style={{ fontSize: '24px' }}>L'histoire commence maintenant</h2>
            <p className="text-slate-400 font-medium max-w-sm mx-auto" style={{ fontSize: '14px', lineHeight: 1.75 }}>
              Cette page se remplira automatiquement dès qu'une pièce sera signalée, récupérée,
              qu'un proche sera retrouvé, ou qu'un don sera reçu.
            </p>
            <p className="text-slate-300 font-medium" style={{ fontSize: '12px', marginTop: '12px' }}>
              Aucune activité enregistrée pour l'instant.
            </p>
          </div>
        </div>
      )}

      {/* Liste */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map(entry => {
            const cfg  = TYPE_CONFIG[entry.type]
            const Icon = cfg.icon
            return (
              <div key={entry.id}
                className="bg-white rounded-2xl border flex items-center gap-5 p-5 hover:shadow-sm transition-shadow"
                style={{ borderColor: 'var(--warm-border)', borderLeft: `3px solid ${cfg.dot}` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: cfg.bg }}>
                  <Icon className="w-5 h-5" style={{ color: cfg.text }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-900 truncate" style={{ fontSize: '14px' }}>{entry.titre}</span>
                    <span className="inline-block rounded-full px-3 py-0.5 font-semibold flex-shrink-0"
                      style={{ fontSize: '11px', background: cfg.bg, color: cfg.text }}>{cfg.label}</span>
                    {entry.methode && (
                      <span className="inline-block rounded-full px-3 py-0.5 font-medium flex-shrink-0"
                        style={{ fontSize: '11px', background: '#f1f5f9', color: '#64748b' }}>{entry.methode}</span>
                    )}
                  </div>
                  {entry.detail && (
                    <p className="text-slate-500 font-medium truncate" style={{ fontSize: '12px' }}>
                      {entry.detail}{entry.quartier ? ` · ${entry.quartier}` : ''}{entry.ville ? `, ${entry.ville}` : ''}
                    </p>
                  )}
                  <p className="text-slate-400 font-medium mt-1" style={{ fontSize: '11px' }}>{formatDate(entry.created_at)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  {entry.signe === '0' ? (
                    <div>
                      <p className="font-semibold" style={{ fontSize: '15px', color: 'var(--cm-red)' }}>Gratuit</p>
                      <p className="text-slate-400 font-medium" style={{ fontSize: '11px', marginTop: '2px' }}>Service humain</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold" style={{ fontSize: '17px', color: entry.signe === '+' ? 'var(--cm-green)' : '#b45309' }}>
                        {entry.signe === '+' ? '+' : '−'}{(entry.montant ?? 0).toLocaleString()} FCFA
                      </p>
                      <p className="text-slate-400 font-medium" style={{ fontSize: '11px', marginTop: '2px' }}>
                        {entry.signe === '+' ? 'Reçu' : 'Envoyé'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Aucun résultat pour ce filtre */}
      {!loading && entries.length > 0 && filtered.length === 0 && (
        <div className="bg-white rounded-2xl border p-12 text-center" style={{ borderColor: 'var(--warm-border)' }}>
          <p className="text-slate-400 font-medium" style={{ fontSize: '14px' }}>Aucune entrée dans cette catégorie</p>
        </div>
      )}

      {/* Bilan total */}
      {entries.length > 0 && (
        <div className="rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          style={{ background: 'var(--navy-dark)' }}>
          <div>
            <p className="font-semibold uppercase text-blue-300" style={{ fontSize: '11px', letterSpacing: '0.12em' }}>Bilan de la période</p>
            <p className="text-white font-medium mt-1" style={{ fontSize: '13px', opacity: 0.7 }}>
              Total reçu − Total envoyé aux Samaritains = Solde agence
            </p>
          </div>
          <div className="flex items-center gap-5 flex-wrap">
            {[
              { v: `+${stats.totalRecu.toLocaleString()}`,                         l: 'FCFA reçus',  c: 'var(--cm-green)' },
              { v: '—',                                                             l: '',             c: '#475569'         },
              { v: stats.totalEnvoye.toLocaleString(),                             l: 'FCFA envoyés', c: '#fbbf24'         },
              { v: '=',                                                             l: '',             c: '#475569'         },
              { v: (stats.totalRecu - stats.totalEnvoye).toLocaleString(),         l: 'Solde agence', c: stats.totalRecu - stats.totalEnvoye >= 0 ? 'var(--cm-green)' : 'var(--cm-red)' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <p className="font-syne font-bold" style={{ fontSize: '22px', color: item.c }}>{item.v}</p>
                {item.l && <p className="text-slate-400 font-medium" style={{ fontSize: '11px' }}>{item.l}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
