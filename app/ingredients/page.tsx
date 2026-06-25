'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ingredient, Recipe } from '@/lib/types'

export default function IngredientsPage() {
  const router = useRouter()
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [newIngredient, setNewIngredient] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const addInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('frigochef_ingredients')
    if (!stored) { router.replace('/scan'); return }
    setIngredients(JSON.parse(stored))
  }, [router])

  function remove(id: string) {
    setIngredients((p) => p.filter((i) => i.id !== id))
  }

  function startEdit(ingredient: Ingredient) {
    setEditingId(ingredient.id)
    setEditValue(ingredient.name)
  }

  function saveEdit(id: string) {
    if (editValue.trim()) {
      setIngredients((p) => p.map((i) => (i.id === id ? { ...i, name: editValue.trim() } : i)))
    }
    setEditingId(null)
  }

  function addIngredient() {
    const name = newIngredient.trim()
    if (!name) return
    setIngredients((p) => [...p, { id: Date.now().toString(), name, confidence: 1 }])
    setNewIngredient('')
    addInputRef.current?.focus()
  }

  async function findRecipes() {
    if (ingredients.length === 0) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: ingredients.map((i) => i.name) }),
      })
      const data = await res.json()
      if (!data.recipes) throw new Error()
      sessionStorage.setItem('frigochef_recipes', JSON.stringify(data.recipes as Recipe[]))
      router.push('/recipes')
    } catch {
      setError('Génération échouée. Réessayez.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link href="/scan" className="p-2 -ml-2 text-gray-400 hover:text-gray-700 rounded-xl transition-colors">
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
          <ProgressBar step={2} />
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 py-8 pb-36">
        <div className="max-w-lg mx-auto">

          {/* Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-black text-gray-900 mb-1">Vos ingrédients</h1>
            <p className="text-gray-500 text-sm">
              {ingredients.length} détecté{ingredients.length !== 1 ? 's' : ''}. Tapez pour modifier, × pour supprimer.
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6 animate-fade-in">
            {ingredients.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
              >
                {editingId === item.id ? (
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => saveEdit(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(item.id)
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                    className="px-3 py-2 text-sm font-medium text-gray-800 bg-transparent outline-none w-32"
                  />
                ) : (
                  <button
                    onClick={() => startEdit(item)}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                  >
                    {item.name}
                    {item.confidence < 1 && (
                      <span className="text-[10px] text-gray-300 font-normal">
                        {Math.round(item.confidence * 100)}%
                      </span>
                    )}
                  </button>
                )}
                <button
                  onClick={() => remove(item.id)}
                  className="pr-2.5 py-2 text-gray-300 hover:text-red-400 transition-colors text-xs"
                >
                  ✕
                </button>
              </div>
            ))}

            {ingredients.length === 0 && (
              <p className="text-gray-400 text-sm py-4">
                Aucun ingrédient — ajoutez-en ci-dessous.
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 mb-6" />

          {/* Add input */}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Ajouter un ingrédient
          </p>
          <div className="flex gap-2">
            <input
              ref={addInputRef}
              type="text"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
              placeholder="Ex: Courgette, Lardons…"
              className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-gray-400 transition-colors shadow-sm"
            />
            <button
              onClick={addIngredient}
              disabled={!newIngredient.trim()}
              className="bg-gray-900 hover:bg-gray-700 disabled:opacity-30 text-white px-4 py-3 rounded-xl transition-colors shadow-sm"
            >
              <PlusIcon />
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl px-4 py-3">
              {error}
            </div>
          )}
        </div>
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-6 bg-gradient-to-t from-[#F8F9FA] via-[#F8F9FA]/95 to-transparent">
        <div className="max-w-lg mx-auto">
          <button
            onClick={findRecipes}
            disabled={loading || ingredients.length === 0}
            className="w-full bg-green-500 hover:bg-green-400 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-5 rounded-2xl text-base shadow-lg shadow-green-500/25 transition-all duration-200"
          >
            {loading ? 'Génération en cours…' : `Trouver des recettes →`}
          </button>
          <p className="text-center text-xs text-gray-400 mt-2">
            {ingredients.length} ingrédient{ingredients.length !== 1 ? 's' : ''} · 5 recettes générées par l&apos;IA
          </p>
        </div>
      </div>

      {loading && <LoadingOverlay message="Création de vos recettes…" sub="Le chef IA travaille pour vous" />}
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
function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}
