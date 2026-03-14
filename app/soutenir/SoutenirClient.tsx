'use client'

import { useState } from 'react'
import { HandHeart, CheckCircle2 } from 'lucide-react'
import { DONATION_PRESETS } from '@/lib/types'
import { logHistorique } from '@/lib/historique'

const AGENCY_NUMBERS = {
  momo: { number: '[NUMÉRO MTN AGENCE]',    name: 'RETROUVO AGENCE', color: '#f59e0b' },
  om:   { number: '[NUMÉRO ORANGE AGENCE]', name: 'RETROUVO AGENCE', color: '#f97316' },
}

export default function SoutenirClient() {
  const [amount, setAmount]       = useState('')
  const [preset, setPreset]       = useState<number | null>(null)
  const [method, setMethod]       = useState<'momo' | 'om'>('momo')
  const [donorName, setDonorName] = useState('')
  const [message, setMessage]     = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || parseInt(amount) < 100) return
    setLoading(true)

    await logHistorique({
      type:    'depot_recu',
      titre:   'Don reçu',
      detail:  `Donateur : ${donorName || 'Anonyme'}${message ? ` — "${message}"` : ''}`,
      montant: parseInt(amount),
      signe:   '+',
      methode: method === 'momo' ? 'MTN MoMo' : 'Orange Money',
    })

    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center space-y-8 py-20">
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto animate-heartbeat"
          style={{ background: 'rgba(0,122,94,.1)' }}>
          <CheckCircle2 className="w-12 h-12" style={{ color: 'var(--cm-green)' }} />
        </div>
        <div className="space-y-3">
          <h2 className="font-syne text-slate-900 text-[32px]">Merci du fond du cœur.</h2>
          <p className="text-slate-500 font-medium max-w-md mx-auto text-[15px]" style={{ lineHeight: 1.8 }}>
            Ton soutien de {parseInt(amount).toLocaleString()} FCFA est enregistré.
            Chaque franc reçu sert exclusivement à maintenir RETROUVO actif.
          </p>
        </div>
        <button onClick={() => { setSubmitted(false); setAmount(''); setPreset(null) }}
          className="px-8 py-4 rounded-2xl font-semibold text-white transition-all hover:opacity-90"
          style={{ background: 'var(--navy)', fontSize: '14px' }}>
          Faire un autre don
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="hero-soft rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden">
        <div className="relative z-10 space-y-5 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto animate-heartbeat"
            style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)' }}>
            <HandHeart className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-serif text-white" style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 600 }}>
            Soutenir ce travail
          </h1>
          <p className="font-medium" style={{ color: 'rgba(255,255,255,.75)', fontSize: '16px', lineHeight: 1.85 }}>
            Cette plateforme tourne grâce à des gens comme toi. Si tu veux nous soutenir,
            nous t&apos;en serons reconnaissants pour toujours.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] border p-10 space-y-8"
        style={{ borderColor: 'var(--warm-border)', borderBottom: '4px solid var(--cm-green)' }}>

        {/* Montants preset */}
        <div>
          <label className="block font-medium text-slate-600 mb-4 text-[14px]">
            Choisis un montant
          </label>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
            {DONATION_PRESETS.map(amt => (
              <button key={amt} type="button"
                className={`amt-btn ${preset === amt ? 'selected' : ''}`}
                onClick={() => { setPreset(amt); setAmount(String(amt)) }}>
                {amt.toLocaleString()}
                <span style={{ display: 'block', fontSize: '10px', fontWeight: 500, color: '#9ca3af', marginTop: '2px' }}>FCFA</span>
              </button>
            ))}
          </div>
          <div className="relative">
            <input type="number" min="100" placeholder="Ou un montant libre..."
              className="input-soft w-full p-5 bg-slate-50 border-2 rounded-2xl font-semibold text-2xl text-center font-mono tracking-wide outline-none transition-all"
              style={{ borderColor: 'var(--warm-border)' }}
              value={amount}
              onChange={e => { setAmount(e.target.value); setPreset(null) }} />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-semibold text-sm">FCFA</span>
          </div>
        </div>

        {/* Méthodes paiement */}
        <div className="space-y-4">
          {(['momo', 'om'] as const).map(m => {
            const info       = AGENCY_NUMBERS[m]
            const isSelected = method === m
            return (
              <div key={m} className="rounded-2xl border-2 p-5 transition-all"
                style={{ borderColor: isSelected ? info.color : 'var(--warm-border)', background: isSelected ? `${info.color}0d` : '#fff' }}>
                <button type="button" onClick={() => setMethod(m)} className="w-full flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold"
                      style={{ background: `${info.color}22`, color: info.color, fontSize: '15px' }}>
                      {m === 'momo' ? 'M' : 'O'}
                    </div>
                    <span className="font-semibold text-slate-800 text-[15px]">
                      {m === 'momo' ? 'MTN Mobile Money' : 'Orange Money'}
                    </span>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: isSelected ? info.color : '#d1d5db' }}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full" style={{ background: info.color }} />}
                  </div>
                </button>
                {isSelected && (
                  <div className="pt-3 border-t space-y-2" style={{ borderColor: `${info.color}44` }}>
                    <p className="text-xs font-semibold uppercase" style={{ color: info.color, letterSpacing: '0.1em' }}>
                      Numéro de l&apos;agence RETROUVO
                    </p>
                    <div className="flex items-center justify-center p-4 rounded-xl" style={{ background: `${info.color}14` }}>
                      <span className="font-mono font-black text-slate-800 text-[22px]" style={{ letterSpacing: '0.15em' }}>
                        {info.number}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-500">
                      Nom du compte : <strong>{info.name}</strong> — Envoie le montant puis clique ci-dessous.
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Infos optionnelles */}
        <div className="space-y-3">
          <input type="text" placeholder="Ton prénom (optionnel, tu peux rester anonyme)..."
            className="input-soft w-full p-4 bg-slate-50 border rounded-2xl font-medium outline-none transition-all"
            style={{ borderColor: 'var(--warm-border)' }}
            value={donorName} onChange={e => setDonorName(e.target.value)} />
          <textarea placeholder="Un mot pour nous ? (toujours lu avec gratitude)"
            className="input-soft w-full p-4 bg-slate-50 border rounded-2xl font-medium h-24 resize-none outline-none transition-all"
            style={{ borderColor: 'var(--warm-border)', fontSize: '14px', lineHeight: 1.7 }}
            value={message} onChange={e => setMessage(e.target.value)} />
        </div>

        {/* Récap */}
        {amount && parseInt(amount) > 0 && (
          <div className="rounded-2xl p-5 flex items-center justify-between"
            style={{ background: 'rgba(0,122,94,.05)', border: '1.5px solid rgba(0,122,94,.15)' }}>
            <span className="font-medium text-slate-600 text-[14px]">Ton soutien</span>
            <span className="font-serif font-semibold text-[32px]" style={{ color: 'var(--cm-green)' }}>
              {parseInt(amount).toLocaleString()} FCFA
            </span>
          </div>
        )}

        <button type="submit" disabled={loading || !amount || parseInt(amount) < 100}
          className="w-full py-5 rounded-2xl text-white font-semibold transition-all hover:opacity-90 active:scale-[0.99] flex items-center justify-center gap-3 disabled:opacity-50"
          style={{ background: 'var(--cm-green)', fontSize: '16px' }}>
          <HandHeart className="w-5 h-5" />
          {loading ? 'Enregistrement...' : "J'ai effectué mon virement — merci"}
        </button>
      </form>
    </div>
  )
}
