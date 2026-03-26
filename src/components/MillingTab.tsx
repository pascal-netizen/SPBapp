import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { InputField } from './InputField'
import { MaterialSelect } from './MaterialSelect'
import { ResultsPanel } from './ResultsPanel'
import { CalculationSteps } from './CalculationSteps'
import { KengInfo } from './KengInfo'
import { calculateMilling, calculateKeng } from '../calculations/milling'
import type { MillingInputs } from '../calculations/types'

export function MillingTab() {
  const { t } = useTranslation()
  const [materialId, setMaterialId] = useState('42crmo4')
  const [inputs, setInputs] = useState<MillingInputs>({
    D: 63, z: 4, fz: 0.3, ap: 3, ae: 20, kappa: 90,
    kc11: 2100, mc: 0.25, vc: 180, Keng: 1.7, Pmachine: 8,
  })

  const update = (key: keyof MillingInputs, value: number) => {
    const newInputs = { ...inputs, [key]: value }
    if (key === 'ae' || key === 'D') {
      newInputs.Keng = parseFloat(calculateKeng(newInputs.ae, newInputs.D).toFixed(3))
    }
    setInputs(newInputs)
  }

  const handleMaterial = (id: string, kc11: number | null, mc: number | null) => {
    setMaterialId(id)
    if (kc11 !== null && mc !== null) {
      setInputs((prev) => ({ ...prev, kc11, mc }))
    }
  }

  const { results, steps } = useMemo(() => calculateMilling(inputs), [inputs])

  const resultItems = [
    { labelKey: 'milling.phiS', value: results.phiS, unit: '°' },
    { labelKey: 'milling.ze', value: results.ze, unit: '', decimals: 3 },
    { labelKey: 'milling.n', value: results.n, unit: t('units.rpm') },
    { labelKey: 'milling.vf', value: results.vf, unit: t('units.mmmin') },
    { labelKey: 'milling.hm', value: results.hm, unit: t('units.mm'), decimals: 4 },
    { labelKey: 'milling.hmax', value: results.hmax, unit: t('units.mm'), decimals: 4 },
    { labelKey: 'milling.b', value: results.b, unit: t('units.mm') },
    { labelKey: 'milling.kc', value: results.kc, unit: t('units.Nmm2') },
    { labelKey: 'milling.Fc', value: results.Fc, unit: t('units.N') },
    { labelKey: 'milling.Ff', value: results.Ff, unit: t('units.N') },
    { labelKey: 'milling.Fa', value: results.Fa, unit: t('units.N') },
    { labelKey: 'milling.FfMean', value: results.FfMean, unit: t('units.N') },
    { labelKey: 'milling.M', value: results.M, unit: t('units.Nm') },
    { labelKey: 'milling.P', value: results.P, unit: t('units.kW') },
    { labelKey: 'common.utilization', value: results.utilization, unit: t('units.percent'), decimals: 1 },
    { labelKey: 'milling.Q', value: results.Q, unit: t('units.cm3min') },
  ]

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">{t('milling.title')}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('common.inputs')}</h3>
          <MaterialSelect selectedId={materialId} onSelect={handleMaterial} />
          <InputField label={t('milling.D')} value={inputs.D} unit="mm" onChange={(v) => update('D', v)} step={1} />
          <InputField label={t('milling.z')} value={inputs.z} unit="" onChange={(v) => update('z', v)} step={1} min={1} />
          <InputField label={t('milling.fz')} value={inputs.fz} unit="mm" onChange={(v) => update('fz', v)} step={0.01} />
          <InputField label={t('milling.ap')} value={inputs.ap} unit="mm" onChange={(v) => update('ap', v)} step={0.5} />
          <InputField label={t('milling.ae')} value={inputs.ae} unit="mm" onChange={(v) => update('ae', v)} step={1} />
          <InputField label={t('milling.kappa')} value={inputs.kappa} unit="°" onChange={(v) => update('kappa', v)} step={1} />
          <InputField label={t('milling.kc11')} value={inputs.kc11} unit="N/mm²" onChange={(v) => update('kc11', v)} step={10} />
          <InputField label={t('milling.mc')} value={inputs.mc} unit="" onChange={(v) => update('mc', v)} step={0.01} />
          <InputField label={t('milling.vc')} value={inputs.vc} unit="m/min" onChange={(v) => update('vc', v)} step={5} />
          <div className="flex items-center">
            <div className="flex-1"><InputField label={t('milling.Keng')} value={inputs.Keng} unit="" onChange={(v) => update('Keng', v)} step={0.1} /></div>
            <KengInfo />
          </div>
          <InputField label={t('common.machinePower')} value={inputs.Pmachine} unit="kW" onChange={(v) => update('Pmachine', v)} step={0.5} />
        </div>
        <ResultsPanel results={resultItems} utilization={results.utilization} />
      </div>
      <CalculationSteps steps={steps} />
    </div>
  )
}
