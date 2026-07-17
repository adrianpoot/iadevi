import type { Entry } from '../types'

const STORAGE_KEY = 'registros:entries:v1'

export function loadEntries(): Entry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isEntry)
  } catch {
    return []
  }
}

export function saveEntries(entries: Entry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

function isEntry(value: unknown): value is Entry {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'string' &&
    (v.period === 'daily' || v.period === 'weekly' || v.period === 'monthly') &&
    typeof v.date === 'string' &&
    typeof v.title === 'string' &&
    typeof v.notes === 'string' &&
    typeof v.createdAt === 'string' &&
    typeof v.updatedAt === 'string'
  )
}
