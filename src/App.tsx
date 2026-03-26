import { useState, useCallback } from 'react'
import { Header } from './components/Header'
import { TabNavigation, type Tab } from './components/TabNavigation'
import { MillingTab } from './components/MillingTab'
import { TurningTab } from './components/TurningTab'
import { DrillingTab } from './components/DrillingTab'
import { HistoryPanel } from './components/HistoryPanel'
import { useHistory, type HistoryEntry } from './hooks/useHistory'
import { decodeState } from './hooks/useUrlState'

function getInitialState() {
  const decoded = decodeState(window.location.hash)
  return decoded?.tab || 'milling'
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>(getInitialState)
  const history = useHistory()

  // Each tab reads initial state from URL hash on mount
  const [loadedEntry, setLoadedEntry] = useState<HistoryEntry | null>(null)

  const handleLoadEntry = useCallback((entry: HistoryEntry) => {
    setActiveTab(entry.tab)
    setLoadedEntry(entry)
    // Clear after a tick so the tab can read it
    setTimeout(() => setLoadedEntry(null), 50)
  }, [])

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-100">
      <Header />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {activeTab === 'milling' && <MillingTab history={history} loadedEntry={loadedEntry} />}
        {activeTab === 'turning' && <TurningTab history={history} loadedEntry={loadedEntry} />}
        {activeTab === 'drilling' && <DrillingTab history={history} loadedEntry={loadedEntry} />}
        <HistoryPanel
          entries={history.entries}
          onLoad={handleLoadEntry}
          onRemove={history.removeEntry}
          onClear={history.clearHistory}
        />
      </main>
    </div>
  )
}

export default App
