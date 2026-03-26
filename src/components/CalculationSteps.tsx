import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CalculationStep } from '../calculations/types'

interface CalculationStepsProps { steps: CalculationStep[] }

export function CalculationSteps({ steps }: CalculationStepsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()
  return (
    <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
        <span>{t('common.steps')}</span>
        <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm">
              <div className="font-medium text-gray-800 dark:text-gray-200">{i + 1}. {step.name}</div>
              <div className="mt-1 text-gray-500 dark:text-gray-400 font-mono text-xs">{t('common.formula')}: {step.formula}</div>
              <div className="text-gray-600 dark:text-gray-400 font-mono text-xs">{t('common.values')}: {step.substituted}</div>
              <div className="text-blue-600 dark:text-blue-400 font-mono text-xs font-semibold">= {step.result}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
