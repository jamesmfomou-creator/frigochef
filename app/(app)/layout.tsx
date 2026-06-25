import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { Profile } from '@/lib/types'
import ProfileProvider from '@/components/providers/ProfileProvider'
import BottomNav from '@/components/navigation/BottomNav'

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

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const isDemo = cookieStore.get('frigochef_demo')?.value === 'true'

  if (isDemo) {
    return (
      <ProfileProvider profile={DEMO_PROFILE}>
        <div className="min-h-screen bg-[#F8F9FA] pb-24">{children}</div>
        <BottomNav />
      </ProfileProvider>
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<Profile>()

  return (
    <ProfileProvider profile={profile}>
      <div className="min-h-screen bg-[#F8F9FA] pb-24">{children}</div>
      <BottomNav />
    </ProfileProvider>
  )
}
