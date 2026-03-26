import { useTranslation } from 'react-i18next'
import type { Tab } from './TabNavigation'

interface Preset {
  labelKey: string
  values: Record<string, number>
}

const millingPresets: Preset[] = [
  { labelKey: 'presets.roughing', values: { fz: 0.3, ap: 4, ae: 30, vc: 150 } },
  { labelKey: 'presets.finishing', values: { fz: 0.15, ap: 0.5, ae: 40, vc: 220 } },
  { labelKey: 'presets.hsc', values: { fz: 0.1, ap: 0.3, ae: 10, vc: 400 } },
]

const turningPresets: Preset[] = [
  { labelKey: 'presets.roughing', values: { f: 0.3, ap: 3, vc: 120 } },
  { labelKey: 'presets.finishing', values: { f: 0.1, ap: 0.5, vc: 200 } },
  { labelKey: 'presets.hsc', values: { f: 0.08, ap: 0.2, vc: 350 } },
]

const drillingPresets: Preset[] = [
  { labelKey: 'presets.standard', values: { f: 0.15, vc: 80 } },
  { labelKey: 'presets.deep', values: { f: 0.1, vc: 60 } },
  { labelKey: 'presets.fast', values: { f: 0.25, vc: 120 } },
]

const presetsByTab: Record<Tab, Preset[]> = {
  milling: millingPresets,
  turning: turningPresets,
  drilling: drillingPresets,
}

interface QuickPresetsProps {
  tab: Tab
  onApply: (values: Record<string, number>) => void
}

export function QuickPresets({ tab, onApply }: QuickPresetsProps) {
  const { t } = useTranslation()
  const presets = presetsByTab[tab]

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-[11px] text-surface-400 dark:text-surface-500 mr-1">{t('presets.label')}:</span>
      {presets.map((p) => (
        <button
          key={p.labelKey}
          onClick={() => onApply(p.values)}
          className="px-2.5 py-1 text-[11px] font-medium rounded-md border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors"
        >
          {t(p.labelKey)}
        </button>
      ))}
    </div>
  )
}
