'use client'

import { createContext, useContext } from 'react'
import { Profile } from '@/lib/types'

const ProfileContext = createContext<Profile | null>(null)

export function useProfile() {
  return useContext(ProfileContext)
}

export default function ProfileProvider({
  children,
  profile,
}: {
  children: React.ReactNode
  profile: Profile | null
}) {
  return <ProfileContext.Provider value={profile}>{children}</ProfileContext.Provider>
}
