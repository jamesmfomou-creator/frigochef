import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { DAYS_FR } from '@/lib/types'

const MOCK_PLAN = {
  days: {
    lundi: { title: 'Poulet rôti aux légumes', description: 'Un classique réconfortant avec des légumes de saison.', time: '35 min', calories: '520 kcal' },
    mardi: { title: 'Pâtes à la carbonara', description: 'La recette italienne authentique, crémeuse et rapide.', time: '20 min', calories: '650 kcal' },
    mercredi: { title: 'Soupe de légumes maison', description: 'Une soupe légère et nutritive pour la semaine.', time: '25 min', calories: '220 kcal' },
    jeudi: { title: 'Steak haché et frites maison', description: 'Un repas complet et savoureux pour toute la famille.', time: '30 min', calories: '720 kcal' },
    vendredi: { title: 'Saumon teriyaki et riz', description: 'Une touche asiatique fraîche pour finir la semaine.', time: '25 min', calories: '480 kcal' },
    samedi: { title: 'Pizza maison aux légumes', description: 'La pizza du week-end avec les ingrédients du frigo.', time: '40 min', calories: '590 kcal' },
    dimanche: { title: 'Blanquette de veau', description: 'Le grand plat du dimanche, mijoté et savoureux.', time: '45 min', calories: '610 kcal' },
  },
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  const { pantryIngredients } = await request.json()

  if (!apiKey) {
    await new Promise(r => setTimeout(r, 2500))
    return NextResponse.json(MOCK_PLAN)
  }

  try {
    const client = new OpenAI({ apiKey })
    const pantryList = Array.isArray(pantryIngredients) && pantryIngredients.length > 0
      ? pantryIngredients.join(', ')
      : 'ingrédients courants de cuisine française'

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Tu es un chef français expert en planification de repas hebdomadaire.' },
        {
          role: 'user',
          content: `Crée un planning de repas pour 7 jours (lundi à dimanche).\n\nIngrédients disponibles : ${pantryList}\n\nObjectifs :\n- Utiliser un maximum des ingrédients disponibles\n- Éviter le gaspillage\n- Variété des cuisines (française, italienne, asiatique)\n- Temps de préparation inférieur à 45 minutes\n- Éviter deux repas identiques\n\nRetourne uniquement un JSON. Format exact :\n{"days":{"lundi":{"title":"","description":"","time":"","calories":""},"mardi":{...},"mercredi":{...},"jeudi":{...},"vendredi":{...},"samedi":{...},"dimanche":{...}}}`,
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 1500,
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error()

    const data = JSON.parse(content)
    // Ensure all 7 days are present
    const days = DAYS_FR.reduce((acc, day) => {
      acc[day] = data.days?.[day] ?? MOCK_PLAN.days[day as keyof typeof MOCK_PLAN.days]
      return acc
    }, {} as Record<string, unknown>)

    return NextResponse.json({ days })
  } catch {
    return NextResponse.json(MOCK_PLAN)
  }
}
