'use client'

import { useState } from 'react'
import {
  Camera, Heart, Layers, Scale, ShieldCheck, ShieldAlert,
  Plus, Trash2, CheckCircle2, FileText,
} from 'lucide-react'
import { DOC_TYPES, QUARTIERS_RELAIS, calculateSamaritainGain, type DocType } from '@/lib/types'
import { logHistorique } from '@/lib/historique'

type Category = 'item' | 'person'

interface ReportItem {
  type: DocType
  name: string
  estimatedValue: string
}

export default function SignalerClient() {
  const [category, setCategory]       = useState<Category>('item')
  const [reportItems, setReportItems] = useState<ReportItem[]>([{ type: 'CNI', name: '', estimatedValue: '' }])
  const [city, setCity]               = useState('Douala')
  const [quartier, setQuartier]       = useState('')
  const [finderPhone, setFinderPhone] = useState('')
  const [accountName, setAccountName] = useState('')
  const [personName, setPersonName]   = useState('')
  const [personAge, setPersonAge]     = useState('')
  const [personDesc, setPersonDesc]   = useState('')
  const [submitted, setSubmitted]     = useState(false)
  const [loading, setLoading]         = useState(false)

  const totalGain = reportItems.reduce((acc, item) =>
    acc + calculateSamaritainGain(item.type, item.estimatedValue), 0)

  const addRow    = () => setReportItems(p => [...p, { type: 'CNI', name: '', estimatedValue: '' }])
  const removeRow = (i: number) => setReportItems(p => p.length > 1 ? p.filter((_, x) => x !== i) : p)
  const updateRow = (i: number, f: keyof ReportItem, v: string) =>
    setReportItems(p => p.map((item, x) => x === i ? { ...item, [f]: v } : item))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (category === 'item') {
      // Enregistrer chaque pièce dans l'historique
      for (const item of reportItems) {
        const gain = calculateSamaritainGain(item.type, item.estimatedValue)
        await logHistorique({
          type:      'objet_recu',
          titre:     item.name || '[Nom non précisé]',
          detail:    `${DOC_TYPES[item.type]?.label} trouvée — Samaritain enregistré`,
          montant:   gain,
          signe:     '+',
          methode:   'MTN MoMo',
          ville:     city,
          quartier:  quartier,
        })
      }
    } else {
      // Signalement personne
      await logHistorique({
        type:    'objet_recu',
        titre:   personName || '[Citoyen protégé]',
        detail:  `Personne en sécurité — ${personAge ? personAge + ' ans' : 'âge inconnu'}. ${personDesc}`,
        montant: 0,
        signe:   '0',
        ville:   city,
        quartier: quartier,
      })
    }

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
          <h2 className="font-syne text-slate-900 text-[32px]">Ton geste est enregistré.</h2>
          <p className="text-slate-500 font-medium max-w-md mx-auto text-[15px]" style={{ lineHeight: 1.8 }}>
            {category === 'item'
              ? 'Une famille va bientôt respirer. Merci pour ce que tu as fait.'
              : 'Ce que tu fais ne se paie pas — ça se respecte et ça se salue.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[2rem] border shadow-sm p-10 md:p-14 space-y-10"
      style={{ borderColor: 'var(--warm-border)', borderBottom: '4px solid var(--navy)' }}>

      <header className="text-center space-y-4">
        <div className="rounded-2xl flex items-center justify-center mx-auto"
          style={{ background: category === 'item' ? 'rgba(30,58,138,.06)' : 'rgba(206,17,38,.06)', width: '72px', height: '72px' }}>
          {category === 'item'
            ? <FileText className="w-9 h-9" style={{ color: 'var(--navy)' }} />
            : <Heart className="w-9 h-9 animate-heartbeat" style={{ color: 'var(--cm-red)' }} />}
        </div>
        <h1 className="font-syne text-slate-900 text-[36px]" style={{ letterSpacing: '-0.02em' }}>
          J&apos;ai quelque chose pour quelqu&apos;un
        </h1>
        <p className="text-slate-500 font-medium max-w-lg mx-auto text-[14px]" style={{ lineHeight: 1.85 }}>
          Ce que tu fais là, c&apos;est rare. C&apos;est courageux.
        </p>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit mx-auto border border-slate-200">
          {(['item', 'person'] as const).map(cat => (
            <button key={cat} type="button" onClick={() => setCategory(cat)}
              className={`px-8 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${category === cat ? 'text-white shadow' : 'text-slate-500'}`}
              style={{ background: category === cat ? (cat === 'item' ? 'var(--navy)' : 'var(--cm-red)') : 'transparent', letterSpacing: '0.08em' }}>
              {cat === 'item' ? 'Un document' : 'Un être humain'}
            </button>
          ))}
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Identité samaritain */}
        <div className="p-6 rounded-2xl" style={{ background: 'var(--navy-dark)' }}>
          <span className="flex items-center gap-2 font-semibold uppercase mb-3 text-blue-300"
            style={{ fontSize: '11px', letterSpacing: '0.12em' }}>
            <ShieldCheck className="w-4 h-4" /> Ton identité — protégée par RETROUVO
          </span>
          <input required type="text" placeholder="Ton nom complet..."
            className="input-soft w-full p-4 rounded-xl font-semibold uppercase outline-none transition-all"
            style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', color: '#fff', fontSize: '16px' }} />
        </div>

        {/* Formulaire document */}
        {category === 'item' && (
          <div className="space-y-6">
            <label className="relative block rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer hover:bg-blue-50 transition-colors"
              style={{ borderColor: 'rgba(30,58,138,.2)', background: 'rgba(30,58,138,.02)' }}>
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
              <Camera className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--navy)' }} />
              <p className="font-semibold text-slate-700 text-[14px]">Ajoute une photo datée</p>
              <p className="text-slate-400 font-medium text-[12px] mt-1">La pièce avec la date visible</p>
            </label>

            <div className="space-y-3">
              {reportItems.map((item, idx) => (
                <div key={idx} className="p-5 rounded-xl border relative"
                  style={{ background: 'var(--warm)', borderColor: 'var(--warm-border)' }}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow"
                      style={{ background: 'var(--navy)', fontSize: '11px' }}>#{idx + 1}</span>
                    {reportItems.length > 1 && (
                      <button type="button" onClick={() => removeRow(idx)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <select value={item.type} onChange={e => updateRow(idx, 'type', e.target.value)}
                      className="input-soft w-full p-4 bg-white border rounded-xl font-medium text-sm appearance-none outline-none"
                      style={{ borderColor: 'var(--warm-border)' }}>
                      {Object.entries(DOC_TYPES).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                    <input required type="text" value={item.name}
                      onChange={e => updateRow(idx, 'name', e.target.value)}
                      placeholder="Nom précis sur la pièce..."
                      className="input-soft w-full p-4 bg-white border rounded-xl font-semibold text-sm uppercase outline-none"
                      style={{ borderColor: 'var(--warm-border)' }} />
                  </div>
                  {item.type === 'OTHER' && (
                    <input type="number" min="0" value={item.estimatedValue}
                      onChange={e => updateRow(idx, 'estimatedValue', e.target.value)}
                      placeholder="Estimation reconnaissance (FCFA)..."
                      className="input-soft w-full p-4 border rounded-xl font-bold text-lg outline-none mt-3"
                      style={{ background: '#fffbeb', borderColor: '#fde68a', color: '#92700a' }} />
                  )}
                </div>
              ))}
            </div>

            <button type="button" onClick={addRow}
              className="w-full py-4 border-2 border-dashed rounded-2xl font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2 text-slate-400 hover:bg-slate-50 transition-all"
              style={{ borderColor: 'var(--warm-border)', letterSpacing: '0.08em' }}>
              <Plus className="w-4 h-4" /> Ajouter un autre document
            </button>
          </div>
        )}

        {/* Formulaire humain */}
        {category === 'person' && (
          <div className="rounded-2xl border-2 border-dashed p-8 space-y-4"
            style={{ borderColor: 'rgba(206,17,38,.2)', background: 'rgba(206,17,38,.02)' }}>
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" value={personName} onChange={e => setPersonName(e.target.value)}
                placeholder="Nom du citoyen (si connu)..."
                className="input-soft w-full p-4 bg-white border border-red-100 rounded-2xl font-semibold uppercase outline-none" />
              <input type="text" value={personAge} onChange={e => setPersonAge(e.target.value)}
                placeholder="Âge estimé..."
                className="input-soft w-full p-4 bg-white border border-red-100 rounded-2xl font-medium outline-none" />
            </div>
            <textarea required value={personDesc} onChange={e => setPersonDesc(e.target.value)}
              placeholder="Décris son état et l'endroit précis où tu le protèges..."
              className="input-soft w-full p-4 bg-white border border-red-100 rounded-2xl font-medium h-28 outline-none resize-none"
              style={{ fontSize: '14px', lineHeight: 1.7 }} />
            <div className="flex items-center gap-4 p-5 rounded-2xl text-white" style={{ background: 'rgba(206,17,38,.8)' }}>
              <ShieldAlert className="w-8 h-8 opacity-80 flex-shrink-0" />
              <p className="text-sm font-medium" style={{ opacity: .9 }}>
                Si la personne est en danger immédiat, contacte d&apos;abord la police ou l&apos;hôpital.
              </p>
            </div>
          </div>
        )}

        {/* Localisation */}
        <div className="grid md:grid-cols-2 gap-4">
          <select value={city} onChange={e => { setCity(e.target.value); setQuartier('') }}
            className="input-soft w-full p-4 bg-slate-50 border rounded-2xl font-semibold outline-none appearance-none"
            style={{ borderColor: 'var(--warm-border)' }}>
            <option>Douala</option>
            <option>Yaoundé</option>
          </select>
          <select value={quartier} onChange={e => setQuartier(e.target.value)}
            className="input-soft w-full p-4 bg-slate-50 border rounded-2xl font-medium text-sm outline-none appearance-none"
            style={{ borderColor: 'var(--warm-border)' }}>
            <option value="">Choisir le point de rencontre...</option>
            {(QUARTIERS_RELAIS[city] ?? []).map(q => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>

        {/* Compte réception — objets seulement */}
        {category === 'item' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold uppercase text-slate-400" style={{ letterSpacing: '0.1em' }}>
                Compte de réception (MoMo / Orange Money)
              </label>
              <span className="text-xs font-semibold" style={{ color: 'var(--cm-green)' }}>
                Gain estimé : {totalGain.toLocaleString()} FCFA
              </span>
            </div>
            <input required type="tel" value={finderPhone} onChange={e => setFinderPhone(e.target.value)}
              placeholder="Numéro valide pour le transfert..."
              className="input-soft w-full p-5 bg-white border-2 rounded-2xl font-mono font-black text-3xl text-center tracking-widest outline-none"
              style={{ borderColor: 'var(--warm-border)' }} />
            <input required type="text" value={accountName} onChange={e => setAccountName(e.target.value)}
              placeholder="Nom exact figurant sur le compte..."
              className="input-soft w-full p-4 bg-white border-2 rounded-2xl font-semibold text-lg text-center uppercase tracking-wide outline-none"
              style={{ borderColor: 'var(--warm-border)' }} />
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full py-5 rounded-2xl text-white font-semibold transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-60"
          style={{ background: category === 'item' ? 'var(--navy)' : 'var(--cm-red)', fontSize: '16px' }}>
          {loading ? 'Enregistrement...' : 'Enregistrer mon geste'}
        </button>
      </form>
    </div>
  )
}
