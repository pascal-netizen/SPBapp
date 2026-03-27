import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { HistoryEntry } from '../hooks/useHistory'

interface HistoryDrawerProps {
  isOpen: boolean
  onClose: () => void
  entries: HistoryEntry[]
  onLoad: (entry: HistoryEntry) => void
  onRemove: (id: string) => void
  onClear: () => void
}

const tabLabels: Record<string, string> = { milling: 'tabs.milling', turning: 'tabs.turning', drilling: 'tabs.drilling' }

export function HistoryDrawer({ isOpen, onClose, entries, onLoad, onRemove, onClear }: HistoryDrawerProps) {
  const { t } = useTranslation()

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[min(20rem,100vw)] sm:w-96 bg-white dark:bg-surface-900 border-l border-surface-200 dark:border-surface-800 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200 dark:border-surface-800">
          <h2 className="text-sm font-semibold text-surface-900 dark:text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-surface-400">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
            </svg>
            {t('history.title')}
            <span className="text-xs font-normal text-surface-400">({entries.length})</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        {/* Entries */}
        <div className="flex-1 overflow-y-auto">
          {entries.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 mx-auto text-surface-300 dark:text-surface-600 mb-3">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-surface-400 dark:text-surface-400">{t('history.empty')}</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-2 px-5 py-3 border-b border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800/50 group"
              >
                <button
                  onClick={() => { onLoad(entry); onClose() }}
                  className="flex-1 text-left cursor-pointer"
                >
                  <div className="text-sm font-medium text-surface-700 dark:text-surface-300">
                    {t(tabLabels[entry.tab])}
                  </div>
                  <div className="text-[11px] text-surface-400 dark:text-surface-400 mt-0.5">
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                </button>
                <button
                  onClick={() => onRemove(entry.id)}
                  className="p-1.5 sm:opacity-0 sm:group-hover:opacity-100 rounded-md text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 000 1.5h.3l.815 8.15A1.5 1.5 0 005.357 15h5.285a1.5 1.5 0 001.493-1.35l.815-8.15h.3a.75.75 0 000-1.5H11v-.75A2.25 2.25 0 008.75 1h-1.5A2.25 2.25 0 005 3.25zm2.25-.75a.75.75 0 00-.75.75V4h3v-.75a.75.75 0 00-.75-.75h-1.5zM6.05 6a.75.75 0 01.787.713l.275 5.5a.75.75 0 01-1.498.075l-.275-5.5A.75.75 0 016.05 6zm3.9 0a.75.75 0 01.712.787l-.275 5.5a.75.75 0 01-1.498-.075l.275-5.5a.75.75 0 01.786-.711z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {entries.length > 0 && (
          <div className="px-5 py-3 border-t border-surface-200 dark:border-surface-800">
            <button
              onClick={onClear}
              className="text-xs text-red-500 hover:text-red-600 cursor-pointer"
            >
              {t('history.clear')}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
