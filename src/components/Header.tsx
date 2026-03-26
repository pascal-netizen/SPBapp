import { useTranslation } from 'react-i18next'
import { useTheme } from '../hooks/useTheme'

type Theme = 'light' | 'dark' | 'system'

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zm0 13a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zm5-5a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 0115 10zM2 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 012 10zm11.657-5.657a.75.75 0 010 1.06l-1.06 1.061a.75.75 0 11-1.061-1.06l1.06-1.061a.75.75 0 011.061 0zm-9.193 9.193a.75.75 0 010 1.06l-1.06 1.061a.75.75 0 01-1.061-1.06l1.06-1.061a.75.75 0 011.061 0zM16.657 15.657a.75.75 0 01-1.06 0l-1.061-1.06a.75.75 0 111.06-1.061l1.061 1.06a.75.75 0 010 1.061zM6.464 6.464a.75.75 0 01-1.06 0l-1.061-1.06a.75.75 0 011.06-1.061l1.061 1.06a.75.75 0 010 1.061zM10 6.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
  </svg>
)

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z" clipRule="evenodd" />
  </svg>
)

const MonitorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v8.5A2.25 2.25 0 0115.75 15h-3.105a3.501 3.501 0 001.1 1.677A.75.75 0 0113.26 18H6.74a.75.75 0 01-.484-1.323A3.501 3.501 0 007.355 15H4.25A2.25 2.25 0 012 12.75v-8.5zm16 8.5V4.25a.75.75 0 00-.75-.75H4.25a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h11.5a.75.75 0 00.75-.75z" clipRule="evenodd" />
  </svg>
)

const themeIcons: Record<Theme, typeof SunIcon> = {
  light: SunIcon,
  dark: MoonIcon,
  system: MonitorIcon,
}

const themeOrder: Theme[] = ['light', 'dark', 'system']

export function Header() {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    const idx = themeOrder.indexOf(theme)
    setTheme(themeOrder[(idx + 1) % themeOrder.length])
  }

  const ThemeIcon = themeIcons[theme]

  return (
    <header className="bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-800 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-5 h-5">
            <path fillRule="evenodd" d="M15.988 3.012A2.25 2.25 0 0118 5.25v6.5A2.25 2.25 0 0115.75 14H13.5V7A2.5 2.5 0 0011 4.5H8.128a2.252 2.252 0 011.884-1.488A2.25 2.25 0 0112.25 1h1.5a2.25 2.25 0 012.238 2.012zM11.5 3.25a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v.25h-3v-.25z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M2 7a1 1 0 011-1h8a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V7zm2 3.25a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zm0 3.5a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-surface-900 dark:text-white">{t('app.title')}</h1>
          <p className="text-xs text-surface-500 dark:text-surface-400 hidden sm:block">{t('app.subtitle')}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex rounded-lg overflow-hidden border border-surface-200 dark:border-surface-700">
          {(['de', 'en'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => i18n.changeLanguage(lang)}
              className={`px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                i18n.language === lang
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-700'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          onClick={cycleTheme}
          title={t(`theme.${theme}`)}
          className="p-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-700 cursor-pointer transition-colors"
        >
          <ThemeIcon />
        </button>
      </div>
    </header>
  )
}
