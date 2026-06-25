'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MealPlan, MealPlanDay, DAYS_FR, DayFR } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { useProfile } from '@/components/providers/ProfileProvider'
import PremiumModal from '@/components/premium/PremiumModal'

const DAY_LABELS: Record<DayFR, string> = {
  lundi: 'Lundi', mardi: 'Mardi', mercredi: 'Mercredi',
  jeudi: 'Jeudi', vendredi: 'Vendredi', samedi: 'Samedi', dimanche: 'Dimanche',
}

export default function PlanningPage() {
  const profile = useProfile()
  const router = useRouter()
  const [plan, setPlan] = useState<MealPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState<{ day: DayFR; meal: MealPlanDay } | null>(null)
  const supabase = createClient()

  const isPremium = profile?.plan === 'premium'

  useEffect(() => {
    if (!isPremium) return
    loadPlan()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPremium])

  async function loadPlan() {
    setLoading(true)
    const { data } = await supabase
      .from('meal_plans')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single<MealPlan>()
    setPlan(data)
    setLoading(false)
  }

  async function generateWeek() {
    setGenerating(true)
    try {
      const { data: pantryData } = await supabase.from('pantry_items').select('name')
      const pantryIngredients = (pantryData ?? []).map((i: { name: string }) => i.name)

      const res = await fetch('/api/planning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pantryIngredients }),
      })
      const data = await res.json()
      if (!data.days) throw new Error()

      const weekStart = getMonday()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: saved } = await supabase
        .from('meal_plans')
        .upsert({ user_id: user.id, week_start: weekStart, days: data.days }, { onConflict: 'user_id,week_start' })
        .select()
        .single<MealPlan>()

      setPlan(saved)
    } catch {
      alert('Erreur lors de la génération. Réessayez.')
    } finally {
      setGenerating(false)
    }
  }

  function getMonday(): string {
    const d = new Date()
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    d.setDate(diff)
    return d.toISOString().split('T')[0]
  }

  if (!isPremium) return <PremiumGate />

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <header className="bg-white border-b border-gray-100 px-6 pt-8 pb-5">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-black text-gray-900 mb-1">Planning</h1>
          <p className="text-gray-400 text-sm">
            {plan ? `Semaine du ${new Date(plan.week_start).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}` : 'Générez votre semaine de repas'}
          </p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5">
        {/* Generate button */}
        <button
          onClick={generateWeek}
          disabled={generating || loading}
          className="w-full bg-green-500 hover:bg-green-400 active:scale-[0.98] disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-all mb-5 shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
        >
          {generating ? (
            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Génération en cours…</>
          ) : (
            <>{plan ? '🔄 Regénérer ma semaine' : '✨ Générer ma semaine'}</>
          )}
        </button>

        {loading ? (
          <div className="space-y-3">{[1,2,3,4,5,6,7].map(n => <div key={n} className="h-24 bg-white rounded-2xl skeleton" />)}</div>
        ) : !plan ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="font-black text-gray-900 text-lg mb-2">Aucun planning</h3>
            <p className="text-gray-400 text-sm">Cliquez sur &quot;Générer ma semaine&quot; pour créer votre planning</p>
          </div>
        ) : (
          <div className="space-y-3">
            {DAYS_FR.map(day => {
              const meal = plan.days[day as keyof typeof plan.days]
              const isToday = getDayKey() === day
              return (
                <div
                  key={day}
                  onClick={() => meal && setSelectedMeal({ day, meal })}
                  className={`bg-white rounded-2xl p-4 border shadow-sm transition-all ${meal ? 'cursor-pointer hover:shadow-md active:scale-[0.99]' : 'opacity-60'} ${isToday ? 'border-green-200 ring-2 ring-green-100' : 'border-gray-100'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`text-xs font-black w-10 text-center py-1 rounded-lg ${isToday ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {DAY_LABELS[day].slice(0, 3).toUpperCase()}
                      </div>
                      <div>
                        {meal ? (
                          <>
                            <p className="font-bold text-gray-900 text-sm">{meal.title}</p>
                            <p className="text-xs text-gray-400">{meal.time} · {meal.calories}</p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-400">Aucun repas</p>
                        )}
                      </div>
                    </div>
                    {meal && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {selectedMeal && (
        <MealModal meal={selectedMeal.meal} day={selectedMeal.day} onClose={() => setSelectedMeal(null)} />
      )}
    </div>
  )
}

function getDayKey(): DayFR {
  const keys = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'] as DayFR[]
  return keys[new Date().getDay()]
}

function MealModal({ meal, day, onClose }: { meal: MealPlanDay; day: DayFR; onClose: () => void }) {
  const DAY_LABELS: Record<DayFR, string> = {
    lundi: 'Lundi', mardi: 'Mardi', mercredi: 'Mercredi',
    jeudi: 'Jeudi', vendredi: 'Vendredi', samedi: 'Samedi', dimanche: 'Dimanche',
  }
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-t-[2rem] p-6 shadow-2xl animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-black bg-green-100 text-green-700 px-3 py-1.5 rounded-full uppercase tracking-wide">{DAY_LABELS[day]}</span>
          <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <h3 className="text-xl font-black text-gray-900 mb-1">{meal.title}</h3>
        <div className="flex gap-2 mb-4">
          <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">⏱ {meal.time}</span>
          <span className="bg-orange-50 text-orange-500 text-xs font-medium px-2.5 py-1 rounded-full">🔥 {meal.calories}</span>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed">{meal.description}</p>
      </div>
    </div>
  )
}

function PremiumGate() {
  const [show, setShow] = useState(true)
  const router = useRouter()
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center px-6 text-center">
      <div className="text-5xl mb-4">📅</div>
      <h2 className="text-xl font-black text-gray-900 mb-2">Planning automatique</h2>
      <p className="text-gray-500 text-sm mb-6">Générez une semaine de repas avec l&apos;IA en un clic. Fonctionnalité Premium.</p>
      <button onClick={() => setShow(true)} className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-4 rounded-2xl transition-colors">⭐ Passer Premium</button>
      <button onClick={() => router.back()} className="mt-4 text-gray-400 text-sm hover:text-gray-600 transition-colors">← Retour</button>
      {show && <PremiumModal onClose={() => setShow(false)} />}
    </div>
  )
}
