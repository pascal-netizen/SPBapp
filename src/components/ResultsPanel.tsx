import { useTranslation } from 'react-i18next'
import { ResultCard } from './ResultCard'

interface ResultItem { labelKey: string; value: number; unit: string; decimals?: number }
interface ResultsPanelProps { results: ResultItem[]; utilization: number }

export function ResultsPanel({ results, utilization }: ResultsPanelProps) {
  const { t } = useTranslation()
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-3">
        {t('common.results')}
      </h3>
      {utilization > 100 && (
        <div className="mb-3 px-4 py-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-sm rounded-xl flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          {t('common.warning')}
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        {results.map((r) => (
          <ResultCard
            key={r.labelKey}
            label={t(r.labelKey)}
            value={r.value}
            unit={r.unit}
            decimals={r.decimals ?? 2}
            warning={r.labelKey.includes('utilization') && utilization > 100}
          />
        ))}
      </div>
    </div>
  )
}
