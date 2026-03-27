import { useState, useCallback } from 'react'
import type { Tab } from '../components/TabNavigation'

export interface HistoryEntry {
  id: string
  tab: Tab
  materialId: string
  inputs: Record<string, number>
  timestamp: number
  label?: string
}

const STORAGE_KEY = 'spbapp-history'
const MAX_ENTRIES = 20

function isValidEntry(e: unknown): e is HistoryEntry {
  if (typeof e !== 'object' || e === null) return false
  const obj = e as Record<string, unknown>
  return (
    typeof obj.id === 'string' &&
    typeof obj.tab === 'string' &&
    ['milling', 'turning', 'drilling'].includes(obj.tab as string) &&
    typeof obj.materialId === 'string' &&
    typeof obj.inputs === 'object' && obj.inputs !== null &&
    typeof obj.timestamp === 'number'
  )
}

function loadHistory(): HistoryEntry[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidEntry)
  } catch {
    return []
  }
}

function saveHistory(entries: HistoryEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)))
}

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>(loadHistory)

  const addEntry = useCallback((tab: Tab, materialId: string, inputs: object, label?: string) => {
    const entry: HistoryEntry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      tab,
      materialId,
      inputs: { ...inputs } as Record<string, number>,
      timestamp: Date.now(),
      label,
    }
    setEntries((prev) => {
      const next = [entry, ...prev].slice(0, MAX_ENTRIES)
      saveHistory(next)
      return next
    })
  }, [])

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id)
      saveHistory(next)
      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    setEntries([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return { entries, addEntry, removeEntry, clearHistory }
}
