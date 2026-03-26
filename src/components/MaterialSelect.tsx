import { useTranslation } from 'react-i18next'
import { materials } from '../data/materials'

interface MaterialSelectProps {
  selectedId: string
  onSelect: (id: string, kc11: number | null, mc: number | null) => void
}

export function MaterialSelect({ selectedId, onSelect }: MaterialSelectProps) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-3">
      <label className="w-48 shrink-0 text-sm text-surface-600 dark:text-surface-400">{t('common.material')}</label>
      <div className="flex-1 flex items-center gap-2">
        <select
          value={selectedId}
          onChange={(e) => {
            const mat = materials.find((m) => m.id === e.target.value)
            if (mat) onSelect(mat.id, mat.kc11, mat.mc)
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
  )
}
