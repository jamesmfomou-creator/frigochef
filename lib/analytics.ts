// Google Analytics 4 — événements personnalisés FrigoChef
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

function gtag(...args: unknown[]) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag(...args)
}

// ── Scan ──────────────────────────────────────────────────────────────────────
export function trackScanStarted() {
  gtag('event', 'scan_started', { event_category: 'scan' })
}

export function trackScanCompleted(ingredientCount: number) {
  gtag('event', 'scan_completed', {
    event_category: 'scan',
    ingredient_count: ingredientCount,
  })
}

export function trackRecipesGenerated(recipeCount: number, ingredientCount: number) {
  gtag('event', 'recipes_generated', {
    event_category: 'scan',
    recipe_count: recipeCount,
    ingredient_count: ingredientCount,
  })
}

export function trackRecipeOpened(recipeTitle: string) {
  gtag('event', 'recipe_opened', {
    event_category: 'engagement',
    recipe_title: recipeTitle,
  })
}

// ── Conversion ────────────────────────────────────────────────────────────────
export function trackCheckoutStarted(plan: string = 'premium_monthly') {
  gtag('event', 'begin_checkout', {
    event_category: 'ecommerce',
    currency: 'EUR',
    value: 9.99,
    items: [{ item_name: 'FrigoChef Premium', item_id: plan, price: 9.99, quantity: 1 }],
  })
}

export function trackPurchase(transactionId: string, value: number = 9.99) {
  gtag('event', 'purchase', {
    event_category: 'ecommerce',
    transaction_id: transactionId,
    currency: 'EUR',
    value,
    items: [{ item_name: 'FrigoChef Premium', price: value, quantity: 1 }],
  })
}

// ── Compte ────────────────────────────────────────────────────────────────────
export function trackAccountPromptShown() {
  gtag('event', 'account_prompt_shown', { event_category: 'acquisition' })
}

export function trackSignupStarted(method: 'google' | 'email') {
  gtag('event', 'sign_up', { method, event_category: 'acquisition' })
}

// ── Pantry / Features ─────────────────────────────────────────────────────────
export function trackPantryItemAdded(count: number) {
  gtag('event', 'pantry_items_added', { event_category: 'engagement', count })
}

export function trackPlanningGenerated() {
  gtag('event', 'planning_generated', { event_category: 'engagement' })
}

export function trackPremiumModalShown(source: string) {
  gtag('event', 'premium_modal_shown', { event_category: 'conversion', source })
}
