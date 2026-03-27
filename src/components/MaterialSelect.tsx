import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { materials } from '../data/materials'
import type { Tab } from './TabNavigation'

interface MaterialSelectProps {
  selectedId: string
  onSelect: (id: string, kc11: number | null, mc: number | null) => void
  tab?: Tab
  currentVc?: number
}

export function MaterialSelect({ selectedId, onSelect, tab, currentVc }: MaterialSelectProps) {
  const { t } = useTranslation()
  const mat = materials.find((m) => m.id === selectedId)
  const vcRange = mat?.vcRange && tab ? mat.vcRange[tab] : null
  const vcOutOfRange = vcRange && currentVc != null && (currentVc < vcRange[0] || currentVc > vcRange[1])

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [highlightIdx, setHighlightIdx] = useState(0)

  const filtered = query
    ? materials.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()))
    : materials

  useEffect(() => {
    setHighlightIdx(0)
  }, [query])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (open && listRef.current) {
      const el = listRef.current.children[highlightIdx] as HTMLElement | undefined
      el?.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightIdx, open])

  const select = (id: string) => {
    const m = materials.find((x) => x.id === id)
    if (m) onSelect(m.id, m.kc11, m.mc)
    setOpen(false)
    setQuery('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault()
        setOpen(true)
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIdx((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[highlightIdx]) select(filtered[highlightIdx].id)
    } else if (e.key === 'Escape') {
      setOpen(false)
      setQuery('')
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <label className="w-48 shrink-0 text-sm text-surface-600 dark:text-surface-400">{t('common.material')}</label>
        <div className="flex-1 flex items-center gap-2">
          <div ref={wrapRef} className="flex-1 min-w-0 relative">
            <input
              ref={inputRef}
              type="text"
              value={open ? query : mat?.name ?? ''}
              placeholder={mat?.name}
              onFocus={() => { setOpen(true); setQuery('') }}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 text-sm border border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 dark:focus:border-primary-400"
            />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-surface-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
            {open && (
              <ul
                ref={listRef}
                className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-auto rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 shadow-lg py-1"
              >
                {filtered.length === 0 && (
                  <li className="px-3 py-2 text-sm text-surface-400">Kein Treffer</li>
                )}
                {filtered.map((m, i) => (
                  <li
                    key={m.id}
                    onMouseDown={() => select(m.id)}
                    onMouseEnter={() => setHighlightIdx(i)}
                    className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between ${
                      i === highlightIdx
                        ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300'
                        : 'text-surface-700 dark:text-surface-300'
                    } ${m.id === selectedId ? 'font-medium' : ''}`}
                  >
                    <span>{m.name}</span>
                    {m.id === selectedId && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                        <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                      </svg>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <span className="w-14 shrink-0" />
        </div>
      </div>
      {mat && mat.id !== 'custom' && (
        <div className="mt-1.5 ml-[calc(12rem+0.75rem)] flex items-center gap-3 text-[11px] text-surface-400 dark:text-surface-500">
          {mat.density && <span>{mat.density} kg/dm³</span>}
          {mat.hardness && <span>{mat.hardness}</span>}
          {vcRange && (
            <span className={vcOutOfRange ? 'text-amber-600 dark:text-amber-400 font-medium' : ''}>
              vc: {vcRange[0]}–{vcRange[1]} m/min
              {vcOutOfRange && ' !'}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
