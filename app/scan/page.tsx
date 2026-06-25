'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ingredient } from '@/lib/types'

export default function ScanPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  function handleFile(f: File) {
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setError(null)
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f?.type.startsWith('image/')) handleFile(f)
  }

  async function analyze() {
    if (!file) return
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
          id: String(i + 1),
          name: item.name,
          confidence: item.confidence,
        })
      )

      sessionStorage.setItem('frigochef_ingredients', JSON.stringify(ingredients))
      router.push('/ingredients')
    } catch {
      setError("Analyse échouée. Réessayez.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 text-gray-400 hover:text-gray-700 rounded-xl transition-colors">
            <BackIcon />
          </Link>
          <span className="font-bold text-gray-900">
            Frigo<span className="text-green-500">Chef</span>
          </span>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-lg mx-auto">
          <ProgressBar step={1} />
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-lg mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-gray-900 mb-1">Votre frigo</h1>
            <p className="text-gray-500 text-sm">Prenez une photo ou importez une image de vos ingrédients.</p>
          </div>

          {!preview ? (
            <div
              onDrop={onDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              className={`bg-white rounded-3xl border-2 border-dashed transition-all duration-200 p-10 flex flex-col items-center gap-6 ${
                dragOver ? 'border-green-400 bg-green-50/40' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                <span className="text-4xl">🥦</span>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-800 text-base mb-1">
                  Photo de vos ingrédients
                </p>
                <p className="text-gray-400 text-sm">
                  Frigo ouvert, légumes sur le plan de travail, peu importe
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 active:scale-95 text-white font-semibold py-3.5 rounded-xl text-sm transition-all duration-150"
                >
                  <CameraIcon />
                  Appareil photo
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 active:scale-95 text-gray-700 font-semibold py-3.5 rounded-xl text-sm border border-gray-200 transition-all duration-150"
                >
                  <UploadIcon />
                  Galerie
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-scale-in">
              {/* Preview */}
              <div className="relative rounded-3xl overflow-hidden bg-gray-100 shadow-sm mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Aperçu" className="w-full aspect-video object-cover" />
                <button
                  onClick={() => { setPreview(null); setFile(null) }}
                  className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <CloseIcon />
                </button>
                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                  ✓ Image prête
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl px-4 py-3 mb-4">
                  {error}
                </div>
              )}

              <button
                onClick={analyze}
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-400 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-5 rounded-2xl text-base shadow-lg shadow-green-500/25 transition-all duration-200"
              >
                {loading ? 'Analyse en cours…' : 'Analyser mes ingrédients →'}
              </button>
              <button
                onClick={() => { setPreview(null); setFile(null) }}
                className="w-full mt-3 text-gray-400 hover:text-gray-600 text-sm font-medium py-2 transition-colors"
              >
                Changer de photo
              </button>
            </div>
          )}
        </div>
      </main>

      {loading && <LoadingOverlay message="Analyse des ingrédients…" sub="L'IA examine votre photo" />}

      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onInputChange} />
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onInputChange} />
    </div>
  )
}

function ProgressBar({ step }: { step: number }) {
  const steps = ['Photo', 'Ingrédients', 'Recettes']
  return (
    <div className="flex items-center gap-3">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-3 flex-1 last:flex-none">
          <div className="flex items-center gap-1.5">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
              i + 1 < step ? 'bg-green-500 text-white' :
              i + 1 === step ? 'bg-gray-900 text-white' :
              'bg-gray-100 text-gray-400'
            }`}>
              {i + 1 < step ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-medium ${i + 1 === step ? 'text-gray-900' : 'text-gray-400'}`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-px ${i + 1 < step ? 'bg-green-500' : 'bg-gray-100'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function LoadingOverlay({ message, sub }: { message: string; sub?: string }) {
  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fade-in">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border-4 border-gray-100" />
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-green-500 animate-spin" />
      </div>
      <p className="text-gray-900 font-bold text-lg">{message}</p>
      {sub && <p className="text-gray-400 text-sm mt-1">{sub}</p>}
    </div>
  )
}

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  )
}
function CameraIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
    </svg>
  )
}
function UploadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}
function CloseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
