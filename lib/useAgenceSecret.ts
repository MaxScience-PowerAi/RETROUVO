'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// ─── Secret d'accès agence ───────────────────────────────
// Méthode : 7 clics sur le logo RETROUVO du footer
//           puis taper RETRO237 au clavier (sans appuyer Entrée)
// Ne JAMAIS partager ce fichier publiquement.
// ─────────────────────────────────────────────────────────

const CLICK_TARGET_ID = 'retrouvo-footer-logo'
const CLICKS_REQUIRED = 7
const SECRET_CODE     = 'RETRO237'
const CLICK_TIMEOUT   = 4000 // reset si inactif 4 secondes

export function useAgenceSecret() {
  const router = useRouter()

  useEffect(() => {
    let clickCount  = 0
    let typedBuffer = ''
    let clickTimer: ReturnType<typeof setTimeout> | null = null

    // ── Gestionnaire de clics ──────────────────────────
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const logo   = document.getElementById(CLICK_TARGET_ID)
      if (!logo || !logo.contains(target)) return

      clickCount++

      // Reset timer si inactif
      if (clickTimer) clearTimeout(clickTimer)
      clickTimer = setTimeout(() => {
        clickCount  = 0
        typedBuffer = ''
      }, CLICK_TIMEOUT)

      if (clickCount === CLICKS_REQUIRED) {
        // Activer l'écoute du clavier
        document.addEventListener('keydown', handleKeydown)
      }
    }

    // ── Gestionnaire clavier ───────────────────────────
    const handleKeydown = (e: KeyboardEvent) => {
      // Ignorer les touches spéciales
      if (e.key.length !== 1) return

      typedBuffer += e.key.toUpperCase()

      // Garder seulement les N derniers caractères
      if (typedBuffer.length > SECRET_CODE.length) {
        typedBuffer = typedBuffer.slice(-SECRET_CODE.length)
      }

      if (typedBuffer === SECRET_CODE) {
        // Accès accordé — nettoyer et rediriger
        clickCount  = 0
        typedBuffer = ''
        if (clickTimer) clearTimeout(clickTimer)
        document.removeEventListener('keydown', handleKeydown)
        document.removeEventListener('click',   handleClick)

        // Stocker le token de session agence (expire à la fermeture du navigateur)
        sessionStorage.setItem('retrouvo_agence', 'true')
        router.push('/historique')
      }

      // Reset si trop de caractères incorrects
      if (typedBuffer.length === SECRET_CODE.length && typedBuffer !== SECRET_CODE) {
        typedBuffer = ''
        clickCount  = 0
        document.removeEventListener('keydown', handleKeydown)
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click',   handleClick)
      document.removeEventListener('keydown', handleKeydown)
      if (clickTimer) clearTimeout(clickTimer)
    }
  }, [router])
}
