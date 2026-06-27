'use client'

import { useState } from 'react'
import { useProfile } from '@/components/providers/ProfileProvider'
import { trackCheckoutStarted } from '@/lib/analytics'

const FEATURES = [
  'Scans illimités',
  'Pantry intelligent',
  'Planning automatique',
  'Liste de courses intelligente',
  'Historique complet',
  'Suggestions anti-gaspillage',
]

interface Props {
  onClose?: () => void
  /** Force l'affichage du paywall Stripe même en mode démo */
  forcePaywall?: boolean
}

export default function PremiumModal({ onClose, forcePaywall = false }: Props) {
  const profile = useProfile()
  const isDemo = profile?.id === 'demo'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // En mode démo sans forcePaywall → montrer d'abord la création de compte
  if (isDemo && !forcePaywall) {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-md bg-white rounded-t-[2rem] sm:rounded-[2rem] p-8 shadow-2xl animate-slide-up">
          {onClose && (
            <button onClick={onClose} className="absolute top-5 right-5 text-gray-300 hover:text-gray-500 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">👤</div>
            <h2 className="text-2xl font-black text-gray-900 mb-1.5">Créez votre compte</h2>
            <p className="text-gray-400 text-sm">Pour accéder à cette fonctionnalité et sauvegarder vos données</p>
          </div>
          <ul className="space-y-3 mb-7">
            {[
              '5 scans gratuits par mois',
              'Sauvegarde de vos recettes',
              'Accès aux fonctionnalités de base',
              'Upgrade Premium à tout moment',
            ].map((f) => (
              <li key={f} className="flex items-center gap-3 text-gray-700 text-sm">
                <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-[10px] font-bold shrink-0">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3">
            <a href="/login" className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold py-4 rounded-2xl transition-colors shadow-lg shadow-green-500/20">
              Créer mon compte gratuit →
            </a>
            <p className="text-center text-gray-400 text-xs">
              Déjà un compte ?{' '}
              <a href="/login" className="text-green-600 font-medium hover:underline">Se connecter</a>
            </p>
          </div>
        </div>
      </div>
    )
  }

  async function handleUpgrade() {
    setLoading(true)
    setError(null)
    trackCheckoutStarted()
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? 'Erreur de paiement')
      }

      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-t-[2rem] sm:rounded-[2rem] p-8 shadow-2xl animate-slide-up">
        {/* Close */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-300 hover:text-gray-500 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">⭐</div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">Passez Premium</h2>
          <div className="inline-flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-black text-gray-900">9,99€</span>
            <span className="text-gray-400 text-sm">/mois</span>
          </div>
          <p className="text-gray-400 text-xs mt-1">Annulable à tout moment</p>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-6">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-3 text-gray-700 text-sm">
              <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-[10px] font-bold shrink-0">✓</span>
              {f}
            </li>
          ))}
        </ul>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-500 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {/* CTA — démo + forcePaywall → login, sinon → Stripe */}
        {isDemo && forcePaywall ? (
          <a
            href="/login"
            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-2xl transition-all"
            onClick={() => localStorage.setItem('frigochef_upgrade_intent', '1')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            Créer un compte &amp; Passer Premium
          </a>
        ) : (
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full bg-gray-900 hover:bg-gray-800 active:scale-[0.98] disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Redirection…
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              Passer Premium
            </>
          )}
        </button>
        )}

        <p className="text-center text-gray-400 text-xs mt-3">
          Paiement sécurisé par Stripe · Annulable à tout moment
        </p>
      </div>
    </div>
  )
}
