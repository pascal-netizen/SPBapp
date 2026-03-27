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

function parseInput(s: string): number | null {
  const trimmed = s.trim()
  if (trimmed === '' || trimmed === '-') return null

  let normalized: string
  const hasComma = trimmed.includes(',')
  const hasDot = trimmed.includes('.')

  if (hasComma && hasDot) {
    // German format with thousands separator: 1.234,56
    normalized = trimmed.replace(/\./g, '').replace(',', '.')
  } else if (hasComma) {
    // Comma as decimal separator: 0,3
    normalized = trimmed.replace(',', '.')
  } else {
    // English format or integer: 0.3 or 100
    normalized = trimmed
  }

  const result = parseFloat(normalized)
  return isFinite(result) ? result : null
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
    const parsed = parseInput(text)
    if (parsed === null) return // keep previous valid value
    let clamped = parsed
    if (min !== undefined) clamped = Math.max(min, clamped)
    if (max !== undefined) clamped = Math.min(max, clamped)
    onChange(clamped)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur()
      return
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const current = parseInput(text) ?? value
      const delta = e.key === 'ArrowUp' ? step : -step
      let next = parseFloat((current + delta).toFixed(10))
      if (min !== undefined) next = Math.max(min, next)
      if (max !== undefined) next = Math.min(max, next)
      onChange(next)
      setText(String(next).replace('.', ','))
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 group">
      <label className="sm:w-48 sm:shrink-0 text-sm text-surface-600 dark:text-surface-400 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors">
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
          <span className="w-14 text-xs text-surface-400 dark:text-surface-400 font-mono shrink-0">{unit}</span>
        )}
      </div>
    </div>
  )
}
