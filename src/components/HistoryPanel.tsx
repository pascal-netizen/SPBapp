import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { HistoryEntry } from '../hooks/useHistory'

interface HistoryPanelProps {
  entries: HistoryEntry[]
  onLoad: (entry: HistoryEntry) => void
  onRemove: (id: string) => void
  onClear: () => void
}

const tabLabels: Record<string, string> = { milling: 'tabs.milling', turning: 'tabs.turning', drilling: 'tabs.drilling' }

export function HistoryPanel({ entries, onLoad, onRemove, onClear }: HistoryPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()
  const prevCount = useRef(entries.length)

  useEffect(() => {
    if (entries.length > prevCount.current) {
      setIsOpen(true)
    }
    prevCount.current = entries.length
  }, [entries.length])

  if (entries.length === 0 && !isOpen) return null

  return (
    <div className="border border-surface-200 dark:border-surface-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800/50 cursor-pointer transition-colors"
      >
        <span className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-surface-400">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
          </svg>
          {t('history.title')} ({entries.length})
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-4 h-4 text-surface-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      {isOpen && (
        <div className="border-t border-surface-100 dark:border-surface-800">
          {entries.length === 0 ? (
            <div className="px-5 py-4 text-sm text-surface-400">{t('history.empty')}</div>
          ) : (
            <>
              <div className="max-h-64 overflow-y-auto">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between px-5 py-2.5 hover:bg-surface-50 dark:hover:bg-surface-800/50 group"
                  >
                    <button
                      onClick={() => onLoad(entry)}
                      className="flex-1 text-left cursor-pointer"
                    >
                      <div className="text-sm text-surface-700 dark:text-surface-300">
                        {t(tabLabels[entry.tab])}
                        {entry.label && <span className="ml-1.5 text-surface-400">– {entry.label}</span>}
                      </div>
                      <div className="text-[11px] text-surface-400 dark:text-surface-500">
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                    </button>
                    <button
                      onClick={() => onRemove(entry.id)}
                      className="p-1 opacity-0 group-hover:opacity-100 text-surface-400 hover:text-red-500 cursor-pointer transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M5.28 4.22a.75.75 0 00-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 101.06 1.06L8 9.06l2.72 2.72a.75.75 0 101.06-1.06L9.06 8l2.72-2.72a.75.75 0 00-1.06-1.06L8 6.94 5.28 4.22z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <div className="border-t border-surface-100 dark:border-surface-800 px-5 py-2">
                <button
                  onClick={onClear}
                  className="text-xs text-red-500 hover:text-red-600 cursor-pointer"
                >
                  {t('history.clear')}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
