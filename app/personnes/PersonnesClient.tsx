'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Camera, MapPin, Heart, Megaphone, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { logHistorique } from '@/lib/historique'

const PERSONS_DEMO = [
  { id: 101, name: '[CITOYEN RETROUVÉ]', age: '[X] ans', city: 'DOUALA', area: 'Bonabéri',
    description: 'Personne âgée désorientée, actuellement en sécurité au point relais.',
    type: 'found_by_samaritan' as const },
]

export default function PersonnesClient() {
  const [subView, setSubView]       = useState<'browse' | 'alert'>('browse')
  const [name, setName]             = useState('')
  const [age, setAge]               = useState('')
  const [city, setCity]             = useState('Douala')
  const [area, setArea]             = useState('')
  const [desc, setDesc]             = useState('')
  const [phone, setPhone]           = useState('')
  const [submitted, setSubmitted]   = useState(false)
  const [loading, setLoading]       = useState(false)

  const handleAlertSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await logHistorique({
      type:    'objet_recu',
      titre:   name || '[Personne disparue]',
      detail:  `Alerte famille lancée — ${age ? age + ' ans' : ''} — ${desc}`,
      montant: 0,
      signe:   '0',
      ville:   city,
      quartier: area,
    })

    setLoading(false)
    setSubmitted(true)
    setTimeout(() => { setSubmitted(false); setSubView('browse') }, 5000)
  }

  return (
    <div className="space-y-10">

      {submitted && (
        <div className="fixed top-8 left-1/2 z-50 flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-medium shadow-2xl"
          style={{ background: 'var(--cm-green)', transform: 'translateX(-50%)' }}>
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          L&apos;alerte est lancée. Tu n&apos;es plus seul dans cette attente.
        </div>
      )}

      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit mx-auto border border-slate-200">
        {([['Personnes retrouvées', 'browse'], ['Lancer une alerte', 'alert']] as const).map(([l, v]) => (
          <button key={v} onClick={() => setSubView(v)}
            className={`px-8 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${subView === v ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
            style={{ letterSpacing: '0.08em' }}>
            {l}
          </button>
        ))}
      </div>

      {subView === 'browse' && (
        <div className="space-y-6">
          {PERSONS_DEMO.map(person => (
            <div key={person.id}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow ${person.type === 'found_by_samaritan' ? 'cm-stripe-green' : 'cm-stripe-red'}`}
              style={{ borderColor: 'var(--warm-border)' }}>
              <div className="w-full md:w-52 h-52 flex-shrink-0 flex flex-col items-center justify-center"
                style={{ background: '#f5f0e8', borderRight: '1px solid var(--warm-border)' }}>
                <Camera className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-slate-400 font-medium text-[10px] uppercase" style={{ letterSpacing: '0.12em' }}>
                  Image protégée
                </p>
              </div>
              <div className="p-8 flex-1 space-y-4">
                <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border ${
                  person.type === 'found_by_samaritan' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200 animate-gentle-pulse'}`}
                  style={{ letterSpacing: '0.06em' }}>
                  {person.type === 'found_by_samaritan' ? 'En sécurité chez un Samaritain' : 'Une famille cherche cette personne'}
                </span>
                <h2 className="font-syne text-slate-900 text-[30px]">{person.name}</h2>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600">
                    Âge : {person.age}
                  </span>
                  <span className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {person.area}, {person.city}
                  </span>
                </div>
                <p className="text-slate-500 italic border-l-4 pl-4 font-medium text-[14px]"
                  style={{ borderColor: person.type === 'found_by_samaritan' ? 'var(--cm-green)' : 'var(--cm-red)', lineHeight: 1.7 }}>
                  &ldquo;{person.description}&rdquo;
                </p>
                <Link href={`/chat/${person.id}`}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-white font-semibold text-xs uppercase tracking-wider transition-all hover:opacity-90"
                  style={{ background: 'var(--navy-dark)', letterSpacing: '0.08em' }}>
                  <Megaphone className="w-4 h-4" /> J&apos;ai une information
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {subView === 'alert' && (
        <div className="bg-white rounded-[2rem] border shadow-sm p-10 md:p-14 max-w-3xl mx-auto"
          style={{ borderColor: 'var(--warm-border)', borderBottom: '4px solid var(--cm-red)' }}>
          <header className="text-center space-y-4 mb-10">
            <div className="rounded-2xl flex items-center justify-center mx-auto"
              style={{ background: 'rgba(206,17,38,.06)', width: '72px', height: '72px' }}>
              <Heart className="w-9 h-9 animate-gentle-pulse" style={{ color: 'var(--cm-red)' }} />
            </div>
            <h1 className="font-syne text-slate-900 text-[36px]" style={{ letterSpacing: '-0.02em' }}>
              Signaler une disparition
            </h1>
            <p className="text-slate-500 font-medium max-w-lg mx-auto text-[14px]" style={{ lineHeight: 1.85 }}>
              Chaque heure compte. On est là avec toi.
            </p>
          </header>

          <form onSubmit={handleAlertSubmit} className="space-y-5">
            <input required type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Nom complet du disparu..."
              className="input-soft w-full p-5 bg-slate-50 border rounded-2xl font-semibold text-lg uppercase outline-none transition-all"
              style={{ borderColor: 'var(--warm-border)' }} />
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" value={age} onChange={e => setAge(e.target.value)}
                placeholder="Âge estimé..."
                className="input-soft w-full p-5 bg-slate-50 border rounded-2xl font-medium outline-none transition-all"
                style={{ borderColor: 'var(--warm-border)' }} />
              <input type="text" value={area} onChange={e => setArea(e.target.value)}
                placeholder="Lieu de disparition..."
                className="input-soft w-full p-5 bg-slate-50 border rounded-2xl font-medium outline-none transition-all"
                style={{ borderColor: 'var(--warm-border)' }} />
            </div>
            <textarea required value={desc} onChange={e => setDesc(e.target.value)}
              placeholder="Description — tenue vestimentaire, signes particuliers, dernières circonstances..."
              className="input-soft w-full p-5 bg-slate-50 border rounded-2xl font-medium h-32 outline-none resize-none transition-all"
              style={{ borderColor: 'var(--warm-border)', fontSize: '14px', lineHeight: 1.7 }} />

            <div className="p-6 rounded-2xl border"
              style={{ background: 'rgba(206,17,38,.03)', borderColor: 'rgba(206,17,38,.12)' }}>
              <label className="flex items-center gap-2 text-xs font-semibold uppercase mb-3"
                style={{ color: 'var(--cm-red)', letterSpacing: '0.1em' }}>
                <ShieldAlert className="w-4 h-4" /> Ton numéro — strictement privé
              </label>
              <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="Numéro de la famille (jamais divulgué)..."
                className="input-soft w-full p-5 bg-white border border-red-100 rounded-2xl font-mono font-bold text-center text-xl tracking-widest outline-none transition-all" />
              <p className="mt-3 text-xs font-medium text-slate-400 text-center" style={{ lineHeight: 1.6 }}>
                Ton numéro ne sera jamais publié ni transmis à un tiers.
              </p>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-5 rounded-2xl text-white font-semibold transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: 'var(--cm-red)', fontSize: '16px' }}>
              {loading ? 'Enregistrement de l\'alerte...' : 'Lancer l\'alerte nationale'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
