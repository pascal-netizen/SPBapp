import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CalculationStep } from '../calculations/types'

interface CalculationStepsProps { steps: CalculationStep[] }

export function CalculationSteps({ steps }: CalculationStepsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()
  return (
    <div className="mt-6 border border-surface-200 dark:border-surface-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800/50 cursor-pointer transition-colors"
      >
        <span className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-surface-400">
            <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zm4.03 6.28a.75.75 0 00-1.06-1.06L4.97 9.47a.75.75 0 000 1.06l2.25 2.25a.75.75 0 001.06-1.06L6.56 10l1.72-1.72zm2.38-1.06a.75.75 0 10-1.06 1.06L11.44 10l-1.72 1.72a.75.75 0 101.06 1.06l2.25-2.25a.75.75 0 000-1.06l-2.25-2.25z" clipRule="evenodd" />
          </svg>
          {t('common.steps')}
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
        <div className="px-5 pb-5 space-y-2 border-t border-surface-100 dark:border-surface-800">
          <div className="pt-3" />
          {steps.map((step, i) => (
            <div key={step.name} className="p-3.5 bg-surface-50 dark:bg-surface-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs font-semibold">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-surface-800 dark:text-surface-200">{step.name}</span>
              </div>
              <div className="ml-7 space-y-0.5 overflow-x-auto">
                <div className="text-xs text-surface-500 dark:text-surface-400 font-mono break-all">{t('common.formula')}: {step.formula}</div>
                <div className="text-xs text-surface-500 dark:text-surface-400 font-mono break-all">{t('common.values')}: {step.substituted}</div>
                <div className="text-xs text-primary-600 dark:text-primary-400 font-mono font-semibold">= {step.result}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
