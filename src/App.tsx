import { useState } from 'react'
import { Header } from './components/Header'
import { TabNavigation, type Tab } from './components/TabNavigation'
import { MillingTab } from './components/MillingTab'
import { TurningTab } from './components/TurningTab'
import { DrillingTab } from './components/DrillingTab'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('milling')
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-6xl mx-auto">
        {activeTab === 'milling' && <MillingTab />}
        {activeTab === 'turning' && <TurningTab />}
        {activeTab === 'drilling' && <DrillingTab />}
      </main>
    </div>
  )
}

export default App
