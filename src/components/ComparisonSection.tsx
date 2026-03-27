import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { HistoryEntry } from '../hooks/useHistory'
import type { Tab } from './TabNavigation'

interface ComparisonParam {
  key: string
  labelKey: string
  unit: string
  decimals: number
  sollValue: number
  timeFormat?: boolean
}

interface ComparisonSectionProps {
  tab: Tab
  params: ComparisonParam[]
  historyEntries: HistoryEntry[]
  calculateFromInputs: (inputs: Record<string, number>) => Record<string, number>
}

type IstSource = 'history' | 'manual'

function fmtValue(value: number, decimals: number): string {
  return value.toLocaleString('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

function fmtTime(minutes: number): string {
  const totalSeconds = Math.round(minutes * 60)
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return s > 0 ? `${m} min ${s} s` : `${m} min`
}

function fmtDelta(soll: number, ist: number, decimals: number, timeFormat?: boolean): { abs: string; pct: string; color: string } {
  const diff = ist - soll
  const pctVal = soll !== 0 ? (diff / soll) * 100 : 0
  const absPct = Math.abs(pctVal)

  const color = absPct < 5 ? 'text-green-600 dark:text-green-400' : absPct < 15 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'

  let absStr: string
  if (timeFormat) {
    const diffSec = Math.round(diff * 60)
    const sign = diffSec >= 0 ? '+' : ''
    absStr = `${sign}${diffSec} s`
  } else {
    const sign = diff >= 0 ? '+' : ''
    absStr = `${sign}${fmtValue(diff, decimals)}`
  }

  const pctSign = pctVal >= 0 ? '+' : ''
  const pctStr = `${pctSign}${fmtValue(pctVal, 1)}%`

  return { abs: absStr, pct: pctStr, color }
}

const tabLabels: Record<string, string> = { milling: 'tabs.milling', turning: 'tabs.turning', drilling: 'tabs.drilling' }

export function ComparisonSection({ tab, params, historyEntries, calculateFromInputs }: ComparisonSectionProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [source, setSource] = useState<IstSource>('history')
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null)
  const [manualValues, setManualValues] = useState<Record<string, string>>({})

  const tabEntries = historyEntries.filter((e) => e.tab === tab)
  const selectedEntry = tabEntries.find((e) => e.id === selectedEntryId)

  const calculatedIst = source === 'history' && selectedEntry
    ? calculateFromInputs(selectedEntry.inputs)
    : null

  const getIstValue = (param: ComparisonParam): number | null => {
    if (source === 'history' && calculatedIst) {
      return calculatedIst[param.key] ?? null
    }
    if (source === 'manual') {
      const raw = manualValues[param.key]
      if (raw === undefined || raw === '') return null
      const normalized = raw.replace(',', '.')
      const val = parseFloat(normalized)
      return isFinite(val) ? val : null
    }
    return null
  }

  const setManual = (key: string, value: string) => {
    setManualValues((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="mt-4 border border-surface-200 dark:border-surface-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800/50 cursor-pointer transition-colors"
      >
        <span className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-surface-400">
            <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.451a.75.75 0 000-1.5H4.5a.75.75 0 00-.75.75v3.75a.75.75 0 001.5 0v-2.033a7 7 0 0011.712-3.138.75.75 0 00-1.449-.389zm-10.624-3.85a5.5 5.5 0 019.201-2.465l.312.31H11.75a.75.75 0 000 1.5h3.75a.75.75 0 00.75-.75V2.42a.75.75 0 00-1.5 0v2.033A7 7 0 003.038 7.588a.75.75 0 001.45.388z" clipRule="evenodd" />
          </svg>
          {t('comparison.title')}
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
        <div className="px-5 pb-5 border-t border-surface-100 dark:border-surface-800">
          <div className="pt-4 pb-3 flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Source toggle */}
            <div className="flex rounded-lg overflow-hidden border border-surface-200 dark:border-surface-700 shrink-0">
              <button
                onClick={() => setSource('history')}
                className={`px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                  source === 'history'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-700'
                }`}
              >
                {t('comparison.fromHistory')}
              </button>
              <button
                onClick={() => setSource('manual')}
                className={`px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                  source === 'manual'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-700'
                }`}
              >
                {t('comparison.manual')}
              </button>
            </div>

            {/* History selector */}
            {source === 'history' && (
              <select
                value={selectedEntryId ?? ''}
                onChange={(e) => setSelectedEntryId(e.target.value || null)}
                className="flex-1 min-w-0 px-3 py-2 text-sm border border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500"
              >
                <option value="">{t('comparison.selectEntry')}</option>
                {tabEntries.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {t(tabLabels[entry.tab])} — {new Date(entry.timestamp).toLocaleString()}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Comparison table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700">
                  <th className="text-left py-2 pr-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">{t('comparison.parameter')}</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">{t('comparison.soll')}</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">{t('comparison.ist')}</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Δ</th>
                  <th className="text-right py-2 pl-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Δ%</th>
                </tr>
              </thead>
              <tbody>
                {params.map((param) => {
                  const istValue = getIstValue(param)
                  const delta = istValue !== null ? fmtDelta(param.sollValue, istValue, param.decimals, param.timeFormat) : null

                  return (
                    <tr key={param.key} className="border-b border-surface-100 dark:border-surface-800 last:border-0">
                      <td className="py-2.5 pr-3 text-surface-700 dark:text-surface-300 font-medium">{t(param.labelKey)}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-surface-900 dark:text-white">
                        {param.timeFormat ? fmtTime(param.sollValue) : fmtValue(param.sollValue, param.decimals)} {!param.timeFormat && <span className="text-surface-400 dark:text-surface-400 text-xs">{param.unit}</span>}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {source === 'manual' ? (
                          <input
                            type="text"
                            inputMode="decimal"
                            value={manualValues[param.key] ?? ''}
                            onChange={(e) => setManual(param.key, e.target.value)}
                            placeholder="—"
                            className="w-24 ml-auto text-right px-2 py-1 text-sm font-mono border border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 placeholder:text-surface-300 dark:placeholder:text-surface-600"
                          />
                        ) : istValue !== null ? (
                          <span className="text-surface-900 dark:text-white">
                            {param.timeFormat ? fmtTime(istValue) : fmtValue(istValue, param.decimals)} {!param.timeFormat && <span className="text-surface-400 dark:text-surface-400 text-xs">{param.unit}</span>}
                          </span>
                        ) : (
                          <span className="text-surface-300 dark:text-surface-600">—</span>
                        )}
                      </td>
                      <td className={`py-2.5 px-3 text-right font-mono text-sm ${delta?.color ?? 'text-surface-300 dark:text-surface-600'}`}>
                        {delta?.abs ?? '—'}
                      </td>
                      <td className={`py-2.5 pl-3 text-right font-mono text-sm font-semibold ${delta?.color ?? 'text-surface-300 dark:text-surface-600'}`}>
                        {delta?.pct ?? '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
