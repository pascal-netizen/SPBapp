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
    <div className="flex items-center gap-2">
      <label className="flex-1 text-sm text-gray-700 dark:text-gray-300">{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} step={step} min={min} max={max} className="w-24 px-2 py-1 text-sm text-right border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
      <span className="w-14 text-sm text-gray-500 dark:text-gray-400">{unit}</span>
    </div>
  )
}
