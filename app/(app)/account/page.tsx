'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProfile } from '@/components/providers/ProfileProvider'
import { safeCreateClient } from '@/lib/supabase/client'
import PremiumModal from '@/components/premium/PremiumModal'
import { FREE_SCAN_LIMIT } from '@/lib/types'

export default function AccountPage() {
  const profile = useProfile()
  const router = useRouter()
  const [showPremium, setShowPremium] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const isPremium = profile?.plan === 'premium'
  const isDemo = profile?.id === 'demo'
  const initial = (profile?.name?.[0] ?? profile?.email?.[0] ?? 'U').toUpperCase()

  async function signOut() {
    if (isDemo) {
      document.cookie = 'frigochef_demo=; path=/; max-age=0'
      router.push('/')
      return
    }
    setLoggingOut(true)
    const supabase = safeCreateClient()
    if (supabase) await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <header className="bg-white border-b border-gray-100 px-6 pt-8 pb-5">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-black text-gray-900">Mon compte</h1>
          <a
            href="/"
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Accueil
          </a>
        </div>
      </header>
      <main className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {/* Profile card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 font-black text-xl">
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover rounded-2xl" />
              ) : initial}
            </div>
            <div>
              <p className="font-black text-gray-900 text-lg">{isDemo ? 'Mode Démo' : (profile?.name ?? 'Utilisateur')}</p>
              <p className="text-gray-400 text-sm">{isDemo ? 'demo@frigochef.app' : profile?.email}</p>
              <span className={`inline-flex items-center gap-1 text-xs font-bold mt-1 px-2.5 py-0.5 rounded-full ${isPremium ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
                {isPremium ? '⭐ Premium' : '🆓 Gratuit'}
              </span>
            </div>
          </div>
        </div>

        {/* Usage for free users */}
        {!isPremium && !isDemo && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="font-bold text-gray-900 mb-3">Utilisation ce mois</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Scans utilisés</span>
              <span className="text-sm font-semibold text-gray-900">{profile?.scan_count ?? 0} / {FREE_SCAN_LIMIT}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div className={`h-full rounded-full transition-all ${(profile?.scan_count ?? 0) >= FREE_SCAN_LIMIT ? 'bg-red-400' : 'bg-green-500'}`} style={{ width: `${Math.min(100, ((profile?.scan_count ?? 0) / FREE_SCAN_LIMIT) * 100)}%` }} />
            </div>
            <p className="text-xs text-gray-400">Réinitialisation le 1er du mois</p>
          </div>
        )}

        {/* Premium CTA */}
        {!isPremium && (
          <button onClick={() => setShowPremium(true)} className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold py-5 rounded-2xl shadow-lg shadow-amber-500/20 transition-all hover:opacity-90 active:scale-[0.98]">
            ⭐ Passer Premium
            <p className="text-xs font-normal opacity-80 mt-0.5">Scans illimités · Pantry · Planning · Courses</p>
          </button>
        )}

        {/* Menu */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <MenuItem icon="📸" label="Scanner" href="/scan" />
          <MenuItem icon="📦" label="Mon Pantry" href="/pantry" premium={!isPremium} />
          <MenuItem icon="📅" label="Planning" href="/planning" premium={!isPremium} />
          <MenuItem icon="🛒" label="Courses" href="/courses" premium={!isPremium} />
          <MenuItem icon="📋" label="Historique" href="/history" premium={!isPremium} />
        </div>

        {/* Retour à l'accueil */}
        <a
          href="/"
          className="w-full flex items-center justify-center gap-2 bg-white text-gray-600 font-semibold py-4 rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Retour à l&apos;accueil
        </a>

        <button onClick={signOut} disabled={loggingOut} className="w-full bg-white text-red-500 font-semibold py-4 rounded-2xl border border-gray-100 shadow-sm hover:bg-red-50 transition-colors disabled:opacity-60">
          {loggingOut ? 'Déconnexion…' : isDemo ? 'Quitter le mode démo' : 'Se déconnecter'}
        </button>

        <p className="text-center text-gray-400 text-xs pb-2">FrigoChef V2 · <span className="text-green-500">●</span> Actif</p>
      </main>
      {showPremium && <PremiumModal onClose={() => setShowPremium(false)} />}
    </div>
  )
}

function MenuItem({ icon, label, href, premium }: { icon: string; label: string; href: string; premium?: boolean }) {
  return (
    <a href={href} className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
      <span className="text-lg">{icon}</span>
      <span className="flex-1 text-sm font-medium text-gray-700">{label}</span>
      {premium && <span className="text-xs bg-amber-100 text-amber-500 font-semibold px-2 py-0.5 rounded-full">Premium</span>}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
    </a>
  )
}
