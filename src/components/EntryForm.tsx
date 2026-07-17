import { useState } from 'react'
import type { FormEvent } from 'react'
import { format } from 'date-fns'
import type { Entry, Period } from '../types'

const PERIOD_LABELS: Record<Period, string> = {
  daily: 'Diario',
  weekly: 'Semanal',
  monthly: 'Mensual',
}

export interface EntryFormValues {
  period: Period
  date: Date
  title: string
  notes: string
}

interface EntryFormProps {
  period: Period
  initial?: Entry
  onSubmit: (values: EntryFormValues) => void
  onCancel: () => void
}

export function EntryForm({ period, initial, onSubmit, onCancel }: EntryFormProps) {
  const [date, setDate] = useState(
    initial ? initial.date : format(new Date(), 'yyyy-MM-dd'),
  )
  const [title, setTitle] = useState(initial?.title ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({
      period: initial?.period ?? period,
      date: new Date(`${date}T00:00:00`),
      title,
      notes,
    })
  }

  const inputClass =
    'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-neutral-400'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
          Fecha ({PERIOD_LABELS[initial?.period ?? period]})
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
          Título
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="¿Qué quieres registrar?"
          className={inputClass}
          autoFocus
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
          Notas
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Detalles (opcional)"
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-40 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          disabled={!title.trim()}
        >
          Guardar
        </button>
      </div>
    </form>
  )
}
