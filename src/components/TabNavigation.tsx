import { useTranslation } from 'react-i18next'

export type Tab = 'milling' | 'turning' | 'drilling'

interface TabNavigationProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const { t } = useTranslation()
  const tabs: { id: Tab; label: string }[] = [
    { id: 'milling', label: t('tabs.milling') },
    { id: 'turning', label: t('tabs.turning') },
    { id: 'drilling', label: t('tabs.drilling') },
  ]

  return (
    <nav className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {tabs.map((tab) => (
        <button key={tab.id} onClick={() => onTabChange(tab.id)} className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}>
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
