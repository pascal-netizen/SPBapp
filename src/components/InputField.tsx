import { useState, useEffect, useRef, type ReactNode } from 'react'

interface InputFieldProps {
  label: string
  value: number
  unit: string
  onChange: (value: number) => void
  step?: number
  min?: number
  max?: number
  action?: ReactNode
}

function formatDisplay(v: number): string {
  return v.toLocaleString('de-DE', { maximumFractionDigits: 10 })
}

function parseInput(s: string): number {
  // Accept both comma and dot as decimal separator
  const normalized = s.replace(/\./g, '').replace(',', '.')
  return parseFloat(normalized) || 0
}

export function InputField({ label, value, unit, onChange, step = 1, min, max, action }: InputFieldProps) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!editing) setText(formatDisplay(value))
  }, [value, editing])

  const handleFocus = () => {
    setEditing(true)
    setText(String(value).replace('.', ','))
  }

  const handleBlur = () => {
    setEditing(false)
    let parsed = parseInput(text)
    if (min !== undefined) parsed = Math.max(min, parsed)
    if (max !== undefined) parsed = Math.min(max, parsed)
    onChange(parsed)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur()
      return
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const current = parseInput(text)
      const delta = e.key === 'ArrowUp' ? step : -step
      let next = parseFloat((current + delta).toFixed(10))
      if (min !== undefined) next = Math.max(min, next)
      if (max !== undefined) next = Math.min(max, next)
      onChange(next)
      setText(String(next).replace('.', ','))
    }
  }

  return (
    <div className="flex items-center gap-3 group">
      <label className="w-48 shrink-0 text-sm text-surface-600 dark:text-surface-400 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors">
        {label}
      </label>
      <div className="flex-1 flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={text}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 px-3 py-2 text-sm text-right font-mono border border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 dark:focus:border-primary-400 placeholder:text-surface-400"
        />
        {action ? (
          <span className="w-14 shrink-0 flex justify-center">{action}</span>
        ) : (
          <span className="w-14 text-xs text-surface-400 dark:text-surface-500 font-mono shrink-0">{unit}</span>
        )}
      </div>
    </div>
  )
}
