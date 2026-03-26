import { useTranslation } from 'react-i18next'
import { useTheme } from '../hooks/useTheme'

type Theme = 'light' | 'dark' | 'system'

export function Header() {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()

  const themes: { value: Theme; label: string }[] = [
    { value: 'light', label: t('theme.light') },
    { value: 'dark', label: t('theme.dark') },
    { value: 'system', label: t('theme.system') },
  ]

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">{t('app.title')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('app.subtitle')}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-600">
          <button onClick={() => i18n.changeLanguage('de')} className={`px-2 py-1 text-sm ${i18n.language === 'de' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>DE</button>
          <button onClick={() => i18n.changeLanguage('en')} className={`px-2 py-1 text-sm ${i18n.language === 'en' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>EN</button>
        </div>
        <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)} className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300">
          {themes.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
        </select>
      </div>
    </header>
  )
}
