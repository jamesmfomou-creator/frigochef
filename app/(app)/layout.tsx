import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Profile } from '@/lib/types'
import ProfileProvider from '@/components/providers/ProfileProvider'
import BottomNav from '@/components/navigation/BottomNav'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
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
      <div className="min-h-screen bg-[#F8F9FA] pb-24">
        {children}
      </div>
      <BottomNav />
    </ProfileProvider>
  )
}
