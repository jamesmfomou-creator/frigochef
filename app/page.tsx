import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#0B0B0B] flex flex-col overflow-hidden">
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(34,197,94,0.18),transparent)]" />

      {/* Header */}
      <header className="relative z-10 px-6 pt-8">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="text-white font-bold text-xl tracking-tight">
            Frigo<span className="text-green-400">Chef</span>
          </span>
          <Link
            href="/scan"
            className="text-sm text-gray-400 hover:text-white transition-colors font-medium"
          >
            Essayer →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pb-24">
        {/* Title */}
        <h1 className="text-6xl sm:text-7xl font-black text-white tracking-tight leading-[1.04] mb-5 animate-slide-up">
          Ouvre ton frigo.
        </h1>
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-8 animate-slide-up animation-delay-100">
          <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
            On trouve ton repas.
          </span>
        </h2>

        {/* Description */}
        <p className="text-gray-500 max-w-xs sm:max-w-sm text-lg leading-relaxed mb-12 animate-fade-in animation-delay-200">
          Une photo suffit. L&apos;IA détecte vos ingrédients et génère 5 recettes adaptées en quelques secondes.
        </p>

        {/* CTA */}
        <div className="animate-slide-up animation-delay-300">
          <Link
            href="/scan"
            className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-400 active:scale-95 text-white text-lg font-bold px-10 py-5 rounded-2xl shadow-lg shadow-green-500/30 transition-all duration-200"
          >
            <CameraIcon />
            Scanner mes ingrédients
          </Link>
          <p className="text-gray-600 text-sm mt-5">
            Gratuit · Instantané · Sans inscription
          </p>
        </div>

        {/* Feature row */}
        <div className="flex flex-wrap justify-center gap-3 mt-16 animate-fade-in animation-delay-500">
          {[
            { icon: '📸', label: 'Photo ou galerie' },
            { icon: '🧠', label: 'Détection IA' },
            { icon: '🍽️', label: '5 recettes générées' },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.07] bg-white/[0.04] text-gray-500 text-sm"
            >
              <span>{icon}</span>
              {label}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

function CameraIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}
