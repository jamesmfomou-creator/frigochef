'use client'

import { useState } from 'react'

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
}

export default function PremiumModal({ onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUpgrade() {
    setLoading(true)
    setError(null)
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
        <div className="text-center mb-7">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">⭐</div>
          <h2 className="text-2xl font-black text-gray-900 mb-1.5">Passez Premium</h2>
          <p className="text-gray-400 text-sm">Débloquez l&apos;assistant alimentaire complet</p>
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

        {/* CTA */}
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

        <p className="text-center text-gray-400 text-xs mt-3">
          Paiement sécurisé par Stripe · Annulable à tout moment
        </p>
      </div>
    </div>
  )
}
