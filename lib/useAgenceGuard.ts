'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Vérifie que le visiteur a utilisé le secret agence.
// Si non → redirige silencieusement vers l'accueil (404 visible).
export function useAgenceGuard() {
  const router   = useRouter()
  const [ok, setOk] = useState(false)

  useEffect(() => {
    const token = sessionStorage.getItem('retrouvo_agence')
    if (token === 'true') {
      setOk(true)
    } else {
      // Redirection silencieuse — comme si la page n'existait pas
      router.replace('/')
    }
  }, [router])

  return ok
}
