import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { MOCK_RECIPES } from '@/lib/mock-data'

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  const { ingredients, scanId } = await request.json()

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!apiKey) {
    await new Promise(r => setTimeout(r, 2200))
    if (user) await saveRecipes(supabase, user.id, MOCK_RECIPES, scanId)
    return NextResponse.json({ recipes: MOCK_RECIPES })
  }

  try {
    const client = new OpenAI({ apiKey })
    const list = (ingredients as string[]).join(', ')

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Tu es un chef français expert en cuisine du quotidien.' },
        {
          role: 'user',
          content: `À partir des ingrédients suivants : ${list}\n\nGénère exactement 5 recettes. Priorités :\n- Utiliser le maximum d'ingrédients disponibles\n- Recettes simples et économiques\n- Cuisine française de préférence\n- Temps inférieur à 45 minutes\n\nRetourne uniquement un JSON. Format : {"recipes":[{"title":"","description":"","time":"","calories":"","missing":[],"steps":[]}]}`,
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2500,
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error()
    const data = JSON.parse(content)
    const recipes = data.recipes ?? MOCK_RECIPES

    if (user) await saveRecipes(supabase, user.id, recipes, scanId)
    return NextResponse.json({ recipes })
  } catch {
    if (user) await saveRecipes(supabase, user.id, MOCK_RECIPES, scanId)
    return NextResponse.json({ recipes: MOCK_RECIPES })
  }
}

async function saveRecipes(
  supabase: ReturnType<typeof createServerClient>,
  userId: string,
  recipes: typeof MOCK_RECIPES,
  scanId?: string
) {
  const rows = recipes.map(r => ({
    user_id: userId,
    title: r.title,
    description: r.description,
    time: r.time,
    calories: r.calories,
    missing: r.missing,
    steps: r.steps,
    scan_id: scanId ?? null,
  }))
  await supabase.from('saved_recipes').insert(rows)
}
