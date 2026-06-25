import { NextResponse } from 'next/server'

// Stripe webhook stub — implement when Stripe is configured
export async function POST() {
  // TODO: verify stripe signature and handle events
  // const sig = request.headers.get('stripe-signature')
  // const event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)
  // if (event.type === 'checkout.session.completed') { ... }
  return NextResponse.json({ received: true })
}
