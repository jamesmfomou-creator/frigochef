'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Recipe, Ingredient } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { useProfile } from '@/components/providers/ProfileProvider'
import { trackRecipesGenerated, trackRecipeOpened, trackAccountPromptShown } from '@/lib/analytics'
import PremiumModal from '@/components/premium/PremiumModal'

// Pool de belles photos food fiables (IDs Unsplash vérifiés)
const FOOD_POOL = [
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=500&fit=crop&q=85', // pizza
  'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&h=500&fit=crop&q=85', // pasta carbonara
  'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&h=500&fit=crop&q=85', // saumon
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=500&fit=crop&q=85', // salade colorée
  'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&h=500&fit=crop&q=85', // riz/risotto
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop&q=85', // salade verte
  'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&h=500&fit=crop&q=85', // pâtes
  'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&h=500&fit=crop&q=85', // viande
]

// Correspondance par mots-clés → image spécifique
function imgUrl(title: string, index: number): string {
  const t = title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  if (t.includes('pizza')) return FOOD_POOL[0]
  if (t.includes('pasta') || t.includes('pate') || t.includes('carbonara') || t.includes('spaghetti') || t.includes('tagliatelle')) return FOOD_POOL[1]
  if (t.includes('saumon') || t.includes('salmon') || t.includes('poisson') || t.includes('truite')) return FOOD_POOL[2]
  if (t.includes('salade') || t.includes('nicoise') || t.includes('cesar')) return FOOD_POOL[3]
  if (t.includes('risotto')) return FOOD_POOL[4]
  if (t.includes('soupe') || t.includes('potage') || t.includes('veloute')) return 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=500&fit=crop&q=85'
  if (t.includes('poulet') || t.includes('chicken') || t.includes('roti')) return 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&h=500&fit=crop&q=85'
  if (t.includes('gratin')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Gratin_dauphinois_02.jpg/800px-Gratin_dauphinois_02.jpg'
  if (t.includes('omelette')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Omelet.jpg/800px-Omelet.jpg'
  if (t.includes('tarte') || t.includes('quiche')) return 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800&h=500&fit=crop&q=85'
  if (t.includes('burger') || t.includes('sandwich')) return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=500&fit=crop&q=85'
  if (t.includes('curry') || t.includes('indien')) return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=500&fit=crop&q=85'
  // Photo générique food selon l'index
  return FOOD_POOL[index % FOOD_POOL.length]
}

export default function RecipesPage() {
  const router = useRouter()
  const profile = useProfile()
  const isDemo = profile?.id === 'demo'

  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selected, setSelected] = useState<{ recipe: Recipe; index: number } | null>(null)
  const [showPantryModal, setShowPantryModal] = useState(false)
  const [showAccountPrompt, setShowAccountPrompt] = useState(false)
  const [showPremium, setShowPremium] = useState(false)
  const [detectedIngredients, setDetectedIngredients] = useState<Ingredient[]>([])

  useEffect(() => {
    const stored = sessionStorage.getItem('frigochef_recipes')
    if (!stored) { router.replace('/scan'); return }
    const parsed = JSON.parse(stored)
    setRecipes(parsed)
    const ing = sessionStorage.getItem('frigochef_ingredients')
    const parsedIng = ing ? JSON.parse(ing) : []
    if (parsedIng.length) setDetectedIngredients(parsedIng)
    trackRecipesGenerated(parsed.length, parsedIng.length)

    if (isDemo) {
      // En mode démo : montrer la création de compte après 2s
      const t = setTimeout(() => { setShowAccountPrompt(true); trackAccountPromptShown() }, 2000)
      return () => clearTimeout(t)
    } else {
      // Utilisateur connecté : prompt pantry après 1.5s
      const t = setTimeout(() => setShowPantryModal(true), 1500)
      return () => clearTimeout(t)
    }
  }, [router, isDemo])

  function open(recipe: Recipe, index: number) {
    setSelected({ recipe, index })
    document.body.style.overflow = 'hidden'
    trackRecipeOpened(recipe.title)
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

      {showAccountPrompt && (
        <AccountCreationPrompt
          recipesCount={recipes.length}
          onClose={() => {
            setShowAccountPrompt(false)
            // Paywall 5s après refus de créer un compte
            setTimeout(() => setShowPremium(true), 5000)
          }}
        />
      )}

      {showPremium && <PremiumModal onClose={() => setShowPremium(false)} />}
    </div>
  )
}

function RecipeCard({ recipe, index, onOpen }: { recipe: Recipe; index: number; onOpen: () => void }) {
  const [loaded, setLoaded] = useState(false)
  const [attempt, setAttempt] = useState(0)

  // Si l'image principale échoue → fallback generic food photo
  const sources = [imgUrl(recipe.title, index), FOOD_POOL[(index + 2) % FOOD_POOL.length]]
  const src = sources[Math.min(attempt, sources.length - 1)]

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md active:scale-[0.99] transition-all duration-300 cursor-pointer animate-slide-up" style={{ animationDelay: `${index * 0.07}s` }} onClick={onOpen}>
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <>
          {!loaded && <div className="absolute inset-0 skeleton" />}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={src}
            src={src}
            alt={recipe.title}
            onLoad={() => setLoaded(true)}
            onError={() => { setLoaded(false); setAttempt(a => a + 1) }}
            className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
          />
        </>
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
  const [attempt, setAttempt] = useState(0)

  const sources = [imgUrl(recipe.title, index), FOOD_POOL[(index + 3) % FOOD_POOL.length]]
  const src = sources[Math.min(attempt, sources.length - 1)]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[6px]" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[94vh] bg-white rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden flex flex-col shadow-2xl animate-slide-up">
        <div className="relative h-56 shrink-0 overflow-hidden bg-gray-900">
          {!loaded && <div className="absolute inset-0 skeleton" />}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={src}
            src={src}
            alt={recipe.title}
            onLoad={() => setLoaded(true)}
            onError={() => { setLoaded(false); setAttempt(a => a + 1) }}
            className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          />
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

function AccountCreationPrompt({ recipesCount, onClose }: { recipesCount: number; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-t-[2rem] p-6 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-2xl shrink-0">🎉</div>
          <div>
            <h3 className="font-black text-gray-900 text-lg leading-tight">
              {recipesCount} recettes générées !
            </h3>
            <p className="text-gray-400 text-sm mt-0.5">Créez un compte pour les sauvegarder</p>
          </div>
          <button onClick={onClose} className="ml-auto text-gray-300 hover:text-gray-500 transition-colors shrink-0 p-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Benefits */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-5 space-y-2.5">
          {[
            { icon: '💾', text: 'Sauvegardez toutes vos recettes' },
            { icon: '📦', text: 'Accédez au Pantry intelligent' },
            { icon: '📅', text: 'Planifiez votre semaine automatiquement' },
            { icon: '♻️', text: 'Réduisez le gaspillage alimentaire' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-sm text-gray-600">
              <span>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <a
            href="/login"
            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold py-4 rounded-2xl transition-colors shadow-lg shadow-green-500/20"
          >
            Créer mon compte gratuit →
          </a>
          <button
            onClick={onClose}
            className="w-full text-gray-400 hover:text-gray-600 text-sm font-medium py-2 transition-colors"
          >
            Continuer sans compte
          </button>
        </div>

        <p className="text-center text-gray-300 text-xs mt-3">
          Gratuit · Sans carte bancaire · En 30 secondes
        </p>
      </div>
    </div>
  )
}
