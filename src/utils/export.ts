interface ExportResult {
  label: string
  value: number
  unit: string
  decimals?: number
}

interface ExportGroup {
  group: string
  items: ExportResult[]
}

export function exportCSV(title: string, groups: ExportGroup[]) {
  const lines = [`"${title}"`, '"Parameter","Wert","Einheit"']
  for (const group of groups) {
    lines.push(`"--- ${group.group} ---","",""`)
    for (const item of group.items) {
      lines.push(`"${item.label}","${item.value.toFixed(item.decimals ?? 2)}","${item.unit}"`)
    }
  }
  const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${title.replace(/[^a-zA-Z0-9äöüÄÖÜ]/g, '_')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function shareUrl() {
  const url = window.location.href
  if (navigator.share) {
    navigator.share({ title: 'SPBapp', url })
  } else {
    navigator.clipboard.writeText(url)
  }
}
