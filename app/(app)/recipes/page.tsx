'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Recipe, Ingredient } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

const FALLBACKS = [
  { gradient: 'from-green-400 to-emerald-600', emoji: '🥗' },
  { gradient: 'from-orange-400 to-amber-500', emoji: '🍳' },
  { gradient: 'from-red-400 to-rose-500', emoji: '🍕' },
  { gradient: 'from-yellow-400 to-orange-400', emoji: '🥘' },
  { gradient: 'from-violet-400 to-purple-600', emoji: '🫕' },
]

function imgUrl(title: string, index: number) {
  const q = title.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]/g, '').trim().split(/\s+/).slice(0, 3).join(',')
  return `https://source.unsplash.com/featured/800x500/?food,${q}&sig=${index}`
}

export default function RecipesPage() {
  const router = useRouter()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selected, setSelected] = useState<{ recipe: Recipe; index: number } | null>(null)
  const [showPantryModal, setShowPantryModal] = useState(false)
  const [detectedIngredients, setDetectedIngredients] = useState<Ingredient[]>([])

  useEffect(() => {
    const stored = sessionStorage.getItem('frigochef_recipes')
    if (!stored) { router.replace('/scan'); return }
    setRecipes(JSON.parse(stored))
    const ing = sessionStorage.getItem('frigochef_ingredients')
    if (ing) setDetectedIngredients(JSON.parse(ing))
    // Show pantry prompt after a short delay
    const t = setTimeout(() => setShowPantryModal(true), 1500)
    return () => clearTimeout(t)
  }, [router])

  function open(recipe: Recipe, index: number) {
    setSelected({ recipe, index })
    document.body.style.overflow = 'hidden'
  }
  function close() { setSelected(null); document.body.style.overflow = '' }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/ingredients" className="p-2 -ml-2 text-gray-400 hover:text-gray-700 rounded-xl transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            </Link>
            <span className="font-bold text-gray-900">Frigo<span className="text-green-500">Chef</span></span>
          </div>
          <Link href="/scan" className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">+ Nouvelle photo</Link>
        </div>
      </header>

      <div className="px-6 py-6 pb-3">
        <div className="max-w-lg mx-auto animate-slide-up">
          <h1 className="text-2xl font-black text-gray-900 mb-1">Vos recettes</h1>
          <p className="text-gray-400 text-sm">{recipes.length} recettes générées par l&apos;IA</p>
        </div>
      </div>

      <main className="flex-1 px-6 pb-6">
        <div className="max-w-lg mx-auto flex flex-col gap-4">
          {recipes.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe} index={index} onOpen={() => open(recipe, index)} />
          ))}
        </div>
      </main>

      {selected && <RecipeModal recipe={selected.recipe} index={selected.index} onClose={close} />}

      {showPantryModal && detectedIngredients.length > 0 && (
        <PantryPrompt
          ingredients={detectedIngredients}
          onClose={() => setShowPantryModal(false)}
        />
      )}
    </div>
  )
}

function RecipeCard({ recipe, index, onOpen }: { recipe: Recipe; index: number; onOpen: () => void }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const fb = FALLBACKS[index % FALLBACKS.length]

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md active:scale-[0.99] transition-all duration-300 cursor-pointer animate-slide-up" style={{ animationDelay: `${index * 0.07}s` }} onClick={onOpen}>
      <div className="relative h-52 overflow-hidden bg-gray-100">
        {!error ? (
          <>
            {!loaded && <div className="absolute inset-0 skeleton" />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imgUrl(recipe.title, index)} alt={recipe.title} onLoad={() => setLoaded(true)} onError={() => setError(true)} className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`} loading="lazy" />
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${fb.gradient} flex items-center justify-center`}><span className="text-7xl drop-shadow">{fb.emoji}</span></div>
        )}
        <div className="absolute top-3 right-3 flex gap-1.5">
          <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-full">⏱ {recipe.time}</span>
          {recipe.calories && <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-full">🔥 {recipe.calories}</span>}
        </div>
      </div>
      <div className="p-5">
        <h2 className="font-black text-gray-900 text-[17px] leading-snug mb-1.5">{recipe.title}</h2>
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-4">{recipe.description}</p>
        {recipe.missing.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wide">Manque :</span>
            {recipe.missing.slice(0, 3).map(item => <span key={item} className="bg-amber-50 text-amber-500 text-xs font-medium px-2.5 py-0.5 rounded-lg border border-amber-100">{item}</span>)}
            {recipe.missing.length > 3 && <span className="text-xs text-gray-300">+{recipe.missing.length - 3}</span>}
          </div>
        )}
        <div className="flex items-center justify-between pt-1 border-t border-gray-50">
          <span className="text-xs text-gray-400">{recipe.steps.length} étapes</span>
          <span className="text-sm font-semibold text-gray-900 flex items-center gap-1">Voir la recette <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
        </div>
      </div>
    </div>
  )
}

function RecipeModal({ recipe, index, onClose }: { recipe: Recipe; index: number; onClose: () => void }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const fb = FALLBACKS[index % FALLBACKS.length]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[6px]" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[94vh] bg-white rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden flex flex-col shadow-2xl animate-slide-up">
        <div className="relative h-56 shrink-0 overflow-hidden bg-gray-100">
          {!error ? (
            <>{!loaded && <div className="absolute inset-0 skeleton" />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imgUrl(recipe.title, index)} alt={recipe.title} onLoad={() => setLoaded(true)} onError={() => setError(true)} className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`} /></>
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${fb.gradient} flex items-center justify-center`}><span className="text-8xl drop-shadow">{fb.emoji}</span></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h2 className="text-2xl font-black text-white leading-tight mb-2">{recipe.title}</h2>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">⏱ {recipe.time}</span>
              {recipe.calories && <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">🔥 {recipe.calories}</span>}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-6">
            <p className="text-gray-500 leading-relaxed mb-6 text-sm">{recipe.description}</p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Durée', value: recipe.time, cls: 'bg-gray-50 text-gray-800', sub: 'text-gray-400' },
                { label: 'Calories', value: recipe.calories || '—', cls: 'bg-orange-50 text-orange-600', sub: 'text-orange-300' },
                { label: 'Étapes', value: String(recipe.steps.length), cls: 'bg-green-50 text-green-600', sub: 'text-green-400' },
              ].map(s => (
                <div key={s.label} className={`${s.cls} rounded-2xl p-3.5 text-center`}>
                  <p className="text-base font-black leading-tight">{s.value}</p>
                  <p className={`text-xs mt-0.5 ${s.sub}`}>{s.label}</p>
                </div>
              ))}
            </div>
            {recipe.missing.length > 0 && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6">
                <p className="text-amber-700 font-bold text-sm mb-3">🛒 À acheter</p>
                <div className="flex flex-wrap gap-2">
                  {recipe.missing.map(item => <span key={item} className="bg-white border border-amber-200 text-amber-600 text-sm font-medium px-3 py-1 rounded-xl">{item}</span>)}
                </div>
              </div>
            )}
            <p className="font-black text-gray-900 text-lg mb-4">Préparation</p>
            <ol className="space-y-4">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="shrink-0 w-7 h-7 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center mt-0.5">{i + 1}</span>
                  <p className="text-gray-600 text-sm leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
            <div className="h-8" />
          </div>
        </div>
      </div>
    </div>
  )
}

function PantryPrompt({ ingredients, onClose }: { ingredients: Ingredient[]; onClose: () => void }) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function addToPantry() {
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { onClose(); return }

      const items = ingredients.map(ing => ({
        user_id: user.id,
        name: ing.name,
        quantity: null,
        category: null,
      }))

      await supabase.from('pantry_items').insert(items)
      setSaved(true)
      setTimeout(onClose, 1500)
    } catch {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-t-[2rem] p-6 shadow-2xl animate-slide-up">
        {saved ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">✅</div>
            <p className="font-bold text-gray-900">Ajouté au Pantry !</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">📦</div>
              <div>
                <h3 className="font-black text-gray-900">Ajouter au Pantry ?</h3>
                <p className="text-gray-400 text-xs">{ingredients.length} ingrédients détectés</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {ingredients.slice(0, 8).map(i => (
                <span key={i.id} className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-lg">{i.name}</span>
              ))}
              {ingredients.length > 8 && <span className="text-gray-400 text-xs self-center">+{ingredients.length - 8}</span>}
            </div>
            <div className="flex gap-3">
              <button onClick={addToPantry} disabled={saving} className="flex-1 bg-green-500 hover:bg-green-400 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors">
                {saving ? 'Ajout…' : 'Oui, ajouter'}
              </button>
              <button onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3.5 rounded-xl transition-colors">
                Non, merci
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
