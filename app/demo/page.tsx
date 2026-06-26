'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DemoPage() {
  const router = useRouter()

  useEffect(() => {
    document.cookie = 'frigochef_demo=true; path=/; max-age=86400'
    router.replace('/')
  }, [router])

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-green-400 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white font-semibold">Chargement du mode démo…</p>
      </div>
    </div>
  )
}
