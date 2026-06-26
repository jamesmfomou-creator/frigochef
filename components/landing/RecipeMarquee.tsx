'use client'

import { useState } from 'react'

const RECIPES = [
  { name: 'Pasta Carbonara', time: '20 min', cal: '650 kcal', img: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=280&fit=crop&q=80', emoji: '🍝', bg: 'from-orange-400 to-amber-500' },
  { name: 'Salade Niçoise', time: '15 min', cal: '320 kcal', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=280&fit=crop&q=80', emoji: '🥗', bg: 'from-green-400 to-emerald-500' },
  { name: 'Poulet Rôti', time: '45 min', cal: '520 kcal', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=280&fit=crop&q=80', emoji: '🍗', bg: 'from-yellow-400 to-orange-400' },
  { name: 'Pizza Margherita', time: '30 min', cal: '680 kcal', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=280&fit=crop&q=80', emoji: '🍕', bg: 'from-red-400 to-rose-500' },
  { name: 'Saumon Grillé', time: '20 min', cal: '420 kcal', img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=280&fit=crop&q=80', emoji: '🐟', bg: 'from-blue-400 to-cyan-500' },
  { name: 'Risotto Champignons', time: '35 min', cal: '480 kcal', img: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=280&fit=crop&q=80', emoji: '🍄', bg: 'from-amber-400 to-yellow-500' },
  { name: 'Tarte aux Pommes', time: '40 min', cal: '380 kcal', img: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=400&h=280&fit=crop&q=80', emoji: '🥧', bg: 'from-amber-300 to-orange-400' },
  { name: 'Soupe de Légumes', time: '25 min', cal: '180 kcal', img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=280&fit=crop&q=80', emoji: '🥣', bg: 'from-green-300 to-teal-400' },
  { name: 'Omelette Provençale', time: '15 min', cal: '410 kcal', img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=280&fit=crop&q=80', emoji: '🍳', bg: 'from-yellow-300 to-amber-400' },
  { name: 'Gratin Dauphinois', time: '50 min', cal: '560 kcal', img: 'https://images.unsplash.com/photo-1558030137-a56c1b002d7d?w=400&h=280&fit=crop&q=80', emoji: '🧀', bg: 'from-orange-300 to-yellow-400' },
]

function RecipeCard({ recipe }: { recipe: typeof RECIPES[0] }) {
  const [error, setError] = useState(false)

  return (
    <div className="shrink-0 w-52 bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-gray-100">
      <div className="relative h-32 overflow-hidden bg-gray-100">
        {!error ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recipe.img}
            alt={recipe.name}
            className="w-full h-full object-cover"
            onError={() => setError(true)}
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${recipe.bg} flex items-center justify-center`}>
            <span className="text-5xl drop-shadow">{recipe.emoji}</span>
          </div>
        )}
      </div>
      <div className="p-3.5">
        <p className="font-bold text-gray-900 text-sm truncate mb-2">{recipe.name}</p>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">⏱ {recipe.time}</span>
          <span className="text-[11px] text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">🔥 {recipe.cal}</span>
        </div>
      </div>
    </div>
  )
}

export default function RecipeMarquee() {
  const doubled = [...RECIPES, ...RECIPES]
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <div className="flex gap-4 animate-marquee w-max py-2 px-4">
        {doubled.map((r, i) => (
          <RecipeCard key={i} recipe={r} />
        ))}
      </div>
    </div>
  )
}
