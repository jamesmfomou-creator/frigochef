import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { Profile } from '@/lib/types'
import ProfileProvider from '@/components/providers/ProfileProvider'
import BottomNav from '@/components/navigation/BottomNav'

// Démo = plan free (scan illimité bypassed dans scan page via isDemo)
// Pantry/Planning/Courses → PremiumGate → PremiumModal détecte isDemo → "Créer un compte"
const DEMO_PROFILE: Profile = {
  id: 'demo',
  email: 'demo@frigochef.app',
  name: 'Demo',
  avatar_url: null,
  plan: 'free',
  scan_count: 0,
  scan_reset_date: new Date().toISOString().split('T')[0],
  created_at: new Date().toISOString(),
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  let cookieStore
  try {
    cookieStore = await cookies()
  } catch {
    redirect('/login')
  }

  const isDemo = cookieStore?.get('frigochef_demo')?.value === 'true'

  if (isDemo) {
    return (
      <ProfileProvider profile={DEMO_PROFILE}>
        <div className="min-h-screen bg-[#F8F9FA] pb-24">{children}</div>
        <BottomNav />
      </ProfileProvider>
    )
  }

  let profile: Profile | null = null

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single<Profile>()

    profile = data
  } catch (err) {
    const e = err as { digest?: string }
    if (e?.digest?.startsWith('NEXT_REDIRECT')) throw err
    redirect('/login')
  }

  return (
    <ProfileProvider profile={profile}>
      <div className="min-h-screen bg-[#F8F9FA] pb-24">{children}</div>
      <BottomNav />
    </ProfileProvider>
  )
}
