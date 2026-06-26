'use client'

import { useState } from 'react'

// 8 plats fixes dans cet ordre exact
// Chaque plat a jusqu'à 4 images à essayer en cascade
// Si toutes échouent → placeholder neutre gris (pas d'emoji)
const RECIPES = [
  {
    name: 'Soupe de Légumes',
    time: '25 min', cal: '180 kcal',
    imgs: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Garden_vegetable_soup.jpg/400px-Garden_vegetable_soup.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Vegetable_soup_%28cropped%29.jpg/400px-Vegetable_soup_%28cropped%29.jpg',
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=280&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571167366136-b57e97e59cb5?w=400&h=280&fit=crop&q=80',
    ],
  },
  {
    name: 'Omelette Provençale',
    time: '15 min', cal: '410 kcal',
    imgs: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Omelet.jpg/400px-Omelet.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Omelette_Paysanne.jpg/400px-Omelette_Paysanne.jpg',
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=280&fit=crop&q=80',
      'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400&h=280&fit=crop&q=80',
    ],
  },
  {
    name: 'Gratin Dauphinois',
    time: '50 min', cal: '560 kcal',
    imgs: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Gratin_dauphinois_02.jpg/400px-Gratin_dauphinois_02.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/GratinDauph.jpg/400px-GratinDauph.jpg',
      'https://images.unsplash.com/photo-1610574082469-0ade9ce5a44f?w=400&h=280&fit=crop&q=80',
      'https://images.unsplash.com/photo-1543339520-8e7db60c62b4?w=400&h=280&fit=crop&q=80',
    ],
  },
  {
    name: 'Pasta Carbonara',
    time: '20 min', cal: '650 kcal',
    imgs: [
      'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=280&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&h=280&fit=crop&q=80',
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=280&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=280&fit=crop&q=80',
    ],
  },
  {
    name: 'Salade Niçoise',
    time: '15 min', cal: '320 kcal',
    imgs: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=280&fit=crop&q=80',
      'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400&h=280&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=280&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=280&fit=crop&q=80',
    ],
  },
  {
    name: 'Poulet Rôti',
    time: '45 min', cal: '520 kcal',
    imgs: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Poulet_R%C3%B4ti.jpg/400px-Poulet_R%C3%B4ti.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Whole_roast_chicken.jpg/400px-Whole_roast_chicken.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Roasted_chicken.jpg/400px-Roasted_chicken.jpg',
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=280&fit=crop&q=80',
    ],
  },
  {
    name: 'Pizza Margherita',
    time: '30 min', cal: '680 kcal',
    imgs: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=280&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=280&fit=crop&q=80',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=280&fit=crop&q=80',
      'https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?w=400&h=280&fit=crop&q=80',
    ],
  },
  {
    name: 'Saumon au Four',
    time: '20 min', cal: '450 kcal',
    imgs: [
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=280&fit=crop&q=80',
      'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400&h=280&fit=crop&q=80',
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=280&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541529086526-db283c563270?w=400&h=280&fit=crop&q=80',
    ],
  },
]

function RecipeCard({ recipe }: { recipe: typeof RECIPES[0] }) {
  const [attempt, setAttempt] = useState(0)
  const [allFailed, setAllFailed] = useState(false)

  function onError() {
    if (attempt < recipe.imgs.length - 1) {
      setAttempt(a => a + 1)
    } else {
      setAllFailed(true)
    }
  }

  return (
    <div className="shrink-0 w-48 sm:w-52 bg-white rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.07)] border border-gray-100">
      <div className="relative h-32 overflow-hidden">
        {allFailed ? (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-300 text-xs">Image non disponible</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={attempt}
            src={recipe.imgs[attempt]}
            alt={recipe.name}
            className="w-full h-full object-cover"
            onError={onError}
            loading="lazy"
          />
        )}
      </div>
      <div className="p-3.5">
        <p className="font-bold text-gray-900 text-sm truncate mb-2">{recipe.name}</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100 whitespace-nowrap">⏱ {recipe.time}</span>
          <span className="text-[11px] text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 whitespace-nowrap">🔥 {recipe.cal}</span>
        </div>
      </div>
    </div>
  )
}

export default function RecipeMarquee() {
  // Duplicate once for seamless infinite loop
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
