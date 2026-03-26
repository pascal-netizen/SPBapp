import { useTranslation } from 'react-i18next'
import { materials } from '../data/materials'

interface MaterialSelectProps {
  selectedId: string
  onSelect: (id: string, kc11: number | null, mc: number | null) => void
}

export function MaterialSelect({ selectedId, onSelect }: MaterialSelectProps) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-2">
      <label className="flex-1 text-sm text-gray-700 dark:text-gray-300">{t('common.material')}</label>
      <select value={selectedId} onChange={(e) => { const mat = materials.find((m) => m.id === e.target.value); if (mat) onSelect(mat.id, mat.kc11, mat.mc) }} className="w-52 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
        {materials.map((m) => (<option key={m.id} value={m.id}>{m.name}</option>))}
      </select>
    </div>
  )
}
