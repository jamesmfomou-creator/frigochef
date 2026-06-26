import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerClient } from '@supabase/ssr'

// Désactive le parsing automatique — Stripe a besoin du body brut pour vérifier la signature
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Signature manquante' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const stripeKey = process.env.STRIPE_SECRET_KEY

  if (!webhookSecret || !stripeKey) {
    console.error('Variables Stripe manquantes')
    return NextResponse.json({ error: 'Configuration manquante' }, { status: 500 })
  }

  const stripe = new Stripe(stripeKey, { apiVersion: '2026-06-24.dahlia' })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Signature Stripe invalide:', err)
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 })
  }

  // Supabase avec service role pour bypasser RLS
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id

        if (userId && session.payment_status === 'paid') {
          await supabase
            .from('profiles')
            .update({
              plan: 'premium',
              stripe_customer_id: session.customer as string,
            })
            .eq('id', userId)

          console.log(`✅ User ${userId} upgradé en Premium`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        // Abonnement annulé → repasser en free
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        await supabase
          .from('profiles')
          .update({ plan: 'free' })
          .eq('stripe_customer_id', customerId)

        console.log(`⬇️ Subscription annulée pour customer ${customerId}`)
        break
      }

      case 'invoice.payment_failed': {
        // Paiement échoué — optionnel : notifier l'utilisateur
        console.log('Paiement échoué:', event.data.object)
        break
      }
    }
  } catch (err) {
    console.error('Erreur traitement webhook:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
