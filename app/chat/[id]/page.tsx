'use client'

import { useState, useEffect, useRef, use } from 'react'
import Link from 'next/link'
import { ChevronLeft, Send, PhoneCall, CheckCircle2, CheckSquare, ShieldCheck } from 'lucide-react'
import { logHistorique } from '@/lib/historique'

interface ChatMessage {
  id:     number
  sender: 'SYSTEM' | 'ALERT_CALL' | 'SUCCESS' | 'USER'
  text:   string
}

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [messages, setMessages]         = useState<ChatMessage[]>([])
  const [newMsg, setNewMsg]             = useState('')
  const [status, setStatus]             = useState<'open' | 'completed'>('open')
  const [recovering, setRecovering]     = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages([
      { id: 0, sender: 'SYSTEM',     text: `Canal sécurisé ouvert — Dossier #${id}` },
      { id: 1, sender: 'ALERT_CALL', text: 'Un message a été envoyé. La personne concernée sera bientôt en ligne.' },
    ])
  }, [id])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!newMsg.trim()) return
    setMessages(p => [...p, { id: Date.now(), sender: 'USER', text: newMsg.trim() }])
    setNewMsg('')
    setTimeout(() => {
      setMessages(p => [...p, { id: Date.now() + 1, sender: 'SYSTEM', text: 'Message transmis avec sécurité.' }])
    }, 1200)
  }

  const confirmRecovery = async () => {
    setRecovering(true)

    // Enregistrer la récupération dans l'historique
    await logHistorique({
      type:    'objet_rendu',
      titre:   `Dossier #${id}`,
      detail:  'Pièce remise au propriétaire — transaction clôturée',
      montant: 0,
      signe:   '0',
    })

    // Enregistrer le transfert vers le Samaritain
    await logHistorique({
      type:    'transfert_envoye',
      titre:   'Transfert Samaritain',
      detail:  `Récompense pour Dossier #${id}`,
      montant: 0,
      signe:   '-',
      methode: 'MTN MoMo',
    })

    setStatus('completed')
    setRecovering(false)
    setMessages(p => [
      ...p,
      { id: Date.now(), sender: 'SUCCESS',
        text: 'Magnifique. La pièce est rendue. Le virement vers le Samaritain est en cours. Merci à vous deux.' },
    ])
  }

  const STEP_STATE = (s: string) =>
    s === 'Dialogue'  ? (status === 'open' ? 'active' : 'done')
    : status === 'completed' ? 'done' : 'idle'

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      <div className="flag-bar w-full" />

      <main className="max-w-3xl mx-auto px-4 py-12 space-y-6">

        <Link href="/pieces"
          className="flex items-center gap-3 text-slate-400 hover:text-slate-600 transition-all group w-fit">
          <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-200 group-hover:border-slate-300">
            <ChevronLeft className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-medium uppercase" style={{ letterSpacing: '0.1em' }}>
            Retour aux pièces
          </span>
        </Link>

        <div className="rounded-2xl p-5 flex items-center gap-5" style={{ background: 'var(--navy-dark)' }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,.08)' }}>
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-blue-300 font-medium text-[10px] uppercase" style={{ letterSpacing: '0.16em' }}>
              Canal Sécurisé — RETROUVO
            </p>
            <h1 className="font-syne text-white text-[22px]">Dossier #{id}</h1>
          </div>
        </div>

        {/* Progression */}
        <div className="flex items-center gap-2 flex-wrap">
          {['Dialogue', 'Accord', 'Transfert', 'Clôturé'].map((step, i) => (
            <div key={step} className="flex items-center gap-2 flex-1 min-w-0">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                STEP_STATE(step) === 'done'   ? 'step-done'   :
                STEP_STATE(step) === 'active' ? 'step-active' : 'step-idle'}`}>
                {STEP_STATE(step) === 'done' && <CheckSquare className="w-3 h-3" />}
                {step}
              </div>
              {i < 3 && <div className="flex-1 h-px bg-slate-200 min-w-2" />}
            </div>
          ))}
        </div>

        {/* Fenêtre chat */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--warm-border)' }}>
          <div className="h-96 overflow-y-auto p-6 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'SYSTEM' && (
                  <div className="bg-slate-50 border border-slate-100 text-slate-500 text-xs font-medium px-5 py-3 rounded-2xl max-w-sm italic">
                    {msg.text}
                  </div>
                )}
                {msg.sender === 'ALERT_CALL' && (
                  <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 text-amber-800 text-xs font-semibold px-5 py-3 rounded-2xl">
                    <PhoneCall className="w-4 h-4 flex-shrink-0" /> {msg.text}
                  </div>
                )}
                {msg.sender === 'SUCCESS' && (
                  <div className="flex items-start gap-3 bg-green-50 border border-green-100 text-green-800 text-sm font-medium px-5 py-4 rounded-2xl max-w-sm">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" /> {msg.text}
                  </div>
                )}
                {msg.sender === 'USER' && (
                  <div className="text-white text-sm font-medium px-5 py-3 rounded-2xl max-w-sm"
                    style={{ background: 'var(--navy)' }}>
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {status !== 'completed' && (
            <div className="border-t p-4 flex gap-3" style={{ borderColor: 'var(--warm-border)' }}>
              <input type="text" value={newMsg} onChange={e => setNewMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ton message..."
                className="input-soft flex-1 p-4 bg-slate-50 border rounded-xl font-medium outline-none transition-all"
                style={{ borderColor: 'var(--warm-border)' }} />
              <button onClick={sendMessage}
                className="px-5 py-4 rounded-xl text-white transition-all hover:opacity-90"
                style={{ background: 'var(--navy)' }}>
                <Send className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {status !== 'completed' && (
          <button onClick={confirmRecovery} disabled={recovering}
            className="w-full py-6 rounded-2xl text-white font-semibold transition-all hover:opacity-90 active:scale-[0.99] flex items-center justify-center gap-3 disabled:opacity-60"
            style={{ background: 'var(--cm-green)', fontSize: '16px' }}>
            <CheckSquare className="w-5 h-5" />
            {recovering ? 'Enregistrement...' : "J'ai récupéré ma pièce — merci à toi"}
          </button>
        )}
      </main>
    </div>
  )
}
