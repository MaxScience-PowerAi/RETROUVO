'use client'

import { useState } from 'react'
import { User, Star, Globe, Zap, Handshake, Heart, CheckCircle2, UserPlus } from 'lucide-react'
import type { CommunityRole } from '@/lib/types'
import { supabase } from '@/lib/supabase'

const ROLES: {
  id: CommunityRole
  icon: React.ElementType
  title: string
  desc: string
  color: string
}[] = [
  { id: 'citoyen',    icon: User,      title: 'Citoyen actif',        color: 'var(--navy)',    desc: "Tu utilises RETROUVO, tu le partages avec ceux que tu aimes. C'est déjà un acte de fraternité." },
  { id: 'samaritain', icon: Star,      title: 'Samaritain de terrain', color: 'var(--cm-green)',desc: "Tu t'engages à rapporter les documents trouvés. Pas pour la récompense — pour le regard de quelqu'un qui retrouve ce qu'il a perdu." },
  { id: 'relais',     icon: Globe,     title: 'Point relais',          color: '#92700a',        desc: "Tu proposes ton espace comme lieu de dépôt. Tu deviens un point d'ancrage pour ta communauté." },
  { id: 'technique',  icon: Zap,       title: 'Volontaire technique',  color: '#7c3aed',        desc: "Développeur, designer, communicant ? Viens bâtir avec nous. Ton talent peut changer des vies concrètes." },
  { id: 'partenaire', icon: Handshake, title: 'Partenaire',            color: '#0891b2',        desc: "Association, institution, entreprise ? Ensemble, nous pouvons aller beaucoup plus loin." },
  { id: 'ami',        icon: Heart,     title: "Ami de la cause",       color: 'var(--cm-red)',  desc: "Tu crois en ce qu'on fait et tu nous soutiens moralement ou financièrement. C'est une forme d'amour, et ça compte." },
]

export default function RejoindreClient() {
  const [role, setRole]         = useState<CommunityRole>('citoyen')
  const [name, setName]         = useState('')
  const [city, setCity]         = useState('Douala')
  const [phone, setPhone]       = useState('')
  const [message, setMessage]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Insertion dans la table membres → apparaît automatiquement sur /famille
    const { error: err } = await supabase
      .from('membres')
      .insert([{
        prenom:  name.trim(),
        ville:   city,
        role:    role,
        statut:  'actif',
      }])

    setLoading(false)

    if (err) {
      setError('Une erreur est survenue. Vérifie ta connexion et réessaie.')
      return
    }

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
          <h2 className="font-syne text-slate-900" style={{ fontSize: '32px' }}>Bienvenue dans la famille.</h2>
          <p className="text-slate-500 font-medium max-w-md mx-auto" style={{ fontSize: '15px', lineHeight: 1.8 }}>
            Tu apparais maintenant dans la liste des membres sur la page <strong>La Famille RETROUVO</strong>.
            On est heureux que tu sois là.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-14">

      {/* Hero */}
      <div className="hero-soft rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden">
        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
          <h1 className="font-serif text-white" style={{ fontSize: 'clamp(32px,5vw,60px)', fontWeight: 600, lineHeight: 1.2 }}>
            On ne construit pas RETROUVO<br />
            <em style={{ color: 'var(--cm-yellow)' }}>pour être célèbres.</em>
          </h1>
          <p className="font-medium" style={{ color: 'rgba(255,255,255,.75)', fontSize: '16px', lineHeight: 1.85 }}>
            On le construit parce que chaque fois qu&apos;une pièce est rendue, chaque fois qu&apos;un proche
            est retrouvé — quelque chose de beau se passe dans ce pays. Et ça mérite qu&apos;on se batte
            pour le faire durer.
          </p>
        </div>
      </div>

      {/* Choix du rôle */}
      <div>
        <h2 className="font-syne text-slate-900 text-center mb-8" style={{ fontSize: '24px', letterSpacing: '-0.02em' }}>
          Comment veux-tu contribuer ?
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {ROLES.map(r => (
            <div
              key={r.id}
              className={`com-card ${role === r.id ? 'active' : ''}`}
              onClick={() => setRole(r.id)}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${r.color}18` }}>
                <r.icon className="w-5 h-5" style={{ color: r.color }} />
              </div>
              <h3 className="font-syne text-slate-900 mb-2" style={{ fontSize: '17px' }}>{r.title}</h3>
              <p className="text-slate-500 font-medium" style={{ fontSize: '13px', lineHeight: 1.7 }}>{r.desc}</p>
              {role === r.id && (
                <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--cm-green)' }}>
                  <CheckCircle2 className="w-4 h-4" /> Choisi
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Formulaire */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[2rem] border p-10 space-y-6"
        style={{ borderColor: 'var(--warm-border)', borderBottom: '4px solid var(--cm-green)' }}
      >
        <div className="text-center space-y-2">
          <h2 className="font-syne text-slate-900" style={{ fontSize: '26px' }}>Je rejoins la famille</h2>
          <p className="text-slate-500 font-medium" style={{ fontSize: '14px' }}>
            Tu apparaîtras automatiquement dans la liste des membres.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <input
            required type="text"
            placeholder="Ton prénom (ou un pseudonyme)..."
            className="input-soft w-full p-5 bg-slate-50 border rounded-2xl font-semibold text-base uppercase outline-none transition-all"
            style={{ borderColor: 'var(--warm-border)' }}
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            className="input-soft w-full p-5 bg-slate-50 border rounded-2xl font-semibold outline-none appearance-none transition-all"
            style={{ borderColor: 'var(--warm-border)' }}
          >
            <option>Douala</option>
            <option>Yaoundé</option>
            <option>Autre ville</option>
          </select>
        </div>

        <input
          required type="tel"
          placeholder="Ton numéro WhatsApp (privé, jamais affiché)..."
          className="input-soft w-full p-5 bg-slate-50 border rounded-2xl font-mono font-bold text-xl text-center tracking-widest outline-none transition-all"
          style={{ borderColor: 'var(--warm-border)' }}
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />

        <textarea
          placeholder="Pourquoi ce projet te touche ? (optionnel)"
          className="input-soft w-full p-5 bg-slate-50 border rounded-2xl font-medium h-28 resize-none outline-none transition-all"
          style={{ borderColor: 'var(--warm-border)', fontSize: '14px', lineHeight: 1.7 }}
          value={message}
          onChange={e => setMessage(e.target.value)}
        />

        {/* Rôle recap */}
        <div className="rounded-2xl p-5 flex items-center gap-4"
          style={{ background: 'rgba(0,122,94,.04)', border: '1.5px solid rgba(0,122,94,.12)' }}>
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--cm-green)' }} />
          <p className="font-medium text-slate-600" style={{ fontSize: '13px' }}>
            Rôle choisi :{' '}
            <span className="font-semibold capitalize" style={{ color: 'var(--cm-green)' }}>
              {ROLES.find(r => r.id === role)?.title}
            </span>
            {' '}· Tu apparaîtras dans la liste publique de la famille.
          </p>
        </div>

        {error && (
          <p className="text-center font-medium" style={{ fontSize: '13px', color: 'var(--cm-red)' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-5 rounded-2xl text-white font-semibold transition-all hover:opacity-90 active:scale-[0.99] flex items-center justify-center gap-3 disabled:opacity-60"
          style={{ background: 'var(--navy)', fontSize: '16px' }}
        >
          <UserPlus className="w-5 h-5" />
          {loading ? 'Inscription en cours...' : 'Je rejoins RETROUVO'}
        </button>
      </form>

      {/* Citation */}
      <div className="rounded-[2rem] p-10 md:p-14 text-center" style={{ background: 'var(--navy-dark)' }}>
        <p className="font-serif text-white" style={{ fontSize: 'clamp(20px,3.5vw,34px)', fontWeight: 400, lineHeight: 1.5, fontStyle: 'italic' }}>
          &ldquo;Le Cameroun qu&apos;on veut n&apos;est pas celui qu&apos;on attend.
          C&apos;est celui qu&apos;on bâtit —
          <span style={{ color: 'var(--cm-yellow)' }}> un geste honnête à la fois.</span>&rdquo;
        </p>
        <p className="mt-6 font-medium text-slate-500" style={{ fontSize: '12px', letterSpacing: '0.12em' }}>
          — La philosophie RETROUVO
        </p>
      </div>
    </div>
  )
}
