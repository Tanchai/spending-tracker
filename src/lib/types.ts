export type Category =
  | 'rent'
  | 'groceries'
  | 'restaurants'
  | 'household'
  | 'gym'
  | 'outings'
  | 'pet'
  | 'transport'
  | 'other'

export interface Spending {
  id: string
  added_by: string
  added_name: string
  entry_date: string
  amount: number
  category: Category
  description: string
  shared: boolean
  created_at: string
}

export const CATEGORIES: { key: Category; label: string; emoji: string }[] = [
  { key: 'rent', label: 'Rent & Bills', emoji: '🏠' },
  { key: 'groceries', label: 'Groceries', emoji: '🥦' },
  { key: 'restaurants', label: 'Restaurants', emoji: '🍽️' },
  { key: 'household', label: 'Household', emoji: '🧺' },
  { key: 'gym', label: 'Gym & Fitness', emoji: '💪' },
  { key: 'outings', label: 'Outings', emoji: '🎡' },
  { key: 'pet', label: 'Pet', emoji: '🐾' },
  { key: 'transport', label: 'Transport', emoji: '🚇' },
  { key: 'other', label: 'Other', emoji: '✨' },
]

export const catEmoji = (c: Category) =>
  CATEGORIES.find(x => x.key === c)?.emoji ?? '✨'
export const catLabel = (c: Category) =>
  CATEGORIES.find(x => x.key === c)?.label ?? c