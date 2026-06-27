'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ingredient, FREE_SCAN_LIMIT } from '@/lib/types'
import { useProfile } from '@/components/providers/ProfileProvider'
import PremiumModal from '@/components/premium/PremiumModal'
import { trackScanStarted, trackScanCompleted } from '@/lib/analytics'

export default function ScanPage() {
  const router = useRouter()
  const profile = useProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPremium, setShowPremium] = useState(false)

  const isPremium = profile?.plan === 'premium'
  const isDemo = profile?.id === 'demo'
  // En démo : scan illimité pour montrer l'expérience complète
  const scanLimitReached = !isDemo && !isPremium && (profile?.scan_count ?? 0) >= FREE_SCAN_LIMIT

  function handleFile(f: File) {
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setError(null)
    trackScanStarted()
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  async function analyze() {
    if (!file) return
    if (scanLimitReached) { setShowPremium(true); return }
    setLoading(true)
    setError(null)
    try {
      const form = new FormData()
      form.append('image', file)
      const res = await fetch('/api/analyze', { method: 'POST', body: form })
      const data = await res.json()
      if (!data.ingredients) throw new Error()
      const ingredients: Ingredient[] = data.ingredients.map(
        (item: { name: string; confidence: number }, i: number) => ({
          id: String(i + 1), name: item.name, confidence: item.confidence,
        })
      )
      sessionStorage.setItem('frigochef_ingredients', JSON.stringify(ingredients))
      if (data.scanId) sessionStorage.setItem('frigochef_scan_id', data.scanId)
      trackScanCompleted(ingredients.length)
      router.push('/ingredients')
    } catch {
      setError("Analyse échouée. Réessayez.")
      setLoading(false)
    }
  }

  if (scanLimitReached) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-xl font-black text-white mb-2">Limite mensuelle atteinte</h2>
        <p className="text-gray-500 text-sm mb-6">Vous avez utilisé vos {FREE_SCAN_LIMIT} scans gratuits ce mois-ci.</p>
        <button onClick={() => setShowPremium(true)} className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-4 rounded-2xl transition-colors">
          ⭐ Passer Premium
        </button>
        <Link href="/dashboard" className="mt-4 text-gray-600 text-sm hover:text-gray-400 transition-colors">← Retour</Link>
        {showPremium && <PremiumModal onClose={() => setShowPremium(false)} />}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col">
      {/* Header */}
      <header className="px-6 pt-8 pb-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="p-2 -ml-2 text-gray-600 hover:text-gray-400 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          </Link>
          <span className="text-white font-bold text-lg">Frigo<span className="text-green-400">Chef</span></span>
          {!isPremium && (
            <span className="text-xs text-gray-600 font-medium">
              {FREE_SCAN_LIMIT - (profile?.scan_count ?? 0)} scan{FREE_SCAN_LIMIT - (profile?.scan_count ?? 0) !== 1 ? 's' : ''} restant{FREE_SCAN_LIMIT - (profile?.scan_count ?? 0) !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </header>

      {!preview ? (
        /* ── Mode SCAN animé ── */
        <div className="flex-1 flex flex-col items-center justify-between px-6 pb-12">
          {/* Instruction */}
          <div className="text-center pt-6 pb-8">
            <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">Pointez vers vos ingrédients</p>
          </div>

          {/* Zone de scan */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80">
            {/* Fond semi-transparent */}
            <div className="absolute inset-0 bg-green-400/[0.04] rounded-sm" />

            {/* Coins de visée */}
            <div className="absolute top-0 left-0 w-7 h-7 border-l-[3px] border-t-[3px] border-green-400 rounded-tl-sm" />
            <div className="absolute top-0 right-0 w-7 h-7 border-r-[3px] border-t-[3px] border-green-400 rounded-tr-sm" />
            <div className="absolute bottom-0 left-0 w-7 h-7 border-l-[3px] border-b-[3px] border-green-400 rounded-bl-sm" />
            <div className="absolute bottom-0 right-0 w-7 h-7 border-r-[3px] border-b-[3px] border-green-400 rounded-br-sm" />

            {/* Ligne de scan animée */}
            <div
              className="absolute left-2 right-2 h-[2px] animate-scan-line"
              style={{
                background: 'linear-gradient(90deg, transparent, #4ade80, #22c55e, #4ade80, transparent)',
                boxShadow: '0 0 8px 2px rgba(34,197,94,0.5)',
              }}
            />

            {/* Halo central pulsant */}
            <div className="absolute inset-8 rounded-sm border border-green-400/10 animate-scan-pulse" />

            {/* Texte central */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-400/10 flex items-center justify-center animate-scan-pulse">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <p className="text-green-400/70 text-xs font-medium tracking-widest uppercase">Scan actif</p>
            </div>
          </div>

          {/* Boutons */}
          <div className="w-full max-w-xs space-y-3 mt-8">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2.5 bg-green-500 hover:bg-green-400 active:scale-95 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-green-500/25"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              Prendre une photo
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2.5 bg-white/[0.07] hover:bg-white/[0.11] border border-white/10 text-white font-semibold py-4 rounded-2xl transition-all"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
              </svg>
              Choisir depuis la galerie
            </button>
          </div>
        </div>
      ) : (
        /* ── Mode PREVIEW ── */
        <div className="flex-1 flex flex-col px-6 pb-10 pt-4">
          <div className="max-w-lg mx-auto w-full flex-1 flex flex-col">
            {/* Preview image */}
            <div className="relative flex-1 rounded-3xl overflow-hidden bg-gray-900 mb-5 min-h-64">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Aperçu" className="w-full h-full object-cover" />

              {/* Scan overlay animé sur la preview */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-green-400" />
                <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-green-400" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-green-400" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-green-400" />
              </div>

              <button
                onClick={() => { setPreview(null); setFile(null) }}
                className="absolute top-3 right-12 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>

              <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-green-400 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Prêt à analyser
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl px-4 py-3 mb-4">{error}</div>
            )}

            <button
              onClick={analyze}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-400 active:scale-[0.98] disabled:opacity-60 text-white font-bold py-5 rounded-2xl text-base shadow-lg shadow-green-500/25 transition-all"
            >
              {loading ? 'Analyse en cours…' : 'Analyser mes ingrédients →'}
            </button>
            <button onClick={() => { setPreview(null); setFile(null) }} className="w-full mt-3 text-gray-600 hover:text-gray-400 text-sm py-2 transition-colors">
              Changer de photo
            </button>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-full border-4 border-green-400/20" />
            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-green-400 animate-spin" />
          </div>
          <p className="text-white font-bold text-lg">Analyse des ingrédients…</p>
          <p className="text-gray-500 text-sm mt-1">Quelques secondes</p>
        </div>
      )}

      {showPremium && <PremiumModal onClose={() => setShowPremium(false)} />}

      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onInputChange} />
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onInputChange} />
    </div>
  )
}
