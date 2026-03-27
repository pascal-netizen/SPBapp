import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { InputField } from './InputField'
import { MaterialSelect } from './MaterialSelect'
import { ResultsPanel } from './ResultsPanel'
import { CalculationSteps } from './CalculationSteps'
import { ComparisonSection } from './ComparisonSection'
import { ActionBar } from './ActionBar'
import { InputGroupLabel } from './InputGroupLabel'
import { calculateTurning } from '../calculations/turning'
import { materials } from '../data/materials'
import { useUrlSync, decodeState } from '../hooks/useUrlState'
import { exportPDF, exportXLSX, shareUrl } from '../utils/export'
import type { TurningInputs } from '../calculations/types'
import type { useHistory, HistoryEntry } from '../hooks/useHistory'

const defaultInputs: TurningInputs = {
  d: 50, vc: 150, f: 0.2, ap: 2, kappaR: 90,
  kc11: 2100, mc: 0.25, eta: 0.8, Pmachine: 8, L: 100,
}

interface TurningTabProps {
  history: ReturnType<typeof useHistory>
  loadedEntry: HistoryEntry | null
}

export function TurningTab({ history, loadedEntry }: TurningTabProps) {
  const { t } = useTranslation()
  const [materialId, setMaterialId] = useState(() => {
    const decoded = decodeState(window.location.hash)
    return decoded?.tab === 'turning' && decoded.materialId ? decoded.materialId : '42crmo4'
  })
  const [inputs, setInputs] = useState<TurningInputs>(() => {
    const decoded = decodeState(window.location.hash)
    if (decoded?.tab === 'turning' && decoded.inputs) {
      return { ...defaultInputs, ...decoded.inputs }
    }
    return defaultInputs
  })

  useEffect(() => {
    if (loadedEntry?.tab === 'turning') {
      setInputs({ ...defaultInputs, ...loadedEntry.inputs })
      setMaterialId(loadedEntry.materialId)
    }
  }, [loadedEntry])

  useUrlSync('turning', materialId, inputs)

  const update = (key: keyof TurningInputs, value: number) => setInputs((prev) => ({ ...prev, [key]: value }))

  const handleMaterial = (id: string, kc11: number | null, mc: number | null) => {
    setMaterialId(id)
    if (kc11 !== null && mc !== null) setInputs((prev) => ({ ...prev, kc11, mc }))
  }

  const { results, steps } = useMemo(() => calculateTurning(inputs), [inputs])

  const [savedIst, setSavedIst] = useState<Record<string, number> | null>(null)
  const [savedSoll, setSavedSoll] = useState<Record<string, number> | null>(null)

  const comparisonValues = () => ({ n: results.n, vf: results.vf, Q: results.Q, th: results.th })

  const resultGroups = [
    {
      groupKey: 'groups.geometry',
      items: [
        { labelKey: 'turning.h', value: results.h, unit: t('units.mm') },
        { labelKey: 'turning.b', value: results.b, unit: t('units.mm') },
        { labelKey: 'turning.A', value: results.A, unit: 'mm²' },
      ],
    },
    {
      groupKey: 'groups.kinematics',
      items: [
        { labelKey: 'turning.n', value: results.n, unit: t('units.rpm'), decimals: 0 },
        { labelKey: 'turning.vf', value: results.vf, unit: t('units.mmmin'), decimals: 0 },
      ],
    },
    {
      groupKey: 'groups.forces',
      items: [
        { labelKey: 'turning.kc', value: results.kc, unit: t('units.Nmm2'), decimals: 0 },
        { labelKey: 'turning.Fc', value: results.Fc, unit: t('units.N'), decimals: 0 },
        { labelKey: 'turning.Ff', value: results.Ff, unit: t('units.N'), decimals: 0 },
        { labelKey: 'turning.Fp', value: results.Fp, unit: t('units.N'), decimals: 0 },
      ],
    },
    {
      groupKey: 'groups.power',
      items: [
        { labelKey: 'turning.Pc', value: results.Pc, unit: t('units.kW'), decimals: 1 },
        { labelKey: 'turning.P', value: results.P, unit: t('units.kW'), decimals: 1 },
        { labelKey: 'turning.M', value: results.M, unit: t('units.Nm'), decimals: 1 },
        { labelKey: 'turning.Q', value: results.Q, unit: t('units.cm3min') },
        { labelKey: 'common.utilization', value: results.utilization, unit: '%', decimals: 1 },
        { labelKey: 'turning.th', value: results.th, unit: t('units.min'), hero: true, timeFormat: true },
      ],
    },
  ]

  const exportData = () => {
    const mat = materials.find((m) => m.id === materialId)
    const materialGroup = {
      group: t('inputGroups.material'),
      items: [
        { label: t('common.material'), value: 0, unit: mat?.name ?? '', isText: true },
        { label: t('turning.kc11'), value: inputs.kc11, unit: 'N/mm²' },
        { label: t('turning.mc'), value: inputs.mc, unit: '' },
      ],
    }
    const toolGroup = {
      group: t('inputGroups.toolGeometry'),
      items: [
        { label: t('turning.d'), value: inputs.d, unit: 'mm' },
        { label: t('turning.kappaR'), value: inputs.kappaR, unit: '°' },
      ],
    }
    const techGroup = {
      group: t('inputGroups.technology'),
      items: [
        { label: t('turning.vc'), value: inputs.vc, unit: 'm/min' },
        { label: t('turning.f'), value: inputs.f, unit: 'mm/U' },
        { label: t('turning.ap'), value: inputs.ap, unit: 'mm' },
      ],
    }
    const machineGroup = {
      group: t('inputGroups.machine'),
      items: [
        { label: t('common.machinePower'), value: inputs.Pmachine, unit: 'kW' },
        { label: t('common.efficiency'), value: inputs.eta, unit: '' },
        { label: t('turning.L'), value: inputs.L, unit: 'mm' },
      ],
    }
    return [materialGroup, toolGroup, techGroup, machineGroup, ...resultGroups.map((g) => ({
      group: t(g.groupKey),
      items: g.items.map((i) => ({ label: t(i.labelKey), value: i.value, unit: i.unit, decimals: i.decimals })),
    }))]
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-surface-900 dark:text-white">{t('turning.title')}</h2>
        <ActionBar
          onSaveIst={() => { history.addEntry('turning', materialId, inputs); setSavedIst(comparisonValues()) }}
          onSaveSoll={() => { history.addEntry('turning', materialId, inputs); setSavedSoll(comparisonValues()) }}
          onExportPDF={() => exportPDF(t('turning.title'), exportData())}
          onExportXLSX={() => exportXLSX(t('turning.title'), exportData())}
          onShare={shareUrl}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-3 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M13.488 2.513a1.75 1.75 0 00-2.475 0L6.75 6.774a2.75 2.75 0 00-.596.892l-.848 2.047a.75.75 0 00.98.98l2.047-.848a2.75 2.75 0 00.892-.596l4.261-4.262a1.75 1.75 0 000-2.474z" />
              <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0114 9v2.25A2.75 2.75 0 0111.25 14h-6.5A2.75 2.75 0 012 11.25v-6.5A2.75 2.75 0 014.75 2H7a.75.75 0 010 1.5H4.75z" />
            </svg>
            {t('common.inputs')}
          </h3>
          <div className="space-y-2.5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-4">
            <InputGroupLabel label={t('inputGroups.material')} />
            <MaterialSelect selectedId={materialId} onSelect={handleMaterial} tab="turning" currentVc={inputs.vc} />
            <InputField label={t('turning.kc11')} value={inputs.kc11} unit="N/mm²" onChange={(v) => update('kc11', v)} step={10} />
            <InputField label={t('turning.mc')} value={inputs.mc} unit="" onChange={(v) => update('mc', v)} step={0.01} />
            <div className="border-t border-surface-100 dark:border-surface-800 my-2" />
            <InputGroupLabel label={t('inputGroups.toolGeometry')} />
            <InputField label={t('turning.d')} value={inputs.d} unit="mm" onChange={(v) => update('d', v)} step={1} />
            <InputField label={t('turning.kappaR')} value={inputs.kappaR} unit="°" onChange={(v) => update('kappaR', v)} step={1} />
            <div className="border-t border-surface-100 dark:border-surface-800 my-2" />
            <InputGroupLabel label={t('inputGroups.technology')} />
            <InputField label={t('turning.vc')} value={inputs.vc} unit="m/min" onChange={(v) => update('vc', v)} step={5} />
            <InputField label={t('turning.f')} value={inputs.f} unit="mm/U" onChange={(v) => update('f', v)} step={0.01} />
            <InputField label={t('turning.ap')} value={inputs.ap} unit="mm" onChange={(v) => update('ap', v)} step={0.5} />
            <div className="border-t border-surface-100 dark:border-surface-800 my-2" />
            <InputGroupLabel label={t('inputGroups.machine')} />
            <InputField label={t('common.machinePower')} value={inputs.Pmachine} unit="kW" onChange={(v) => update('Pmachine', v)} step={0.5} />
            <InputField label={t('common.efficiency')} value={inputs.eta} unit="" onChange={(v) => update('eta', v)} step={0.05} min={0.1} max={1} />
            <div className="border-t border-surface-100 dark:border-surface-800 my-2" />
            <InputGroupLabel label={t('inputGroups.path')} />
            <InputField label={t('turning.L')} value={inputs.L} unit="mm" onChange={(v) => update('L', v)} step={10} min={0} />
          </div>
        </div>
        <ResultsPanel groups={resultGroups} utilization={results.utilization} />
      </div>
      <CalculationSteps steps={steps} />
      <ComparisonSection
        params={[
          { key: 'n', labelKey: 'turning.n', unit: t('units.rpm'), decimals: 0, sollValue: results.n, neutralColor: true },
          { key: 'vf', labelKey: 'turning.vf', unit: t('units.mmmin'), decimals: 0, sollValue: results.vf },
          { key: 'Q', labelKey: 'turning.Q', unit: t('units.cm3min'), decimals: 2, sollValue: results.Q },
          { key: 'th', labelKey: 'turning.th', unit: t('units.min'), decimals: 2, sollValue: results.th, timeFormat: true, invertColor: true },
        ]}
        savedIst={savedIst}
        savedSoll={savedSoll}
      />
    </div>
  )
}
