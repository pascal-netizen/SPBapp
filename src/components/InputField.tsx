interface InputFieldProps {
  label: string
  value: number
  unit: string
  onChange: (value: number) => void
  step?: number
  min?: number
  max?: number
}

export function InputField({ label, value, unit, onChange, step = 1, min, max }: InputFieldProps) {
  return (
    <div className="flex items-center gap-3 group">
      <label className="w-48 shrink-0 text-sm text-surface-600 dark:text-surface-400 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors">
        {label}
      </label>
      <div className="flex-1 flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step={step}
          min={min}
          max={max}
          className="flex-1 min-w-0 px-3 py-2 text-sm text-right font-mono border border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 dark:focus:border-primary-400 placeholder:text-surface-400"
        />
        <span className="w-14 text-xs text-surface-400 dark:text-surface-500 font-mono shrink-0">{unit}</span>
      </div>
    </div>
  )
}
