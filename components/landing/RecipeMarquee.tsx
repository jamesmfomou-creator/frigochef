'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Carrousel 100 % statique — aucune API, aucun emoji, aucun fallback dynamique.
// Toutes les images sont dans /public/recipes/
// Si une image manque, la carte est masquée silencieusement.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'

const RECIPES = [
  { name: 'Soupe de Légumes',    time: '25 min', cal: '180 kcal', img: '/recipes/soupe-legumes.jpg'       },
  { name: 'Omelette Provençale', time: '15 min', cal: '410 kcal', img: '/recipes/omelette-provencale.jpg' },
  { name: 'Gratin Dauphinois',   time: '50 min', cal: '560 kcal', img: '/recipes/gratin-dauphinois.jpg'   },
  { name: 'Pasta Carbonara',     time: '20 min', cal: '650 kcal', img: '/recipes/pasta-carbonara.jpg'     },
  { name: 'Salade Niçoise',      time: '15 min', cal: '320 kcal', img: '/recipes/salade-nicoise.jpg'      },
  { name: 'Poulet Rôti',         time: '45 min', cal: '520 kcal', img: '/recipes/poulet-roti.jpg'         },
  { name: 'Pizza Margherita',    time: '30 min', cal: '680 kcal', img: '/recipes/pizza-margherita.jpg'    },
  { name: 'Saumon au Four',      time: '20 min', cal: '450 kcal', img: '/recipes/saumon-au-four.jpg'      },
]

function RecipeCard({ recipe }: { recipe: typeof RECIPES[0] }) {
  const [hidden, setHidden] = useState(false)

  if (hidden) return null

  return (
    <div className="shrink-0 w-48 sm:w-52 bg-white rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.07)] border border-gray-100">
      <div className="relative h-32 overflow-hidden bg-gray-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={recipe.img}
          alt={recipe.name}
          className="w-full h-full object-cover"
          onError={() => setHidden(true)}
          loading="lazy"
        />
      </div>
      <div className="p-3.5">
        <p className="font-bold text-gray-900 text-sm truncate mb-2">{recipe.name}</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100 whitespace-nowrap">
            ⏱ {recipe.time}
          </span>
          <span className="text-[11px] text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 whitespace-nowrap">
            🔥 {recipe.cal}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function RecipeMarquee() {
  const doubled = [...RECIPES, ...RECIPES]
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
      <div className="flex gap-3 animate-marquee w-max py-2 px-4">
        {doubled.map((r, i) => (
          <RecipeCard key={i} recipe={r} />
        ))}
      </div>
    </div>
  )
}
