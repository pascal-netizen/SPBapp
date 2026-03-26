import { useTranslation } from 'react-i18next'
import { ResultCard } from './ResultCard'

interface ResultItem { labelKey: string; value: number; unit: string; decimals?: number }
interface ResultsPanelProps { results: ResultItem[]; utilization: number }

export function ResultsPanel({ results, utilization }: ResultsPanelProps) {
  const { t } = useTranslation()
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{t('common.results')}</h3>
      {utilization > 100 && (<div className="mb-3 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm rounded">{t('common.warning')}</div>)}
      <div className="grid grid-cols-2 gap-2">
        {results.map((r) => (<ResultCard key={r.labelKey} label={t(r.labelKey)} value={r.value} unit={r.unit} decimals={r.decimals ?? 2} warning={r.labelKey.includes('utilization') && utilization > 100} />))}
      </div>
    </div>
  )
}
