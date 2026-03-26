import { useEffect } from 'react'
import type { Tab } from '../components/TabNavigation'

export function encodeState(tab: Tab, materialId: string, inputs: object): string {
  const params = new URLSearchParams()
  params.set('tab', tab)
  params.set('mat', materialId)
  for (const [k, v] of Object.entries(inputs as Record<string, number>)) {
    params.set(k, String(v))
  }
  return params.toString()
}

export function decodeState(hash: string): { tab?: Tab; materialId?: string; inputs?: Record<string, number> } | null {
  if (!hash || hash.length < 2) return null
  try {
    const params = new URLSearchParams(hash.slice(1))
    const tab = params.get('tab') as Tab | null
    const materialId = params.get('mat')
    const inputs: Record<string, number> = {}
    params.forEach((v, k) => {
      if (k !== 'tab' && k !== 'mat') {
        const n = parseFloat(v)
        if (!isNaN(n)) inputs[k] = n
      }
    })
    return { tab: tab || undefined, materialId: materialId || undefined, inputs: Object.keys(inputs).length > 0 ? inputs : undefined }
  } catch {
    return null
  }
}

export function useUrlSync(tab: Tab, materialId: string, inputs: object) {
  useEffect(() => {
    const hash = '#' + encodeState(tab, materialId, inputs)
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', hash)
    }
  }, [tab, materialId, inputs])
}
