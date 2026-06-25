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
