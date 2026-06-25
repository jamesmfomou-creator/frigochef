export interface Ingredient {
  id: string
  name: string
  confidence: number
}

export interface Recipe {
  title: string
  description: string
  time: string
  calories: string
  missing: string[]
  steps: string[]
}

export interface Profile {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  plan: 'free' | 'premium'
  scan_count: number
  scan_reset_date: string
  created_at: string
}

export interface PantryItem {
  id: string
  user_id: string
  name: string
  quantity: string | null
  category: string | null
  added_at: string
  updated_at: string
}

export interface Scan {
  id: string
  user_id: string
  ingredients: Ingredient[]
  created_at: string
}

export interface SavedRecipe {
  id: string
  user_id: string
  title: string
  description: string
  time: string
  calories: string
  missing: string[]
  steps: string[]
  scan_id: string | null
  created_at: string
}

export interface MealPlanDay {
  title: string
  description: string
  time: string
  calories: string
}

export interface MealPlan {
  id: string
  user_id: string
  week_start: string
  days: {
    lundi?: MealPlanDay
    mardi?: MealPlanDay
    mercredi?: MealPlanDay
    jeudi?: MealPlanDay
    vendredi?: MealPlanDay
    samedi?: MealPlanDay
    dimanche?: MealPlanDay
  }
  created_at: string
}

export interface ShoppingItem {
  id: string
  name: string
  quantity: string
  category: string
  checked: boolean
}

export interface ShoppingList {
  id: string
  user_id: string
  items: ShoppingItem[]
  created_at: string
  updated_at: string
}

export const FREE_SCAN_LIMIT = 5

export const PANTRY_CATEGORIES = [
  'Légumes',
  'Fruits',
  'Viandes & Poissons',
  'Produits laitiers',
  'Féculents',
  'Épicerie',
  'Surgelés',
  'Autres',
]

export const DAYS_FR = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'] as const
export type DayFR = typeof DAYS_FR[number]
