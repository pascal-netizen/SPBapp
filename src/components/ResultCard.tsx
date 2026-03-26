interface ResultCardProps {
  label: string
  value: number
  unit: string
  decimals?: number
  warning?: boolean
}

export function ResultCard({ label, value, unit, decimals = 2, warning = false }: ResultCardProps) {
  return (
    <div
      className={`p-3.5 rounded-xl border transition-colors ${
        warning
          ? 'border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30'
          : 'border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 hover:border-surface-300 dark:hover:border-surface-700'
      }`}
    >
      <div className="text-xs font-medium text-surface-500 dark:text-surface-400 mb-1.5 truncate">{label}</div>
      <div className="flex items-baseline gap-1.5">
        <span
          className={`text-lg font-semibold font-mono tabular-nums tracking-tight ${
            warning ? 'text-red-600 dark:text-red-400' : 'text-surface-900 dark:text-white'
          }`}
        >
          {value.toFixed(decimals)}
        </span>
        <span className="text-xs text-surface-400 dark:text-surface-500 font-mono">{unit}</span>
      </div>
    </div>
  )
}
