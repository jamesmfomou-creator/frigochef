import Link from 'next/link'
import RecipeMarquee from '@/components/landing/RecipeMarquee'

const CATEGORIES = [
  { name: 'Végétarien', bg: 'bg-green-100 text-green-700', emoji: '🥗' },
  { name: 'Rapide < 20 min', bg: 'bg-blue-100 text-blue-700', emoji: '⚡' },
  { name: 'Anti-gaspillage', bg: 'bg-amber-100 text-amber-700', emoji: '♻️' },
  { name: 'Budget serré', bg: 'bg-orange-100 text-orange-700', emoji: '💰' },
  { name: 'Protéiné', bg: 'bg-red-100 text-red-700', emoji: '💪' },
  { name: 'Comfort Food', bg: 'bg-yellow-100 text-yellow-700', emoji: '🍲' },
  { name: 'Light & Sain', bg: 'bg-purple-100 text-purple-700', emoji: '✨' },
  { name: 'Fait maison', bg: 'bg-pink-100 text-pink-700', emoji: '🏠' },
  { name: 'Cuisine française', bg: 'bg-indigo-100 text-indigo-700', emoji: '🇫🇷' },
  { name: 'Italien', bg: 'bg-rose-100 text-rose-700', emoji: '🍝' },
  { name: 'Asiatique', bg: 'bg-cyan-100 text-cyan-700', emoji: '🥢' },
  { name: 'Sans gluten', bg: 'bg-lime-100 text-lime-700', emoji: '🌾' },
]

export default function LandingPage() {
  return (
    <div className="bg-[#0B0B0B]">
      {/* Header */}
      <header className="px-6 pt-7 pb-4 sticky top-0 z-50 bg-[#0B0B0B]/90 backdrop-blur-sm border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-white font-bold text-xl tracking-tight">Frigo<span className="text-green-400">Chef</span></span>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-500 hover:text-white transition-colors hidden sm:block">Connexion</Link>
            <Link href="/scan" className="bg-green-500 hover:bg-green-400 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-lg shadow-green-500/20">
              Essayer gratuitement →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(34,197,94,0.18),transparent)]" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-6xl sm:text-7xl font-black text-white tracking-tight leading-[1.04] mb-4">
            Ouvre ton frigo.
          </h1>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-7">
            <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">On trouve ton repas.</span>
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-lg leading-relaxed mb-10">
            Prenez une photo de vos ingrédients. Notre IA détecte ce que vous avez et génère 5 recettes personnalisées en quelques secondes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/scan" className="inline-flex items-center justify-center gap-2.5 bg-green-500 hover:bg-green-400 active:scale-95 text-white text-base font-bold px-8 py-4 rounded-2xl shadow-lg shadow-green-500/30 transition-all">
              <IconCamera /> Scanner mes ingrédients
            </Link>
            <Link href="/demo" className="inline-flex items-center justify-center gap-2 bg-white/[0.07] hover:bg-white/[0.11] border border-white/10 text-white text-base font-semibold px-8 py-4 rounded-2xl transition-all">
              Voir la démo →
            </Link>
          </div>
          <p className="text-gray-600 text-xs mt-5 tracking-wide uppercase">Gratuit · Instantané · Sans inscription</p>
        </div>
      </section>

      {/* Light content */}
      <div className="bg-white rounded-t-[3rem] overflow-hidden">

        {/* Marquee recettes — EN PREMIER pour accrocher immédiatement */}
        <section className="pt-10 pb-6">
          <div className="text-center mb-6 px-6">
            <p className="text-green-600 text-xs font-bold uppercase tracking-widest mb-1">Ce que vous pouvez cuisiner</p>
            <h2 className="text-2xl font-black text-gray-900">Des recettes qui donnent l&apos;eau à la bouche</h2>
          </div>
          <RecipeMarquee />
        </section>

        {/* How it works — compact */}
        <section className="max-w-5xl mx-auto px-6 pt-10 pb-12">
          <div className="text-center mb-10">
            <p className="text-green-600 text-xs font-bold uppercase tracking-widest mb-2">Comment ça marche</p>
            <h2 className="text-3xl font-black text-gray-900">3 étapes. 30 secondes.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { n: '1', icon: <IconCamera size={22} />, title: 'Photographiez', desc: 'Prenez une photo de votre frigo ou de vos ingrédients', color: 'bg-green-50 text-green-600' },
              { n: '2', icon: <IconSparkle size={22} />, title: "L'IA détecte", desc: "Notre IA identifie chaque aliment présent dans la photo", color: 'bg-blue-50 text-blue-600' },
              { n: '3', icon: <IconRecipe size={22} />, title: '5 recettes', desc: "Recettes personnalisées avec temps de préparation et calories", color: 'bg-violet-50 text-violet-600' },
            ].map(({ n, icon, title, desc, color }) => (
              <div key={n} className="relative bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
                  <span className="text-3xl font-black text-gray-100">{n}</span>
                </div>
                <h3 className="font-black text-gray-900 text-base mb-1.5">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Marquee 2 — Catégories */}
        <section className="pb-12">
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
            <div className="flex gap-2.5 animate-marquee-reverse w-max px-4">
              {[...CATEGORIES, ...CATEGORIES].map((c, i) => (
                <span key={i} className={`shrink-0 flex items-center gap-2 ${c.bg} text-sm font-semibold px-4 py-2.5 rounded-full`}>
                  {c.emoji} {c.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Features — dark background */}
        <section className="bg-gray-950 py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-2">Fonctionnalités</p>
              <h2 className="text-3xl font-black text-white mb-3">Plus qu&apos;un générateur de recettes</h2>
              <p className="text-gray-500 max-w-md mx-auto text-sm">Un assistant alimentaire complet qui réduit le gaspillage et simplifie votre quotidien</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { icon: <IconBox size={20} />, title: 'Pantry intelligent', desc: 'Gérez vos stocks, alertes avant péremption', color: 'text-green-400 bg-green-400/10' },
                { icon: <IconCalendar size={20} />, title: 'Planning hebdomadaire', desc: "Planifiez toute votre semaine en 1 clic", color: 'text-blue-400 bg-blue-400/10' },
                { icon: <IconCart size={20} />, title: 'Liste de courses', desc: 'Générée automatiquement depuis votre planning', color: 'text-violet-400 bg-violet-400/10' },
                { icon: <IconLeaf size={20} />, title: 'Anti-gaspillage', desc: 'Priorité aux aliments à utiliser en urgence', color: 'text-amber-400 bg-amber-400/10' },
                { icon: <IconCoins size={20} />, title: 'Économies réelles', desc: 'Réduisez vos dépenses alimentaires chaque semaine', color: 'text-yellow-400 bg-yellow-400/10' },
                { icon: <IconHistory size={20} />, title: 'Historique', desc: 'Retrouvez et relancez tous vos anciens scans', color: 'text-rose-400 bg-rose-400/10' },
              ].map(({ icon, title, desc, color }) => (
                <div key={title} className="bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] rounded-2xl p-5 transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${color}`}>{icon}</div>
                  <h3 className="font-bold text-white text-sm mb-1.5">{title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-gray-950 border-t border-white/[0.05] py-12 px-6">
          <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center">
            {[
              { value: '5 sec', label: "Temps d'analyse" },
              { value: '5 recettes', label: 'Générées par scan' },
              { value: '18 €', label: 'Économisés par mois' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl sm:text-3xl font-black text-green-400">{value}</p>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Marquee 3 — ticker */}
        <section className="py-4 bg-green-500">
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
            <div className="flex gap-8 animate-marquee w-max px-8">
              {[...Array(2)].flatMap((_, ri) =>
                ['📸 Scan en 1 photo', '🍽️ 5 recettes instantanées', '📦 Pantry intelligent', '📅 Planning automatique', '🛒 Courses générées', '♻️ Zéro gaspillage', '💰 Économies garanties', '⚡ Résultats en 5 secondes'].map((text, i) => (
                  <span key={`${ri}-${i}`} className="shrink-0 flex items-center gap-4 text-sm font-bold text-white/90 whitespace-nowrap">
                    {text} <span className="text-white/30">·</span>
                  </span>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center py-20 px-6 bg-white">
          <h2 className="text-4xl font-black text-gray-900 mb-3">Prêt à cuisiner mieux ?</h2>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
            Transformez n&apos;importe quoi dans votre frigo en un repas délicieux. En quelques secondes.
          </p>
          <Link href="/scan" className="inline-flex items-center gap-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold px-8 py-4 rounded-2xl shadow-lg transition-all text-base">
            <IconCamera /> Commencer gratuitement
          </Link>
          <p className="text-gray-300 text-xs mt-4">Sans carte bancaire · Sans inscription · Résultats en 5 secondes</p>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-100 px-6 py-7 bg-white">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="font-bold text-gray-900 text-sm">Frigo<span className="text-green-500">Chef</span></span>
            <p className="text-gray-400 text-xs">© 2026 FrigoChef · Assistant culinaire IA</p>
            <div className="flex gap-5">
              <Link href="/login" className="text-gray-400 hover:text-gray-700 text-xs transition-colors">Connexion</Link>
              <Link href="/demo" className="text-gray-400 hover:text-gray-700 text-xs transition-colors">Démo</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

/* ── Icons ── */
function IconCamera({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  )
}

function IconSparkle({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v1m0 16v1M3 12h1m16 0h1m-3.22-7.78-.7.7M6.92 17.08l-.7.7m12.02 0-.7-.7M6.92 6.92l-.7-.7"/>
      <circle cx="12" cy="12" r="4"/>
    </svg>
  )
}

function IconRecipe({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
    </svg>
  )
}

function IconBox({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
      <path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
    </svg>
  )
}

function IconCalendar({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )
}

function IconCart({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  )
}

function IconLeaf({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  )
}

function IconCoins({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>
    </svg>
  )
}

function IconHistory({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>
    </svg>
  )
}
