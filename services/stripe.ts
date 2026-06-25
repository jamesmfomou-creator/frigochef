// Stripe integration — architecture ready, implementation pending
// Wire up STRIPE_SECRET_KEY when ready to go live

export async function createCheckoutSession(_userId: string): Promise<{ url: string }> {
  // TODO: implement with Stripe SDK
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  // const session = await stripe.checkout.sessions.create({ ... })
  throw new Error('Stripe not yet configured')
}

export async function getSubscription(_customerId: string) {
  // TODO: fetch active subscription from Stripe
  return null
}
