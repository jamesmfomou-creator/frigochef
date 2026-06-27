'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Profile, PantryItem, MealPlanDay, FREE_SCAN_LIMIT } from '@/lib/types'
import PremiumModal from '@/components/premium/PremiumModal'
import { trackPurchase, trackPremiumModalShown } from '@/lib/analytics'

interface Props {
  profile: Profile | null
  pantryCount: number
  urgentItems: PantryItem[]
  todayMeal: MealPlanDay | null
  mealPlanWeekStart: string | null
  pendingShoppingCount: number
  recipeCount: number
  totalScans: number
  scansRemaining: number
}

export default function DashboardClient({
  profile,
  pantryCount,
  urgentItems,
  todayMeal,
  mealPlanWeekStart,
  pendingShoppingCount,
  recipeCount,
  totalScans,
  scansRemaining,
}: Props) {
  const [showPremium, setShowPremium] = useState(false)
  const [upgraded, setUpgraded] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const isPremium = profile?.plan === 'premium'
  const isDemo = profile?.id === 'demo'

  useEffect(() => {
    if (searchParams.get('upgraded') === 'true') {
      setUpgraded(true)
      trackPurchase(`stripe_${Date.now()}`, 9.99)
      router.replace('/dashboard', { scroll: false })
    }
  }, [searchParams, router])

  // Paywall après création de compte (free, non démo)
  useEffect(() => {
    if (isPremium || isDemo) return
    if (typeof window === 'undefined') return
    // Si l'utilisateur avait l'intent d'upgrade depuis la démo → afficher immédiatement
    if (localStorage.getItem('frigochef_upgrade_intent')) {
      localStorage.removeItem('frigochef_upgrade_intent')
      setShowPremium(true)
      return
    }
    // Sinon → paywall 5s après la première visite du dashboard
    const key = 'frigochef_paywall_shown'
    if (!localStorage.getItem(key)) {
      const t = setTimeout(() => {
        setShowPremium(true)
        localStorage.setItem(key, '1')
      }, 5000)
      return () => clearTimeout(t)
    }
  }, [isPremium, isDemo])
  const firstName = profile?.name?.split(' ')[0] ?? 'vous'
  const estimatedSavings = Math.round(totalScans * 1.5)

  function openPremiumModal(source: string) {
    setShowPremium(true)
    trackPremiumModalShown(source)
  }

  function premiumGate(href: string) {
    if (isPremium) return href
    return undefined
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 pt-8 pb-5">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Bonjour,</p>
            <h1 className="text-2xl font-black text-gray-900 capitalize">{firstName} 👋</h1>
          </div>
          <Link href="/account">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">
              {(profile?.name?.[0] ?? profile?.email?.[0] ?? 'U').toUpperCase()}
            </div>
          </Link>
        </div>
        {/* Scan counter — masqué en démo */}
        {!isPremium && !isDemo && (
          <div className="max-w-lg mx-auto mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-400">Scans ce mois</span>
              <span className="text-xs font-semibold text-gray-600">
                {FREE_SCAN_LIMIT - scansRemaining}/{FREE_SCAN_LIMIT}
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${((FREE_SCAN_LIMIT - scansRemaining) / FREE_SCAN_LIMIT) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">

        {/* 🍳 Aujourd'hui */}
        <DashCard
          emoji="🍳"
          title="Aujourd'hui"
          color="green"
        >
          {todayMeal ? (
            <div>
              <p className="font-bold text-gray-900 text-lg leading-tight">{todayMeal.title}</p>
              <p className="text-gray-400 text-sm mt-0.5">{todayMeal.time} · {todayMeal.calories}</p>
              <LinkButton href="/planning" className="mt-3">Voir la recette →</LinkButton>
            </div>
          ) : (
            <div>
              <p className="text-gray-500 text-sm mb-3">
                {recipeCount > 0
                  ? `${recipeCount} recette${recipeCount > 1 ? 's' : ''} sauvegardée${recipeCount > 1 ? 's' : ''} disponible${recipeCount > 1 ? 's' : ''}`
                  : 'Scannez vos ingrédients pour commencer'}
              </p>
              <LinkButton href="/scan">
                {recipeCount > 0 ? 'Voir les recettes →' : 'Scanner maintenant →'}
              </LinkButton>
            </div>
          )}
        </DashCard>

        {/* 🥦 À utiliser rapidement */}
        <DashCard emoji="🥦" title="À utiliser rapidement" color="amber">
          {urgentItems.length > 0 ? (
            <div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {urgentItems.slice(0, 5).map(item => (
                  <span key={item.id} className="bg-amber-100 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-lg">
                    {item.name}
                  </span>
                ))}
                {urgentItems.length > 5 && (
                  <span className="text-amber-400 text-xs self-center">+{urgentItems.length - 5}</span>
                )}
              </div>
              <LinkButton
                href={isPremium ? '/scan' : undefined}
                onClick={!isPremium ? () => setShowPremium(true) : undefined}
              >
                Utiliser maintenant →
              </LinkButton>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              {pantryCount > 0
                ? 'Tous vos ingrédients sont frais 🎉'
                : 'Ajoutez des ingrédients à votre Pantry'}
            </p>
          )}
        </DashCard>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard value={totalScans.toString()} label="Repas préparés" color="blue" />
          <StatCard value={`${estimatedSavings}€`} label="Économisés" color="green" />
          <StatCard value={pantryCount.toString()} label="Ingrédients" color="purple" />
        </div>

        {/* 🛒 Courses */}
        <DashCard emoji="🛒" title="Courses" color="blue">
          {pendingShoppingCount > 0 ? (
            <div>
              <p className="text-gray-600 text-sm mb-3">
                <span className="font-bold text-gray-900">{pendingShoppingCount} article{pendingShoppingCount > 1 ? 's' : ''}</span> à acheter
              </p>
              <LinkButton
                href={isPremium ? '/courses' : undefined}
                onClick={!isPremium ? () => setShowPremium(true) : undefined}
              >
                Voir ma liste →
              </LinkButton>
            </div>
          ) : (
            <div>
              <p className="text-gray-400 text-sm mb-3">Votre liste est vide</p>
              <LinkButton
                href={isPremium ? '/courses' : undefined}
                onClick={!isPremium ? () => setShowPremium(true) : undefined}
                locked={!isPremium}
              >
                {isPremium ? 'Générer ma liste →' : '🔒 Premium requis'}
              </LinkButton>
            </div>
          )}
        </DashCard>

        {/* 📅 Planning */}
        <DashCard emoji="📅" title="Planning de la semaine" color="violet">
          {mealPlanWeekStart ? (
            <div>
              <p className="text-gray-500 text-sm mb-3">
                Semaine du {new Date(mealPlanWeekStart).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
              </p>
              <LinkButton href={isPremium ? '/planning' : undefined} onClick={!isPremium ? () => setShowPremium(true) : undefined}>
                Voir le planning →
              </LinkButton>
            </div>
          ) : (
            <div>
              <p className="text-gray-400 text-sm mb-3">Aucun planning cette semaine</p>
              <LinkButton
                href={isPremium ? '/planning' : undefined}
                onClick={!isPremium ? () => setShowPremium(true) : undefined}
                locked={!isPremium}
              >
                {isPremium ? 'Générer ma semaine →' : '🔒 Premium requis'}
              </LinkButton>
            </div>
          )}
        </DashCard>

        {/* 📦 Pantry */}
        <DashCard emoji="📦" title="Mon Pantry" color="gray">
          <div>
            <p className="text-gray-500 text-sm mb-3">
              {pantryCount > 0
                ? <><span className="font-bold text-gray-900">{pantryCount}</span> ingrédient{pantryCount > 1 ? 's' : ''} disponible{pantryCount > 1 ? 's' : ''}</>
                : 'Votre garde-manger est vide'}
            </p>
            <LinkButton
              href={isPremium ? '/pantry' : undefined}
              onClick={!isPremium ? () => setShowPremium(true) : undefined}
              locked={!isPremium}
            >
              {isPremium ? 'Voir mon Pantry →' : '🔒 Premium requis'}
            </LinkButton>
          </div>
        </DashCard>

        {/* Scanner CTA */}
        {scansRemaining > 0 ? (
          <Link
            href="/scan"
            className="flex items-center justify-center gap-3 w-full bg-gray-900 hover:bg-gray-800 active:scale-[0.98] text-white font-bold py-5 rounded-2xl transition-all duration-200 shadow-lg"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
            </svg>
            Scanner mes ingrédients
          </Link>
        ) : (
          <button
            onClick={() => setShowPremium(true)}
            className="w-full bg-amber-500 hover:bg-amber-400 text-white font-bold py-5 rounded-2xl transition-all duration-200"
          >
            ⭐ Limite atteinte — Passer Premium
          </button>
        )}
      </div>

      {showPremium && <PremiumModal onClose={() => setShowPremium(false)} />}

      {/* Bannière succès paiement */}
      {upgraded && (
        <div className="fixed bottom-24 left-4 right-4 max-w-lg mx-auto bg-gray-900 text-white rounded-2xl px-5 py-4 flex items-center gap-3 shadow-2xl z-50 animate-slide-up">
          <span className="text-2xl">⭐</span>
          <div className="flex-1">
            <p className="font-bold text-sm">Bienvenue en Premium !</p>
            <p className="text-gray-400 text-xs">Toutes les fonctionnalités sont débloquées.</p>
          </div>
          <button onClick={() => setUpgraded(false)} className="text-gray-500 hover:text-gray-300 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      )}
    </div>
  )
}

function DashCard({ emoji, title, color, children }: {
  emoji: string
  title: string
  color: 'green' | 'amber' | 'blue' | 'violet' | 'gray'
  children: React.ReactNode
}) {
  const dot: Record<string, string> = {
    green: 'bg-green-400',
    amber: 'bg-amber-400',
    blue: 'bg-blue-400',
    violet: 'bg-violet-400',
    gray: 'bg-gray-300',
  }
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{emoji}</span>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{title}</span>
        <span className={`ml-auto w-1.5 h-1.5 rounded-full ${dot[color]}`} />
      </div>
      {children}
    </div>
  )
}

function StatCard({ value, label, color }: { value: string; label: string; color: 'green' | 'blue' | 'purple' }) {
  const cls: Record<string, string> = {
    green: 'bg-green-50 text-green-700',
    blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-violet-50 text-violet-700',
  }
  const sub: Record<string, string> = {
    green: 'text-green-400',
    blue: 'text-blue-400',
    purple: 'text-violet-400',
  }
  return (
    <div className={`${cls[color]} rounded-2xl p-4 text-center`}>
      <p className="text-xl font-black leading-tight">{value}</p>
      <p className={`text-[10px] font-medium mt-0.5 ${sub[color]}`}>{label}</p>
    </div>
  )
}

function LinkButton({
  href,
  onClick,
  locked,
  className = '',
  children,
}: {
  href?: string
  onClick?: () => void
  locked?: boolean
  className?: string
  children: React.ReactNode
}) {
  const base = `inline-flex items-center text-sm font-semibold transition-colors ${locked ? 'text-gray-400' : 'text-gray-900 hover:text-green-600'} ${className}`
  if (href) return <Link href={href} className={base}>{children}</Link>
  return <button onClick={onClick} className={base}>{children}</button>
}
