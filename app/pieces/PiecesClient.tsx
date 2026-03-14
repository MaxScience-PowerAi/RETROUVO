'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, MapPin, User, Edit3, Plus, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { DOC_TYPES, QUARTIERS_RELAIS, calculateSamaritainGain, type DocType, type FoundItem } from '@/lib/types'

interface LossItem { type: DocType; name: string }

export default function PiecesClient() {
  const [subView, setSubView]       = useState<'browse' | 'loss'>('browse')
  const [items, setItems]           = useState<FoundItem[]>([])
  const [loading, setLoading]       = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [lossItems, setLossItems]   = useState<LossItem[]>([{ type: 'CNI', name: '' }])
  const [lossPhone, setLossPhone]   = useState('')
  const [lossCity, setLossCity]     = useState('Douala')
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast]           = useState('')

  // ── Charger les pièces depuis Supabase ──
  useEffect(() => {
    async function load() {
      setLoading(true)
      let query = supabase
        .from('found_items')
        .select('*')
        .eq('status', 'Disponible')
        .order('created_at', { ascending: false })

      if (searchQuery.trim()) {
        query = query.ilike('name', `%${searchQuery}%`)
      }

      const { data, error } = await query
      if (!error && data) setItems(data)
      setLoading(false)
    }
    load()
  }, [searchQuery])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 5000)
  }

  const addRow    = () => setLossItems(p => [...p, { type: 'CNI', name: '' }])
  const removeRow = (i: number) => setLossItems(p => p.length > 1 ? p.filter((_, x) => x !== i) : p)
  const updateRow = (i: number, f: keyof LossItem, v: string) =>
    setLossItems(p => p.map((item, x) => x === i ? { ...item, [f]: v } : item))

  // ── Soumettre signalement de perte ──
  const handleLossSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const inserts = lossItems.map(item => ({
      doc_type: item.type,
      doc_name: item.name,
      phone:    lossPhone,
      city:     lossCity,
    }))
    const { error } = await supabase.from('loss_reports').insert(inserts)
    setSubmitting(false)
    if (error) {
      showToast('Une erreur est survenue. Réessaie.')
    } else {
      showToast('On veille pour toi. Dès qu\'un signe apparaît, tu seras le premier averti.')
      setLossItems([{ type: 'CNI', name: '' }])
      setLossPhone('')
      setSubView('browse')
    }
  }

  return (
    <div className="space-y-10">
      {toast && (
        <div className="fixed top-8 left-1/2 z-50 flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-medium shadow-2xl toast-in"
          style={{ background: 'var(--cm-green)', transform: 'translateX(-50%)' }}>
          {toast}
        </div>
      )}

      {/* Onglets */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit mx-auto border border-slate-200">
        {([['Pièces trouvées', 'browse'], ['Signaler une perte', 'loss']] as const).map(([l, v]) => (
          <button key={v} onClick={() => setSubView(v)}
            className={`px-8 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${subView === v ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* ── Parcourir ── */}
      {subView === 'browse' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border p-4 shadow-sm" style={{ borderColor: 'var(--warm-border)' }}>
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
              <input type="text" placeholder="Rechercher le nom écrit sur la pièce..."
                className="input-soft w-full py-5 pl-14 pr-6 bg-slate-50 rounded-xl font-medium border outline-none transition-all"
                style={{ fontSize: '16px', borderColor: 'var(--warm-border)' }}
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl p-16 text-center border" style={{ borderColor: 'var(--warm-border)' }}>
              <div className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-3"
                style={{ borderColor: 'var(--cm-green)', borderTopColor: 'transparent' }} />
              <p className="text-slate-400 font-medium text-sm">Chargement...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center border" style={{ borderColor: 'var(--warm-border)' }}>
              <Search className="w-8 h-8 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 font-medium text-sm">
                {searchQuery ? 'Aucune pièce trouvée pour ce nom.' : 'Aucune pièce disponible pour l\'instant.'}
              </p>
              <p className="text-slate-300 font-medium text-xs mt-1">Les pièces signalées par les Samaritains apparaîtront ici.</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id}
                className="bg-white rounded-2xl border shadow-sm cm-stripe-green flex flex-col md:flex-row justify-between items-center gap-6 p-8 hover:shadow-md transition-shadow"
                style={{ borderColor: 'var(--warm-border)' }}>
                <div className="space-y-3 w-full">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                    style={{ background: 'rgba(30,58,138,.06)', color: 'var(--navy)' }}>
                    {DOC_TYPES[item.type]?.label}
                  </span>
                  <h2 className="font-syne text-slate-900 text-[28px]">{item.name}</h2>
                  <div className="flex flex-wrap gap-3">
                    <span className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-full text-xs font-medium text-slate-600">
                      <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--navy)' }} /> {item.area}
                    </span>
                    <span className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-full text-xs font-medium text-slate-600">
                      <User className="w-3.5 h-3.5" style={{ color: 'var(--navy)' }} /> {item.finder_name}
                    </span>
                    <span className="bg-slate-50 border border-slate-100 px-3 py-2 rounded-full text-xs font-medium text-slate-400">
                      {new Date(item.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
                <div className="text-center md:text-right space-y-3 flex-shrink-0">
                  <div>
                    <p className="text-slate-400 font-medium text-xs uppercase" style={{ letterSpacing: '0.1em' }}>Geste de reconnaissance</p>
                    <p className="font-serif font-semibold text-[32px]" style={{ color: 'var(--navy)' }}>
                      {item.custom_price.toLocaleString()} FCFA
                    </p>
                  </div>
                  <Link href={`/chat/${item.id}`}
                    className="block px-8 py-3 rounded-xl text-white font-semibold text-xs uppercase tracking-wider transition-all hover:opacity-90"
                    style={{ background: 'var(--navy-dark)' }}>
                    Prendre contact
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Signaler une perte ── */}
      {subView === 'loss' && (
        <div className="bg-white rounded-[2rem] border shadow-sm p-10 max-w-2xl mx-auto space-y-8"
          style={{ borderColor: 'var(--warm-border)' }}>
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
              style={{ background: 'rgba(30,58,138,.06)' }}>
              <Edit3 className="w-7 h-7" style={{ color: 'var(--navy)' }} />
            </div>
            <h2 className="font-syne text-slate-900 text-[28px]">Signaler une perte</h2>
            <p className="text-slate-500 font-medium text-sm" style={{ lineHeight: 1.75 }}>
              Tu perds du temps à cause de ce document manquant. On veille pour toi — dès qu&apos;un signe apparaît, tu seras le premier averti.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLossSubmit}>
            <div className="space-y-3">
              {lossItems.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl border relative" style={{ background: 'var(--warm)', borderColor: 'var(--warm-border)' }}>
                  <div className="flex justify-between items-center mb-4">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: 'var(--navy)', fontSize: '11px' }}>#{idx + 1}</span>
                    {lossItems.length > 1 && (
                      <button type="button" onClick={() => removeRow(idx)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <select value={item.type} onChange={e => updateRow(idx, 'type', e.target.value)}
                      className="input-soft w-full p-4 bg-white border rounded-xl font-medium text-sm outline-none appearance-none"
                      style={{ borderColor: 'var(--warm-border)' }}>
                      {Object.entries(DOC_TYPES).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                    <input required type="text" value={item.name}
                      onChange={e => updateRow(idx, 'name', e.target.value)}
                      placeholder="Nom complet sur la pièce..."
                      className="input-soft w-full p-4 bg-white border rounded-xl font-semibold uppercase text-sm outline-none"
                      style={{ borderColor: 'var(--warm-border)' }} />
                  </div>
                </div>
              ))}
            </div>

            <button type="button" onClick={addRow}
              className="w-full py-4 border-2 border-dashed rounded-2xl font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2 text-slate-400 hover:bg-slate-50 transition-all"
              style={{ borderColor: 'var(--warm-border)' }}>
              <Plus className="w-4 h-4" /> Ajouter un document
            </button>

            <div className="grid md:grid-cols-2 gap-4">
              <select value={lossCity} onChange={e => setLossCity(e.target.value)}
                className="input-soft w-full p-4 bg-slate-50 border rounded-xl font-semibold outline-none appearance-none"
                style={{ borderColor: 'var(--warm-border)' }}>
                <option>Douala</option>
                <option>Yaoundé</option>
              </select>
            </div>

            <div className="p-5 rounded-2xl border" style={{ background: 'rgba(30,58,138,.03)', borderColor: 'rgba(30,58,138,.1)' }}>
              <label className="text-xs font-semibold uppercase text-slate-400 block mb-2" style={{ letterSpacing: '0.1em' }}>
                Numéro pour alerte SMS
              </label>
              <input required type="tel" value={lossPhone} onChange={e => setLossPhone(e.target.value)}
                placeholder="Ton numéro valide..."
                className="input-soft w-full p-4 bg-white border rounded-xl font-mono font-bold text-center tracking-widest outline-none"
                style={{ borderColor: 'var(--warm-border)' }} />
            </div>

            <button type="submit" disabled={submitting}
              className="w-full py-5 rounded-2xl text-white font-semibold uppercase tracking-wider transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: 'var(--navy)' }}>
              {submitting ? 'Enregistrement...' : 'Activer la veille nationale'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
