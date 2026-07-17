import {
  endOfWeek,
  format,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { es } from 'date-fns/locale'
import type { Period } from '../types'

const ISO = 'yyyy-MM-dd'

/** Normalizes a picked date to the canonical anchor for a given period. */
export function anchorDate(period: Period, date: Date): string {
  switch (period) {
    case 'daily':
      return format(date, ISO)
    case 'weekly':
      return format(startOfWeek(date, { weekStartsOn: 1 }), ISO)
    case 'monthly':
      return format(startOfMonth(date), ISO)
  }
}

export function todayAnchor(period: Period): string {
  return anchorDate(period, new Date())
}

/** Human-readable label for a stored anchor date. */
export function formatAnchor(period: Period, iso: string): string {
  const d = parseISO(iso)
  switch (period) {
    case 'daily':
      return capitalize(format(d, "EEEE d 'de' MMMM 'de' yyyy", { locale: es }))
    case 'weekly': {
      const end = endOfWeek(d, { weekStartsOn: 1 })
      return `Semana del ${format(d, 'd MMM', { locale: es })} al ${format(end, 'd MMM yyyy', { locale: es })}`
    }
    case 'monthly':
      return capitalize(format(d, "MMMM 'de' yyyy", { locale: es }))
  }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
