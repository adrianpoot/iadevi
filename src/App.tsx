import { useMemo, useState } from 'react'
import type { Entry, Period } from './types'
import { useEntries } from './hooks/useEntries'
import { formatAnchor } from './lib/date'
import { useDarkMode } from './hooks/useDarkMode'
import { Modal } from './components/Modal'
import { EntryForm } from './components/EntryForm'
import type { EntryFormValues } from './components/EntryForm'
import { EntryCard } from './components/EntryCard'

const TABS: { id: Period; label: string }[] = [
  { id: 'daily', label: 'Diario' },
  { id: 'weekly', label: 'Semanal' },
  { id: 'monthly', label: 'Mensual' },
]

const EMPTY_TEXT: Record<Period, string> = {
  daily: 'Aún no tienes registros diarios.',
  weekly: 'Aún no tienes registros semanales.',
  monthly: 'Aún no tienes registros mensuales.',
}

export default function App() {
  const { entries, addEntry, updateEntry, deleteEntry } = useEntries()
  const { dark, toggle } = useDarkMode()
  const [active, setActive] = useState<Period>('daily')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Entry | null>(null)

  const groups = useMemo(() => groupByAnchor(entries, active), [entries, active])

  const openNew = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (entry: Entry) => {
    setEditing(entry)
    setFormOpen(true)
  }

  const handleSubmit = (values: EntryFormValues) => {
    if (editing) {
      updateEntry(editing.id, {
        title: values.title,
        notes: values.notes,
        date: values.date.toISOString(),
        period: values.period,
      })
    } else {
      addEntry(values)
    }
    setFormOpen(false)
    setEditing(null)
  }

  return (
    <div className="min-h-full bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto max-w-2xl px-5 py-10">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Registros</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Tus notas diarias, semanales y mensuales.
            </p>
          </div>
          <button
            type="button"
            onClick={toggle}
            className="rounded-lg border border-neutral-200 p-2 text-neutral-600 transition hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800"
            aria-label="Cambiar tema"
          >
            {dark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
              </svg>
            )}
          </button>
        </header>

        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="inline-flex rounded-xl bg-neutral-100 p-1 dark:bg-neutral-900">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                  active === tab.id
                    ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white'
                    : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={openNew}
            className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Nuevo
          </button>
        </div>

        {groups.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 py-16 text-center text-sm text-neutral-400 dark:border-neutral-800">
            {EMPTY_TEXT[active]}
          </div>
        ) : (
          <div className="space-y-8">
            {groups.map((group) => (
              <section key={group.anchor}>
                <h2 className="mb-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  {formatAnchor(active, group.anchor)}
                </h2>
                <div className="space-y-3">
                  {group.items.map((entry) => (
                    <EntryCard
                      key={entry.id}
                      entry={entry}
                      onEdit={openEdit}
                      onDelete={deleteEntry}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={formOpen}
        title={editing ? 'Editar registro' : 'Nuevo registro'}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
      >
        <EntryForm
          period={active}
          initial={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setFormOpen(false)
            setEditing(null)
          }}
        />
      </Modal>
    </div>
  )
}

interface Group {
  anchor: string
  items: Entry[]
}

function groupByAnchor(entries: Entry[], period: Period): Group[] {
  const filtered = entries.filter((e) => e.period === period)
  const map = new Map<string, Entry[]>()
  for (const entry of filtered) {
    const list = map.get(entry.date) ?? []
    list.push(entry)
    map.set(entry.date, list)
  }
  return Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([anchor, items]) => ({ anchor, items }))
}
