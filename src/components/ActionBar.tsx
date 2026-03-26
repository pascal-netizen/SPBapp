import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ActionBarProps {
  onSave: () => void
  onExportCSV: () => void
  onShare: () => void
}

export function ActionBar({ onSave, onExportCSV, onShare }: ActionBarProps) {
  const { t } = useTranslation()
  const [shared, setShared] = useState(false)

  const handleShare = () => {
    onShare()
    setShared(true)
    setTimeout(() => setShared(false), 1500)
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={onSave}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M3.5 2A1.5 1.5 0 002 3.5v9A1.5 1.5 0 003.5 14h9a1.5 1.5 0 001.5-1.5v-7A1.5 1.5 0 0012.5 4H10V3.5A1.5 1.5 0 008.5 2h-5zM8 4V3.5a.5.5 0 00-.5-.5h-4a.5.5 0 00-.5.5V4h5zm2.354 4.854a.5.5 0 00-.708-.708L8.5 9.293V6.5a.5.5 0 00-1 0v2.793L6.354 8.146a.5.5 0 10-.708.708l2 2a.5.5 0 00.708 0l2-2z" />
        </svg>
        {t('actions.save')}
      </button>
      <button
        onClick={onExportCSV}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
          <path fillRule="evenodd" d="M4 2a1.5 1.5 0 00-1.5 1.5v9A1.5 1.5 0 004 14h8a1.5 1.5 0 001.5-1.5V6.621a1.5 1.5 0 00-.44-1.06L9.94 2.439A1.5 1.5 0 008.878 2H4zm4 3.5a.75.75 0 01.75.75v2.69l.72-.72a.75.75 0 111.06 1.06l-2 2a.75.75 0 01-1.06 0l-2-2a.75.75 0 011.06-1.06l.72.72V6.25A.75.75 0 018 5.5z" clipRule="evenodd" />
        </svg>
        CSV
      </button>
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M12 6a2 2 0 110-4 2 2 0 010 4zM4 10a2 2 0 110-4 2 2 0 010 4zm6 4a2 2 0 110-4 2 2 0 010 4z" />
          <path d="M5.65 7.15l4.7-2.3M5.65 8.85l4.7 2.3" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
        {shared ? t('actions.shared') : t('actions.share')}
      </button>
    </div>
  )
}
