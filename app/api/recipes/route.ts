import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { MOCK_RECIPES } from '@/lib/mock-data'

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  const { ingredients } = await request.json()

  if (!apiKey) {
    await new Promise((r) => setTimeout(r, 2200))
    return NextResponse.json({ recipes: MOCK_RECIPES })
  }

  try {
    const client = new OpenAI({ apiKey })
    const list = (ingredients as string[]).join(', ')

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Tu es un chef français expert en cuisine du quotidien.',
        },
        {
          role: 'user',
          content: `À partir des ingrédients suivants : ${list}

Génère exactement 5 recettes. Priorités :
- Utiliser le maximum d'ingrédients disponibles
- Recettes simples et économiques
- Cuisine française de préférence
- Temps de préparation inférieur à 45 minutes

Retourne uniquement un JSON valide. Format exact :
{"recipes":[{"title":"","description":"","time":"","calories":"","missing":[],"steps":[]}]}`,
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2500,
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('Aucune réponse OpenAI')

    const data = JSON.parse(content)
    return NextResponse.json(data)
  } catch (error) {
    console.error('OpenAI recipes error:', error)
    return NextResponse.json({ recipes: MOCK_RECIPES })
  }
}
