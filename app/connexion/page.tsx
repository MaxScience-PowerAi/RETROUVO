'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Phone, ShieldCheck, ArrowRight } from 'lucide-react'
import RetrouvoLogo from '@/components/ui/RetrouvoLogo'

type Step = 'phone' | 'otp'

export default function ConnexionPage() {
  const [step, setStep]       = useState<Step>('phone')
  const [phone, setPhone]     = useState('')
  const [otp, setOtp]         = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (phone.replace(/\D/g, '').length < 9) {
      setError('Saisis un numéro valide à 9 chiffres.')
      return
    }
    setLoading(true)
    // TODO: appeler l'API → POST /api/auth/send-otp { phone }
    await new Promise(r => setTimeout(r, 1200)) // simulation
    setLoading(false)
    setStep('otp')
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (otp.length !== 6) {
      setError('Le code doit contenir 6 chiffres.')
      return
    }
    setLoading(true)
    // TODO: appeler l'API → POST /api/auth/verify-otp { phone, otp }
    await new Promise(r => setTimeout(r, 1200)) // simulation
    setLoading(false)
    // TODO: rediriger vers /tableau-de-bord après vérification
    alert('Connexion simulée — intégrer Supabase Auth ici.')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--cream)' }}>
      <div className="flag-bar w-full" />

      {/* Header minimal */}
      <header className="max-w-lg mx-auto w-full px-6 pt-10">
        <Link href="/" className="flex items-center gap-3 w-fit mb-10 group">
          <div className="p-2 rounded-xl border border-slate-200 bg-white group-hover:border-slate-300 transition-colors">
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </div>
          <RetrouvoLogo className="w-9 h-9" />
          <span className="font-syne text-[18px]" style={{ color: 'var(--navy-dark)' }}>RETROUVO</span>
        </Link>
      </header>

      {/* Formulaire centré */}
      <main className="flex-1 flex items-start justify-center px-4">
        <div
          className="w-full max-w-md rounded-[2rem] border p-10 space-y-8"
          style={{ background: '#fff', borderColor: 'var(--warm-border)', borderBottom: '4px solid var(--navy)' }}
        >
          {step === 'phone' ? (
            <>
              <div className="text-center space-y-3">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                  style={{ background: 'rgba(30,58,138,.06)' }}
                >
                  <Phone className="w-8 h-8" style={{ color: 'var(--navy)' }} />
                </div>
                <h1 className="font-syne text-slate-900 text-[28px]">Se connecter</h1>
                <p className="text-slate-500 font-medium text-[14px]" style={{ lineHeight: 1.75 }}>
                  Saisis ton numéro de téléphone. On t&apos;envoie un code par SMS — c&apos;est tout.
                </p>
              </div>

              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div>
                  <label className="block text-[12px] font-semibold uppercase text-slate-400 mb-2" style={{ letterSpacing: '0.1em' }}>
                    Ton numéro (MTN ou Orange)
                  </label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="6XX XXX XXX"
                    className="input-soft w-full p-5 bg-slate-50 border rounded-2xl font-mono font-bold text-2xl text-center tracking-widest outline-none transition-all"
                    style={{ borderColor: 'var(--warm-border)' }}
                  />
                </div>

                {error && (
                  <p className="text-red-600 text-[13px] font-medium text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 rounded-2xl text-white font-semibold transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: 'var(--navy)', fontSize: '15px' }}
                >
                  {loading ? 'Envoi du code...' : (
                    <><ArrowRight className="w-5 h-5" /> Recevoir le code SMS</>
                  )}
                </button>
              </form>

              <div
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{ background: 'rgba(0,122,94,.04)', border: '1px solid rgba(0,122,94,.1)' }}
              >
                <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--cm-green)' }} />
                <p className="text-slate-500 font-medium text-[12px]" style={{ lineHeight: 1.65 }}>
                  Ton numéro ne sera jamais partagé. Il sert uniquement à t&apos;identifier sur la plateforme.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center space-y-3">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                  style={{ background: 'rgba(0,122,94,.06)' }}
                >
                  <ShieldCheck className="w-8 h-8" style={{ color: 'var(--cm-green)' }} />
                </div>
                <h1 className="font-syne text-slate-900 text-[28px]">Code envoyé</h1>
                <p className="text-slate-500 font-medium text-[14px]" style={{ lineHeight: 1.75 }}>
                  Un SMS a été envoyé au{' '}
                  <span className="font-bold text-slate-700">{phone}</span>.
                  Saisis le code à 6 chiffres.
                </p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <input
                  required
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="input-soft w-full p-6 bg-slate-50 border rounded-2xl font-mono font-black text-4xl text-center tracking-[0.4em] outline-none transition-all"
                  style={{ borderColor: 'var(--warm-border)' }}
                />

                {error && (
                  <p className="text-red-600 text-[13px] font-medium text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 rounded-2xl text-white font-semibold transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ background: 'var(--cm-green)', fontSize: '15px' }}
                >
                  {loading ? 'Vérification...' : 'Confirmer et entrer'}
                </button>

                <button
                  type="button"
                  onClick={() => { setStep('phone'); setOtp(''); setError('') }}
                  className="w-full text-slate-400 text-[13px] font-medium hover:text-slate-600 transition-colors"
                >
                  ← Changer de numéro
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
