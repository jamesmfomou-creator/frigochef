import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { MOCK_INGREDIENTS } from '@/lib/mock-data'

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY

  // Get authenticated user and update scan count
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
    await new Promise(r => setTimeout(r, 1800))
    const ingredients = MOCK_INGREDIENTS

    // Save scan to DB if authenticated
    let scanId: string | null = null
    if (user) {
      const { data: scan } = await supabase.from('scans').insert({ user_id: user.id, ingredients }).select('id').single()
      scanId = scan?.id ?? null
      await supabase.from('profiles').update({ scan_count: (await getScanCount(supabase, user.id)) + 1 }).eq('id', user.id)
    }

    return NextResponse.json({ ingredients, scanId })
  }

  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    if (!image) return NextResponse.json({ error: 'Image manquante' }, { status: 400 })

    const bytes = await image.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const mimeType = image.type || 'image/jpeg'

    const client = new OpenAI({ apiKey })
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}`, detail: 'low' } },
          { type: 'text', text: 'Analyse uniquement les aliments visibles. Retourne uniquement un JSON. Format: {"ingredients":[{"name":"Tomates","confidence":0.94}]}. Ne jamais inventer un aliment. Noms en français.' },
        ],
      }],
      response_format: { type: 'json_object' },
      max_tokens: 500,
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error()

    const data = JSON.parse(content)
    const ingredients = data.ingredients ?? MOCK_INGREDIENTS

    // Save scan + update count
    let scanId: string | null = null
    if (user) {
      const { data: scan } = await supabase.from('scans').insert({ user_id: user.id, ingredients }).select('id').single()
      scanId = scan?.id ?? null
      await supabase.from('profiles').update({ scan_count: (await getScanCount(supabase, user.id)) + 1 }).eq('id', user.id)
    }

    return NextResponse.json({ ingredients, scanId })
  } catch {
    return NextResponse.json({ ingredients: MOCK_INGREDIENTS, scanId: null })
  }
}

async function getScanCount(supabase: ReturnType<typeof createServerClient>, userId: string): Promise<number> {
  const { data } = await supabase.from('profiles').select('scan_count').eq('id', userId).single()
  return data?.scan_count ?? 0
}
