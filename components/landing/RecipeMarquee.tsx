'use client'

import { useState } from 'react'

// Each recipe has a primary + backup image ID from Unsplash
// If both fail → card is hidden entirely (no emoji placeholder)
const RECIPES = [
  {
    name: 'Soupe de Légumes',
    time: '25 min', cal: '180 kcal',
    imgs: [
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=280&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571167366136-b57e97e59cb5?w=400&h=280&fit=crop&q=80',
    ],
  },
  {
    name: 'Omelette Provençale',
    time: '15 min', cal: '410 kcal',
    imgs: [
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=280&fit=crop&q=80',
      'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=280&fit=crop&q=80',
    ],
  },
  {
    name: 'Gratin Dauphinois',
    time: '50 min', cal: '560 kcal',
    imgs: [
      'https://images.unsplash.com/photo-1574631895951-ef1e76ec70e2?w=400&h=280&fit=crop&q=80',
      'https://images.unsplash.com/photo-1543339520-8e7db60c62b4?w=400&h=280&fit=crop&q=80',
    ],
  },
  {
    name: 'Pasta Carbonara',
    time: '20 min', cal: '650 kcal',
    imgs: [
      'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=280&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=280&fit=crop&q=80',
    ],
  },
  {
    name: 'Salade Niçoise',
    time: '15 min', cal: '320 kcal',
    imgs: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=280&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=280&fit=crop&q=80',
    ],
  },
  {
    name: 'Poulet Rôti',
    time: '45 min', cal: '520 kcal',
    imgs: [
      'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&h=280&fit=crop&q=80',
      'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=400&h=280&fit=crop&q=80',
    ],
  },
  {
    name: 'Pizza Margherita',
    time: '30 min', cal: '680 kcal',
    imgs: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=280&fit=crop&q=80',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=280&fit=crop&q=80',
    ],
  },
  {
    name: 'Saumon au Four',
    time: '20 min', cal: '450 kcal',
    imgs: [
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=280&fit=crop&q=80',
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=280&fit=crop&q=80',
    ],
  },
]

function RecipeCard({ recipe }: { recipe: typeof RECIPES[0] }) {
  const [attempt, setAttempt] = useState(0)
  const [hidden, setHidden] = useState(false)

  if (hidden) return null

  const src = recipe.imgs[attempt]

  function onError() {
    if (attempt < recipe.imgs.length - 1) {
      setAttempt(attempt + 1)
    } else {
      setHidden(true)
    }
  }

  return (
    <div className="shrink-0 w-52 bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-gray-100">
      <div className="relative h-32 overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={src}
          src={src}
          alt={recipe.name}
          className="w-full h-full object-cover"
          onError={onError}
          loading="lazy"
        />
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
