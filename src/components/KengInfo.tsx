import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const kengData = [
  { key: 'slotting', range: '2.0 – 2.5' },
  { key: 'fifty', range: '1.7 – 2.0' },
  { key: 'thirty', range: '1.4 – 1.7' },
  { key: 'face', range: '1.2 – 1.5' },
  { key: 'highFeed', range: '1.1 – 1.3' },
]

export function KengInfo() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen])

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-surface-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 cursor-pointer transition-colors"
        title={t('kengTable.title')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-20 mt-2 right-0 w-72 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl shadow-xl shadow-surface-900/10 dark:shadow-surface-950/50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-3">
            {t('kengTable.title')}
          </div>
          <table className="w-full text-sm">
            <tbody>
              {kengData.map((row, i) => (
                <tr key={row.key} className={i > 0 ? 'border-t border-surface-100 dark:border-surface-700' : ''}>
                  <td className="py-2 text-surface-600 dark:text-surface-400">{t(`kengTable.${row.key}`)}</td>
                  <td className="py-2 text-right font-mono text-sm font-medium text-surface-800 dark:text-surface-200">{row.range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
