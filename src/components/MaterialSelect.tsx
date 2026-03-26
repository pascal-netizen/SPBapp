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

  return (
    <div>
      <div className="flex items-center gap-3">
        <label className="w-48 shrink-0 text-sm text-surface-600 dark:text-surface-400">{t('common.material')}</label>
        <div className="flex-1 flex items-center gap-2">
          <select
            value={selectedId}
            onChange={(e) => {
              const m = materials.find((x) => x.id === e.target.value)
              if (m) onSelect(m.id, m.kc11, m.mc)
            }}
            className="flex-1 min-w-0 px-3 py-2 text-sm border border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 dark:focus:border-primary-400"
          >
            {materials.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
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
