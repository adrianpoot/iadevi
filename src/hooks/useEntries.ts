import { useCallback, useEffect, useState } from 'react'
import type { Entry, Period } from '../types'
import { loadEntries, saveEntries } from '../lib/storage'
import { anchorDate } from '../lib/date'

function uid(): string {
  return crypto.randomUUID()
}

export interface NewEntry {
  period: Period
  date: Date
  title: string
  notes: string
}

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>(() => loadEntries())

  useEffect(() => {
    saveEntries(entries)
  }, [entries])

  const addEntry = useCallback((input: NewEntry) => {
    const now = new Date().toISOString()
    const entry: Entry = {
      id: uid(),
      period: input.period,
      date: anchorDate(input.period, input.date),
      title: input.title.trim(),
      notes: input.notes.trim(),
      createdAt: now,
      updatedAt: now,
    }
    setEntries((prev) => [entry, ...prev])
  }, [])

  const updateEntry = useCallback(
    (id: string, patch: Pick<Entry, 'title' | 'notes' | 'date' | 'period'>) => {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === id
            ? {
                ...e,
                ...patch,
                title: patch.title.trim(),
                notes: patch.notes.trim(),
                updatedAt: new Date().toISOString(),
              }
            : e,
        ),
      )
    },
    [],
  )

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }, [])

  return { entries, addEntry, updateEntry, deleteEntry }
}
