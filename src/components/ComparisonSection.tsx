import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ComparisonParam {
  key: string
  labelKey: string
  unit: string
  decimals: number
  sollValue: number
  timeFormat?: boolean
}

interface ComparisonSectionProps {
  params: ComparisonParam[]
  savedIst: Record<string, number> | null
  savedSoll: Record<string, number> | null
}

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

function fmtDelta(ist: number, soll: number, decimals: number, timeFormat?: boolean): { abs: string; pct: string; color: string } {
  const diff = soll - ist
  const pctVal = ist !== 0 ? (diff / ist) * 100 : 0
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

function renderValue(value: number, decimals: number, unit: string, timeFormat?: boolean) {
  return (
    <span className="text-surface-900 dark:text-white">
      {timeFormat ? fmtTime(value) : fmtValue(value, decimals)} {!timeFormat && <span className="text-surface-400 dark:text-surface-400 text-xs">{unit}</span>}
    </span>
  )
}

export function ComparisonSection({ params, savedIst, savedSoll }: ComparisonSectionProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [manualMode, setManualMode] = useState(false)
  const [manualIst, setManualIst] = useState<Record<string, string>>({})
  const [manualSoll, setManualSoll] = useState<Record<string, string>>({})

  const parseManual = (raw: string | undefined): number | null => {
    if (raw === undefined || raw === '') return null
    const val = parseFloat(raw.replace(',', '.'))
    return isFinite(val) ? val : null
  }

  const getIst = (param: ComparisonParam): number | null => {
    if (manualMode) return parseManual(manualIst[param.key])
    return savedIst?.[param.key] ?? null
  }

  const getSoll = (param: ComparisonParam): number | null => {
    if (manualMode) return parseManual(manualSoll[param.key])
    return savedSoll?.[param.key] ?? null
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
          {!manualMode && savedIst && savedSoll && (
            <span className="ml-1 w-2 h-2 rounded-full bg-green-500" />
          )}
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
          <div className="pt-4 pb-3 flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={manualMode}
                onChange={(e) => setManualMode(e.target.checked)}
                className="rounded border-surface-300 dark:border-surface-600 text-primary-600 focus:ring-primary-500"
              />
              {t('comparison.manual')}
            </label>
            {!manualMode && !savedIst && !savedSoll && (
              <span className="text-xs text-surface-400 dark:text-surface-400">
                {t('comparison.hint')}
              </span>
            )}
          </div>

          {/* Comparison table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700">
                  <th className="text-left py-2 pr-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">{t('comparison.parameter')}</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">{t('comparison.ist')}</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">{t('comparison.soll')}</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">{t('comparison.diff')}</th>
                  <th className="text-right py-2 pl-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">{t('comparison.diffPct')}</th>
                </tr>
              </thead>
              <tbody>
                {params.map((param) => {
                  const istVal = getIst(param)
                  const sollVal = getSoll(param)
                  const delta = istVal !== null && sollVal !== null ? fmtDelta(istVal, sollVal, param.decimals, param.timeFormat) : null

                  return (
                    <tr key={param.key} className="border-b border-surface-100 dark:border-surface-800 last:border-0">
                      <td className="py-2.5 pr-3 text-surface-700 dark:text-surface-300 font-medium">{t(param.labelKey)}</td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {manualMode ? (
                          <input
                            type="text"
                            inputMode="decimal"
                            value={manualIst[param.key] ?? ''}
                            onChange={(e) => setManualIst((prev) => ({ ...prev, [param.key]: e.target.value }))}
                            placeholder="—"
                            className="w-24 ml-auto text-right px-2 py-1 text-sm font-mono border border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 placeholder:text-surface-300 dark:placeholder:text-surface-600"
                          />
                        ) : istVal !== null ? (
                          renderValue(istVal, param.decimals, param.unit, param.timeFormat)
                        ) : (
                          <span className="text-surface-300 dark:text-surface-600">—</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {manualMode ? (
                          <input
                            type="text"
                            inputMode="decimal"
                            value={manualSoll[param.key] ?? ''}
                            onChange={(e) => setManualSoll((prev) => ({ ...prev, [param.key]: e.target.value }))}
                            placeholder="—"
                            className="w-24 ml-auto text-right px-2 py-1 text-sm font-mono border border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 placeholder:text-surface-300 dark:placeholder:text-surface-600"
                          />
                        ) : sollVal !== null ? (
                          renderValue(sollVal, param.decimals, param.unit, param.timeFormat)
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
