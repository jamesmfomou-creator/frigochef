import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { MOCK_INGREDIENTS } from '@/lib/mock-data'

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    await new Promise((r) => setTimeout(r, 1800))
    return NextResponse.json({ ingredients: MOCK_INGREDIENTS })
  }

  try {
    const formData = await request.formData()
    const image = formData.get('image') as File

    if (!image) {
      return NextResponse.json({ error: 'Image manquante' }, { status: 400 })
    }

    const bytes = await image.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const mimeType = image.type || 'image/jpeg'

    const client = new OpenAI({ apiKey })

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${base64}`, detail: 'low' },
            },
            {
              type: 'text',
              text: 'Analyse uniquement les aliments visibles dans cette image. Retourne uniquement un JSON valide. Format exact: {"ingredients":[{"name":"Tomates","confidence":0.94}]}. Ne jamais inventer un aliment. Seulement les aliments réellement visibles. Noms en français.',
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 500,
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('Aucune réponse OpenAI')

    const data = JSON.parse(content)
    return NextResponse.json(data)
  } catch (error) {
    console.error('OpenAI analyze error:', error)
    return NextResponse.json({ ingredients: MOCK_INGREDIENTS })
  }
}
