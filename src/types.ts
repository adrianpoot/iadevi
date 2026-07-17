export type Period = 'daily' | 'weekly' | 'monthly'

export interface Entry {
  id: string
  period: Period
  /** ISO date (yyyy-MM-dd) the record refers to. For weekly it's the week start; for monthly the month start. */
  date: string
  title: string
  notes: string
  createdAt: string
  updatedAt: string
}
