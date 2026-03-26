import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { InputField } from './InputField'
import { MaterialSelect } from './MaterialSelect'
import { ResultsPanel } from './ResultsPanel'
import { CalculationSteps } from './CalculationSteps'
import { calculateTurning } from '../calculations/turning'
import type { TurningInputs } from '../calculations/types'

export function TurningTab() {
  const { t } = useTranslation()
  const [materialId, setMaterialId] = useState('42crmo4')
  const [inputs, setInputs] = useState<TurningInputs>({
    d: 50, vc: 150, f: 0.2, ap: 2, kappaR: 90,
    kc11: 2100, mc: 0.25, eta: 0.8, Pmachine: 8,
  })
  const update = (key: keyof TurningInputs, value: number) => setInputs((prev) => ({ ...prev, [key]: value }))
  const handleMaterial = (id: string, kc11: number | null, mc: number | null) => {
    setMaterialId(id)
    if (kc11 !== null && mc !== null) setInputs((prev) => ({ ...prev, kc11, mc }))
  }
  const { results, steps } = useMemo(() => calculateTurning(inputs), [inputs])
  const resultItems = [
    { labelKey: 'turning.n', value: results.n, unit: t('units.rpm') },
    { labelKey: 'turning.vf', value: results.vf, unit: t('units.mmmin') },
    { labelKey: 'turning.h', value: results.h, unit: t('units.mm'), decimals: 4 },
    { labelKey: 'turning.b', value: results.b, unit: t('units.mm') },
    { labelKey: 'turning.A', value: results.A, unit: 'mm²', decimals: 4 },
    { labelKey: 'turning.kc', value: results.kc, unit: t('units.Nmm2') },
    { labelKey: 'turning.Fc', value: results.Fc, unit: t('units.N') },
    { labelKey: 'turning.Ff', value: results.Ff, unit: t('units.N') },
    { labelKey: 'turning.Fp', value: results.Fp, unit: t('units.N') },
    { labelKey: 'turning.Pc', value: results.Pc, unit: t('units.kW') },
    { labelKey: 'turning.P', value: results.P, unit: t('units.kW') },
    { labelKey: 'turning.M', value: results.M, unit: t('units.Nm') },
    { labelKey: 'turning.Q', value: results.Q, unit: t('units.cm3min') },
    { labelKey: 'common.utilization', value: results.utilization, unit: t('units.percent'), decimals: 1 },
  ]
  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight text-surface-900 dark:text-white mb-5">{t('turning.title')}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-3">
            {t('common.inputs')}
          </h3>
          <div className="space-y-2.5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-4">
            <MaterialSelect selectedId={materialId} onSelect={handleMaterial} />
            <div className="border-t border-surface-100 dark:border-surface-800 my-2" />
            <InputField label={t('turning.d')} value={inputs.d} unit="mm" onChange={(v) => update('d', v)} step={1} />
            <InputField label={t('turning.vc')} value={inputs.vc} unit="m/min" onChange={(v) => update('vc', v)} step={5} />
            <InputField label={t('turning.f')} value={inputs.f} unit="mm/U" onChange={(v) => update('f', v)} step={0.01} />
            <InputField label={t('turning.ap')} value={inputs.ap} unit="mm" onChange={(v) => update('ap', v)} step={0.5} />
            <InputField label={t('turning.kappaR')} value={inputs.kappaR} unit="°" onChange={(v) => update('kappaR', v)} step={1} />
            <div className="border-t border-surface-100 dark:border-surface-800 my-2" />
            <InputField label={t('turning.kc11')} value={inputs.kc11} unit="N/mm²" onChange={(v) => update('kc11', v)} step={10} />
            <InputField label={t('turning.mc')} value={inputs.mc} unit="" onChange={(v) => update('mc', v)} step={0.01} />
            <InputField label={t('common.efficiency')} value={inputs.eta} unit="" onChange={(v) => update('eta', v)} step={0.05} min={0.1} max={1} />
            <div className="border-t border-surface-100 dark:border-surface-800 my-2" />
            <InputField label={t('common.machinePower')} value={inputs.Pmachine} unit="kW" onChange={(v) => update('Pmachine', v)} step={0.5} />
          </div>
        </div>
        <ResultsPanel results={resultItems} utilization={results.utilization} />
      </div>
      <CalculationSteps steps={steps} />
    </div>
  )
}
