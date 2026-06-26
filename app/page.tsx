import Link from 'next/link'

const RECIPE_CARDS = [
  { name: 'Pasta Carbonara', time: '20 min', cal: '650 kcal', emoji: '🍝', bg: 'from-orange-400 to-amber-500' },
  { name: 'Salade Caprese', time: '10 min', cal: '320 kcal', emoji: '🥗', bg: 'from-green-400 to-emerald-500' },
  { name: 'Poulet Rôti', time: '45 min', cal: '520 kcal', emoji: '🍗', bg: 'from-yellow-400 to-orange-400' },
  { name: 'Soupe Tomates', time: '25 min', cal: '180 kcal', emoji: '🥣', bg: 'from-red-400 to-rose-500' },
  { name: 'Pizza Maison', time: '30 min', cal: '680 kcal', emoji: '🍕', bg: 'from-red-400 to-rose-400' },
  { name: 'Risotto Champignons', time: '35 min', cal: '480 kcal', emoji: '🍄', bg: 'from-amber-400 to-yellow-500' },
  { name: 'Saumon Teriyaki', time: '20 min', cal: '420 kcal', emoji: '🐟', bg: 'from-blue-400 to-cyan-500' },
  { name: 'Tarte aux Pommes', time: '40 min', cal: '380 kcal', emoji: '🥧', bg: 'from-amber-300 to-orange-400' },
  { name: 'Omelette Provençale', time: '15 min', cal: '410 kcal', emoji: '🍳', bg: 'from-yellow-300 to-amber-400' },
  { name: 'Gratin Dauphinois', time: '50 min', cal: '560 kcal', emoji: '🧀', bg: 'from-orange-300 to-yellow-400' },
]

const CATEGORIES = [
  { name: 'Végétarien', bg: 'bg-green-100 text-green-700', emoji: '🥗' },
  { name: 'Rapide (< 20 min)', bg: 'bg-blue-100 text-blue-700', emoji: '⚡' },
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

const FEATURES = [
  { emoji: '📦', title: 'Pantry intelligent', desc: 'Gérez vos stocks et recevez des alertes avant péremption' },
  { emoji: '📅', title: 'Planning hebdomadaire IA', desc: "L'IA génère votre semaine de repas en un clic" },
  { emoji: '🛒', title: 'Liste de courses auto', desc: 'Générée automatiquement depuis votre planning' },
  { emoji: '♻️', title: 'Anti-gaspillage', desc: 'Priorité aux aliments à utiliser en urgence' },
  { emoji: '💰', title: 'Économies réelles', desc: 'Réduisez vos courses et évitez les déchets' },
  { emoji: '📋', title: 'Historique complet', desc: 'Retrouvez et relancez vos anciens scans' },
]

export default function LandingPage() {
  return (
    <div className="bg-[#0B0B0B]">
      {/* Header */}
      <header className="px-6 pt-8 pb-2 sticky top-0 z-50 bg-[#0B0B0B]/90 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-white font-bold text-xl tracking-tight">
            Frigo<span className="text-green-400">Chef</span>
          </span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
              Connexion
            </Link>
            <Link href="/scan" className="bg-green-500 hover:bg-green-400 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
              Essayer →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(34,197,94,0.2),transparent)]" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-white/10 bg-white/[0.06] text-sm text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Assistant culinaire IA — GPT-4o Vision
          </div>
          <h1 className="text-6xl sm:text-7xl font-black text-white tracking-tight leading-[1.04] mb-5">
            Ouvre ton frigo.
          </h1>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-8">
            <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              On trouve ton repas.
            </span>
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-lg leading-relaxed mb-12">
            Une photo suffit. L&apos;IA détecte vos ingrédients et génère 5 recettes personnalisées en quelques secondes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/scan" className="inline-flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 active:scale-95 text-white text-lg font-bold px-10 py-5 rounded-2xl shadow-lg shadow-green-500/30 transition-all">
              <CameraIcon />
              Scanner mes ingrédients
            </Link>
            <Link href="/demo" className="inline-flex items-center justify-center gap-2 bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 text-white text-base font-semibold px-8 py-5 rounded-2xl transition-all">
              Voir la démo →
            </Link>
          </div>
          <p className="text-gray-600 text-sm mt-5">Gratuit · Instantané · Sans inscription</p>
        </div>
      </section>

      {/* Light content section */}
      <div className="bg-[#F8F9FA] rounded-t-[3rem] overflow-hidden">

        {/* How it works */}
        <section className="max-w-5xl mx-auto px-6 pt-20 pb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Comment ça marche ?</h2>
            <p className="text-gray-400">3 étapes, moins de 30 secondes</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { step: '01', emoji: '📸', title: 'Photographiez', desc: 'Prenez une photo de votre frigo ou posez vos ingrédients sur le plan de travail' },
              { step: '02', emoji: '🧠', title: "L'IA analyse", desc: "GPT-4o Vision identifie automatiquement chaque aliment visible dans la photo" },
              { step: '03', emoji: '🍽️', title: '5 recettes générées', desc: "Recevez 5 recettes adaptées à vos ingrédients, avec temps et calories" },
            ].map(({ step, emoji, title, desc }) => (
              <div key={step} className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100 text-center relative overflow-hidden">
                <div className="absolute top-4 right-4 text-xs font-black text-gray-100">{step}</div>
                <div className="text-4xl mb-4">{emoji}</div>
                <h3 className="font-black text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Marquee 1 — Recettes */}
        <section className="pb-4">
          <div className="text-center mb-6 px-6">
            <h2 className="text-2xl font-black text-gray-900 mb-1">Recettes générées chaque jour</h2>
            <p className="text-gray-400 text-sm">Des milliers de recettes créées par notre communauté</p>
          </div>
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="flex gap-4 animate-marquee w-max py-2 px-4">
              {[...RECIPE_CARDS, ...RECIPE_CARDS].map((r, i) => (
                <div key={i} className="shrink-0 w-44 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  <div className={`h-24 bg-gradient-to-br ${r.bg} flex items-center justify-center`}>
                    <span className="text-5xl">{r.emoji}</span>
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-gray-900 text-xs truncate">{r.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-400">⏱ {r.time}</span>
                      <span className="text-[10px] text-gray-400">🔥 {r.cal}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Marquee 2 — Catégories (reverse) */}
        <section className="py-6">
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="flex gap-3 animate-marquee-reverse w-max px-4">
              {[...CATEGORIES, ...CATEGORIES].map((c, i) => (
                <span key={i} className={`shrink-0 flex items-center gap-2 ${c.bg} text-sm font-semibold px-5 py-3 rounded-full`}>
                  {c.emoji} {c.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Plus qu&apos;un générateur de recettes</h2>
            <p className="text-gray-400">Un vrai assistant alimentaire qui vous fait gagner du temps et de l&apos;argent</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {FEATURES.map(({ emoji, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{emoji}</div>
                <h3 className="font-black text-gray-900 text-sm mb-1.5">{title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats banner */}
        <section className="mx-6 mb-16">
          <div className="bg-gray-900 rounded-3xl p-10 max-w-5xl mx-auto">
            <div className="grid grid-cols-3 gap-6 text-center">
              {[
                { value: '5 sec', label: "Temps d'analyse IA" },
                { value: '5 recettes', label: 'Générées à chaque scan' },
                { value: '18€', label: 'Économisés par mois' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl sm:text-3xl font-black text-green-400">{value}</p>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Marquee 3 — Features scroll */}
        <section className="py-6 bg-white border-y border-gray-100">
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="flex gap-8 animate-marquee w-max px-8">
              {[...Array(2)].flatMap(() => [
                '📸 Scan en 1 photo',
                '🧠 GPT-4o Vision',
                '🍽️ 5 recettes instantanées',
                '📦 Pantry intelligent',
                '📅 Planning IA',
                '🛒 Liste de courses auto',
                '♻️ Anti-gaspillage',
                '💰 Économies réelles',
                '🔒 Vos données privées',
                '⚡ Résultats en 5 secondes',
              ].map((text, i) => (
                <span key={i} className="shrink-0 flex items-center gap-2 text-sm font-semibold text-gray-600 whitespace-nowrap">
                  {text}
                  <span className="text-gray-200 ml-4">·</span>
                </span>
              )))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center py-24 px-6">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Prêt à cuisiner mieux ?</h2>
          <p className="text-gray-400 mb-10 max-w-md mx-auto">
            Rejoignez des milliers d&apos;utilisateurs qui gèrent mieux leur frigo et économisent chaque semaine.
          </p>
          <Link href="/scan" className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-400 text-white font-bold px-10 py-5 rounded-2xl shadow-lg shadow-green-500/25 transition-all text-lg">
            <CameraIcon />
            Commencer gratuitement
          </Link>
          <p className="text-gray-400 text-sm mt-5">Sans carte bancaire · Sans inscription · Résultats en 5 secondes</p>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-100 px-6 py-8">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-bold text-gray-900">Frigo<span className="text-green-500">Chef</span></span>
            <p className="text-gray-400 text-sm">© 2026 FrigoChef · Assistant culinaire IA</p>
            <div className="flex gap-4">
              <Link href="/login" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">Connexion</Link>
              <Link href="/demo" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">Démo</Link>
            </div>
          </div>
        </footer>
      </div>
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
