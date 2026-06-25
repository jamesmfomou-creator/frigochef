import { Ingredient, Recipe } from './types'

export const MOCK_INGREDIENTS: Ingredient[] = [
  { id: '1', name: 'Tomates', confidence: 0.95 },
  { id: '2', name: 'Mozzarella', confidence: 0.92 },
  { id: '3', name: 'Œufs', confidence: 0.88 },
  { id: '4', name: 'Basilic', confidence: 0.85 },
  { id: '5', name: 'Fromage râpé', confidence: 0.79 },
]

export const MOCK_RECIPES: Recipe[] = [
  {
    title: 'Salade Caprese',
    description: 'Une entrée italienne fraîche et légère avec tomates et mozzarella fondante.',
    time: '10 min',
    calories: '320 kcal',
    missing: ["Huile d'olive", 'Sel', 'Poivre'],
    steps: [
      'Couper les tomates en tranches épaisses.',
      'Couper la mozzarella en tranches de même épaisseur.',
      'Alterner tomates et mozzarella sur un plat de service.',
      'Disposer les feuilles de basilic entre les tranches.',
      "Arroser généreusement d'huile d'olive.",
      'Assaisonner de sel et poivre, servir immédiatement.',
    ],
  },
  {
    title: 'Omelette Provençale',
    description: 'Une omelette moelleuse aux tomates confites et basilic frais.',
    time: '15 min',
    calories: '410 kcal',
    missing: ['Beurre', 'Sel', 'Poivre'],
    steps: [
      'Couper les tomates en petits dés, les égoutter.',
      'Battre les œufs avec sel et poivre dans un bol.',
      'Faire fondre le beurre dans une poêle à feu moyen.',
      'Verser les œufs et remuer doucement.',
      'Ajouter les tomates et le basilic ciselé.',
      "Plier l'omelette et servir sans attendre.",
    ],
  },
  {
    title: 'Pizza Margherita Express',
    description: 'La pizza classique napolitaine avec tomates fraîches, mozzarella et basilic.',
    time: '25 min',
    calories: '680 kcal',
    missing: ['Pâte à pizza', 'Sauce tomate', "Huile d'olive"],
    steps: [
      'Préchauffer le four à 240°C.',
      'Étaler la pâte à pizza sur une plaque.',
      'Napper de sauce tomate en laissant un bord libre.',
      'Déposer les tranches de mozzarella.',
      'Ajouter les tomates fraîches coupées.',
      "Enfourner 12-15 minutes jusqu'à ce que la pâte soit dorée.",
      'Garnir de basilic frais à la sortie du four.',
    ],
  },
  {
    title: 'Gratin de Tomates au Fromage',
    description: 'Un gratin généreux et réconfortant, parfait pour un dîner rapide en semaine.',
    time: '30 min',
    calories: '520 kcal',
    missing: ['Chapelure', 'Herbes de Provence', "Huile d'olive"],
    steps: [
      'Préchauffer le four à 180°C.',
      'Couper les tomates en rondelles épaisses.',
      'Beurrer un plat à gratin.',
      'Disposer les rondelles de tomates en couches.',
      'Parsemer de fromage râpé et de chapelure.',
      "Ajouter les herbes et un filet d'huile.",
      "Enfourner 20-25 minutes jusqu'à gratinage doré.",
    ],
  },
  {
    title: 'Soupe de Tomates au Basilic',
    description: 'Une soupe veloutée pleine de saveurs, simple et économique.',
    time: '20 min',
    calories: '180 kcal',
    missing: ['Oignon', 'Bouillon de légumes', 'Crème fraîche'],
    steps: [
      "Faire revenir l'oignon émincé dans de l'huile.",
      'Ajouter les tomates coupées en quartiers.',
      'Couvrir de bouillon et laisser mijoter 15 minutes.',
      "Mixer jusqu'à obtenir une texture lisse.",
      "Ajouter la crème fraîche, rectifier l'assaisonnement.",
      'Servir chaud avec des feuilles de basilic.',
    ],
  },
]
