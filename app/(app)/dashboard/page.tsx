import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Profile, PantryItem, MealPlan, ShoppingList, FREE_SCAN_LIMIT } from '@/lib/types'
import DashboardClient from './DashboardClient'

const DEMO_PROFILE: Profile = {
  id: 'demo',
  email: 'demo@frigochef.app',
  name: 'Demo',
  avatar_url: null,
  plan: 'premium',
  scan_count: 0,
  scan_reset_date: new Date().toISOString().split('T')[0],
  created_at: new Date().toISOString(),
}

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const isDemo = cookieStore.get('frigochef_demo')?.value === 'true'

  // Demo mode — skip all Supabase calls
  if (isDemo) {
    return (
      <DashboardClient
        profile={DEMO_PROFILE}
        pantryCount={0}
        urgentItems={[]}
        todayMeal={null}
        mealPlanWeekStart={null}
        pendingShoppingCount={0}
        recipeCount={0}
        totalScans={0}
        scansRemaining={Infinity}
      />
    )
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const [
      { data: profile },
      { data: pantryItems },
      { data: recentMealPlan },
      { data: shoppingList },
      { count: recipeCount },
      { count: scanCount },
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single<Profile>(),
      supabase.from('pantry_items').select('*').eq('user_id', user.id).order('added_at', { ascending: false }),
      supabase.from('meal_plans').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).single<MealPlan>(),
      supabase.from('shopping_lists').select('*').eq('user_id', user.id).single<ShoppingList>(),
      supabase.from('saved_recipes').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('scans').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    ])

    const pantry = (pantryItems ?? []) as PantryItem[]
    const now = new Date()
    const urgentItems = pantry.filter(item =>
      Math.floor((now.getTime() - new Date(item.added_at).getTime()) / 86400000) >= 5
    )
    const dayKeys = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
    const todayKey = dayKeys[now.getDay()]
    const todayMeal = recentMealPlan?.days?.[todayKey as keyof typeof recentMealPlan.days] ?? null
    const pendingItems = (shoppingList?.items ?? []).filter((i: { checked: boolean }) => !i.checked)
    const scansRemaining = profile?.plan === 'premium'
      ? Infinity
      : Math.max(0, FREE_SCAN_LIMIT - (profile?.scan_count ?? 0))

    return (
      <DashboardClient
        profile={profile}
        pantryCount={pantry.length}
        urgentItems={urgentItems}
        todayMeal={todayMeal}
        mealPlanWeekStart={recentMealPlan?.week_start ?? null}
        pendingShoppingCount={pendingItems.length}
        recipeCount={recipeCount ?? 0}
        totalScans={scanCount ?? 0}
        scansRemaining={scansRemaining}
      />
    )
  } catch (err) {
    const e = err as { digest?: string }
    if (e?.digest?.startsWith('NEXT_REDIRECT')) throw err
    redirect('/login')
  }
}
