'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Scan, SavedRecipe } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { useProfile } from '@/components/providers/ProfileProvider'
import PremiumModal from '@/components/premium/PremiumModal'

type Tab = 'scans' | 'recipes'

export default function HistoryPage() {
  const profile = useProfile()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('scans')
  const [scans, setScans] = useState<Scan[]>([])
  const [recipes, setRecipes] = useState<SavedRecipe[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const isPremium = profile?.plan === 'premium'

  useEffect(() => {
    if (!isPremium) return
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPremium])

  async function load() {
    setLoading(true)
    const [{ data: s }, { data: r }] = await Promise.all([
      supabase.from('scans').select('*').order('created_at', { ascending: false }).limit(20),
      supabase.from('saved_recipes').select('*').order('created_at', { ascending: false }).limit(50),
    ])
    setScans((s as Scan[]) ?? [])
    setRecipes((r as SavedRecipe[]) ?? [])
    setLoading(false)
  }

  function replayScan(scan: Scan) {
    sessionStorage.setItem('frigochef_ingredients', JSON.stringify(scan.ingredients))
    router.push('/ingredients')
  }

  if (!isPremium) return <PremiumGate />

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <header className="bg-white border-b border-gray-100 px-6 pt-8 pb-5">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-black text-gray-900 mb-4">Historique</h1>
          <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
            {(['scans', 'recipes'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
              >
                {t === 'scans' ? `Scans (${scans.length})` : `Recettes (${recipes.length})`}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5">
        {loading ? (
          <div className="space-y-3">{[1,2,3,4,5].map(n => <div key={n} className="h-20 bg-white rounded-2xl skeleton" />)}</div>
        ) : tab === 'scans' ? (
          scans.length === 0 ? (
            <EmptyHistory label="scans" />
          ) : (
            <div className="space-y-3">
              {scans.map(scan => (
                <div key={scan.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 mb-2">
                        {new Date(scan.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {scan.ingredients.slice(0, 6).map((ing, i) => (
                          <span key={i} className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-lg">{ing.name}</span>
                        ))}
                        {scan.ingredients.length > 6 && <span className="text-xs text-gray-400">+{scan.ingredients.length - 6}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => replayScan(scan)}
                      className="shrink-0 bg-green-50 hover:bg-green-100 text-green-600 text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors"
                    >
                      Relancer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          recipes.length === 0 ? (
            <EmptyHistory label="recettes" />
          ) : (
            <div className="space-y-3">
              {recipes.map(recipe => (
                <div key={recipe.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <p className="text-xs text-gray-400 mb-1">
                    {new Date(recipe.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                  </p>
                  <p className="font-bold text-gray-900 text-sm mb-1">{recipe.title}</p>
                  <div className="flex gap-2">
                    <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">⏱ {recipe.time}</span>
                    {recipe.calories && <span className="bg-orange-50 text-orange-500 text-xs px-2 py-0.5 rounded-full">🔥 {recipe.calories}</span>}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  )
}

function EmptyHistory({ label }: { label: string }) {
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-4">📋</div>
      <h3 className="font-black text-gray-900 text-lg mb-2">Aucun historique</h3>
      <p className="text-gray-400 text-sm">Vos {label} apparaîtront ici</p>
      <Link href="/scan" className="inline-block mt-4 bg-green-500 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors hover:bg-green-400">
        Scanner maintenant
      </Link>
    </div>
  )
}

function PremiumGate() {
  const [show, setShow] = useState(true)
  const router = useRouter()
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center px-6 text-center">
      <div className="text-5xl mb-4">📋</div>
      <h2 className="text-xl font-black text-gray-900 mb-2">Historique complet</h2>
      <p className="text-gray-500 text-sm mb-6">Retrouvez tous vos scans et recettes passés. Fonctionnalité Premium.</p>
      <button onClick={() => setShow(true)} className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-4 rounded-2xl transition-colors">⭐ Passer Premium</button>
      <button onClick={() => router.back()} className="mt-4 text-gray-400 text-sm hover:text-gray-600 transition-colors">← Retour</button>
      {show && <PremiumModal onClose={() => setShow(false)} />}
    </div>
  )
}
