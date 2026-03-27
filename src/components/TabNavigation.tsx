import { useTranslation } from 'react-i18next'

export type Tab = 'milling' | 'turning' | 'drilling'

interface TabNavigationProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const MillingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M8.157 2.176a1.5 1.5 0 00-1.147 0l-4.084 1.69A1.5 1.5 0 002 5.25v10.877a1.5 1.5 0 002.074 1.386l3.51-1.452 4.26 1.762a1.5 1.5 0 001.146 0l4.084-1.69A1.5 1.5 0 0018 14.75V3.872a1.5 1.5 0 00-2.073-1.386l-3.51 1.452-4.26-1.762zM7.58 5a.75.75 0 01.75.75v6.5a.75.75 0 01-1.5 0v-6.5A.75.75 0 017.58 5zm5.59 2.75a.75.75 0 00-1.5 0v6.5a.75.75 0 001.5 0v-6.5z" clipRule="evenodd" />
  </svg>
)

const TurningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5c0 .414.336.75.75.75h2.5a.75.75 0 000-1.5h-1.75v-1.75z" clipRule="evenodd" />
  </svg>
)

const DrillingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path d="M10 3.75a2 2 0 10-4 0 2 2 0 004 0zM17.25 4.5a.75.75 0 000-1.5h-5.5a.75.75 0 000 1.5h5.5zM5 3.75a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zM4.25 17a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zM17.25 17a.75.75 0 000-1.5h-5.5a.75.75 0 000 1.5h5.5zM9 10a.75.75 0 01-.75.75h-5.5a.75.75 0 010-1.5h5.5A.75.75 0 019 10zM17.25 10.75a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zM14 10a2 2 0 10-4 0 2 2 0 004 0zM10 16.25a2 2 0 10-4 0 2 2 0 004 0z" />
  </svg>
)

const tabIcons: Record<Tab, typeof MillingIcon> = {
  milling: MillingIcon,
  turning: TurningIcon,
  drilling: DrillingIcon,
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const { t } = useTranslation()
  const tabs: { id: Tab; label: string }[] = [
    { id: 'milling', label: t('tabs.milling') },
    { id: 'turning', label: t('tabs.turning') },
    { id: 'drilling', label: t('tabs.drilling') },
  ]

  return (
    <nav className="flex overflow-x-auto bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 px-4 sm:px-6">
      {tabs.map((tab) => {
        const Icon = tabIcons[tab.id]
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex items-center gap-2 px-4 sm:px-6 py-3 text-sm font-medium cursor-pointer transition-colors ${
              isActive
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
            }`}
          >
            <Icon />
            {tab.label}
            {isActive && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full" />
            )}
          </button>
        )
      })}
    </nav>
  )
}
