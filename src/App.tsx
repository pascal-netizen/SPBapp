import { useState, useCallback } from 'react'
import { Header } from './components/Header'
import { TabNavigation, type Tab } from './components/TabNavigation'
import { MillingTab } from './components/MillingTab'
import { TurningTab } from './components/TurningTab'
import { DrillingTab } from './components/DrillingTab'
import { HistoryDrawer } from './components/HistoryDrawer'
import { useHistory, type HistoryEntry } from './hooks/useHistory'
import { decodeState } from './hooks/useUrlState'

function getInitialState() {
  const decoded = decodeState(window.location.hash)
  return decoded?.tab || 'milling'
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>(getInitialState)
  const [historyOpen, setHistoryOpen] = useState(false)
  const history = useHistory()
  const [loadedEntry, setLoadedEntry] = useState<HistoryEntry | null>(null)

  const handleLoadEntry = useCallback((entry: HistoryEntry) => {
    setActiveTab(entry.tab)
    setLoadedEntry(entry)
    setTimeout(() => setLoadedEntry(null), 50)
  }, [])

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-100">
      <Header
        historyCount={history.entries.length}
        onOpenHistory={() => setHistoryOpen(true)}
      />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {activeTab === 'milling' && <MillingTab history={history} loadedEntry={loadedEntry} />}
        {activeTab === 'turning' && <TurningTab history={history} loadedEntry={loadedEntry} />}
        {activeTab === 'drilling' && <DrillingTab history={history} loadedEntry={loadedEntry} />}
      </main>
      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        entries={history.entries}
        onLoad={handleLoadEntry}
        onRemove={history.removeEntry}
        onClear={history.clearHistory}
      />
    </div>
  )
}

export default App
