import { useState } from 'react'
import { Header } from './components/Header'
import { TabNavigation, type Tab } from './components/TabNavigation'
import { MillingTab } from './components/MillingTab'
import { TurningTab } from './components/TurningTab'
import { DrillingTab } from './components/DrillingTab'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('milling')
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-100">
      <Header />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {activeTab === 'milling' && <MillingTab />}
        {activeTab === 'turning' && <TurningTab />}
        {activeTab === 'drilling' && <DrillingTab />}
      </main>
    </div>
  )
}

export default App
