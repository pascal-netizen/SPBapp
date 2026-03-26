interface ResultCardProps {
  label: string
  value: number
  unit: string
  decimals?: number
  warning?: boolean
}

export function ResultCard({ label, value, unit, decimals = 2, warning = false }: ResultCardProps) {
  return (
    <div className={`p-3 rounded-lg border ${warning ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</div>
      <div className={`text-lg font-semibold ${warning ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
        {value.toFixed(decimals)} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{unit}</span>
      </div>
    </div>
  )
}
