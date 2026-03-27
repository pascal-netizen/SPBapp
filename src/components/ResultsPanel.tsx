import { useTranslation } from 'react-i18next'
import { ResultCard } from './ResultCard'

interface ResultItem { labelKey: string; value: number; unit: string; decimals?: number; hero?: boolean; timeFormat?: boolean }
interface ResultGroup { groupKey: string; items: ResultItem[] }
interface ResultsPanelProps { groups: ResultGroup[]; utilization: number }

export function ResultsPanel({ groups, utilization }: ResultsPanelProps) {
  const { t } = useTranslation()
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M8 1a.75.75 0 01.75.75v6.5a.75.75 0 01-1.5 0v-6.5A.75.75 0 018 1zM3.497 3.497a.75.75 0 011.06 0l4.596 4.596a.75.75 0 01-1.06 1.06L3.496 4.558a.75.75 0 010-1.06z" />
            <path d="M7.25 8.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" />
            <path fillRule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zm0-1.5a5.5 5.5 0 100-11 5.5 5.5 0 000 11z" clipRule="evenodd" />
          </svg>
          {t('common.results')}
        </h3>
        <span className="text-[11px] text-surface-400 dark:text-surface-400">{t('common.clickToCopy')}</span>
      </div>
      <div className="bg-primary-50/50 dark:bg-primary-950/20 border border-primary-200/60 dark:border-primary-900/40 rounded-xl p-4 space-y-4">
        {utilization > 100 && (
          <div className="px-4 py-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-sm rounded-xl flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {t('common.warning')}
          </div>
        )}
        {groups.map((group) => (
          <div key={group.groupKey}>
            <div className="flex items-center gap-2 mb-1.5 px-1">
              <div className="w-0.5 h-3.5 rounded-full bg-primary-500/60 dark:bg-primary-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-600/70 dark:text-primary-300">
                {t(group.groupKey)}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {group.items.map((r) => (
                <ResultCard
                  key={r.labelKey}
                  label={t(r.labelKey)}
                  value={r.value}
                  unit={r.timeFormat ? '' : r.unit}
                  decimals={r.decimals ?? 2}
                  warning={r.labelKey.includes('utilization') && utilization > 100}
                  hero={r.hero}
                  timeFormat={r.timeFormat}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
