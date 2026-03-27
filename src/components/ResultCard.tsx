import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ResultCardProps {
  label: string
  value: number
  unit: string
  decimals?: number
  warning?: boolean
  hero?: boolean
}

function fmt(value: number, decimals: number): string {
  return value.toLocaleString('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
    // Fallback for non-secure contexts
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}

export function ResultCard({ label, value, unit, decimals = 2, warning = false, hero = false }: ResultCardProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const display = fmt(value, decimals)

  const copy = async () => {
    const ok = await copyToClipboard(display)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    }
  }

  return (
    <div
      onClick={copy}
      title={`${display} ${unit}`}
      className={`p-3.5 rounded-xl border cursor-pointer group relative ${
        hero
          ? 'col-span-1 sm:col-span-2 border-accent-500/40 dark:border-accent-500/30 bg-gradient-to-r from-accent-500/5 to-accent-400/5 dark:from-accent-500/10 dark:to-accent-400/5 hover:border-accent-500/60 dark:hover:border-accent-500/50'
          : warning
            ? 'border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30'
            : 'border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 hover:border-primary-300 dark:hover:border-primary-700'
      }`}
    >
      <div className={`text-xs font-medium mb-1.5 truncate ${hero ? 'text-accent-600 dark:text-accent-400' : 'text-surface-500 dark:text-surface-400'}`}>{label}</div>
      <div className="flex items-baseline gap-1.5">
        <span
          className={`font-semibold font-mono tabular-nums tracking-tight ${
            hero ? 'text-xl text-accent-600 dark:text-accent-400' : 'text-lg'
          } ${
            !hero && (warning ? 'text-red-600 dark:text-red-400' : 'text-surface-900 dark:text-white')
          }`}
        >
          {display}
        </span>
        <span className={`text-xs font-mono ${hero ? 'text-accent-500/70 dark:text-accent-400/70' : 'text-surface-400 dark:text-surface-400'}`}>{unit}</span>
      </div>
      {copied && (
        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 text-[10px] font-medium bg-primary-600 text-white rounded-md">
          {t('common.copied')}
        </div>
      )}
      {!copied && (
        <div className="absolute top-1.5 right-1.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-surface-400">
            <path d="M5.5 3.5A1.5 1.5 0 017 2h2.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 01.439 1.061V9.5A1.5 1.5 0 0112 11V8.621a3 3 0 00-.879-2.121L9 4.379A3 3 0 006.879 3.5H5.5z" />
            <path d="M4 5a1.5 1.5 0 00-1.5 1.5v6A1.5 1.5 0 004 14h5a1.5 1.5 0 001.5-1.5V8.621a1.5 1.5 0 00-.44-1.06L7.94 5.439A1.5 1.5 0 006.878 5H4z" />
          </svg>
        </div>
      )}
    </div>
  )
}
