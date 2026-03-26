interface ExportResult {
  label: string
  value: number
  unit: string
  decimals?: number
  isText?: boolean
}

interface ExportGroup {
  group: string
  items: ExportResult[]
}

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9äöüÄÖÜß\-_ ]/g, '_').trim()
}

function formatValue(item: ExportResult): string {
  if (item.isText) return item.unit
  return `${item.value.toFixed(item.decimals ?? 2)} ${item.unit}`.trim()
}

function formatCellValue(item: ExportResult): string | number {
  if (item.isText) return item.unit
  return Number(item.value.toFixed(item.decimals ?? 2))
}

function formatCellUnit(item: ExportResult): string {
  if (item.isText) return ''
  return item.unit
}

export async function exportPDF(title: string, groups: ExportGroup[]) {
  const { default: jsPDF } = await import('jspdf')
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 20

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(title, 14, y)
  y += 4

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(130)
  doc.text(`SPBapp — ${new Date().toLocaleString()}`, 14, y + 5)
  doc.setTextColor(0)
  y += 12

  doc.setDrawColor(220)
  doc.line(14, y, pageWidth - 14, y)
  y += 8

  for (const group of groups) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(80)
    doc.text(group.group.toUpperCase(), 14, y)
    doc.setTextColor(0)
    y += 6

    doc.setFontSize(10)

    for (const item of group.items) {
      doc.setFont('helvetica', 'normal')
      doc.text(item.label, 18, y)
      doc.setFont('helvetica', 'bold')
      doc.text(formatValue(item), pageWidth - 14, y, { align: 'right' })
      y += 5.5

      if (y > 275) {
        doc.addPage()
        y = 20
      }
    }

    y += 4
  }

  doc.save(`${sanitizeFilename(title)}.pdf`)
}

export async function exportXLSX(title: string, groups: ExportGroup[]) {
  const XLSX = await import('xlsx')
  const rows: (string | number)[][] = []

  for (const group of groups) {
    rows.push([group.group, '', ''])
    for (const item of group.items) {
      rows.push([item.label, formatCellValue(item), formatCellUnit(item)])
    }
    rows.push(['', '', ''])
  }

  const ws = XLSX.utils.aoa_to_sheet([['Parameter', 'Wert', 'Einheit'], ...rows])
  ws['!cols'] = [{ wch: 35 }, { wch: 20 }, { wch: 12 }]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, title.slice(0, 31))
  XLSX.writeFile(wb, `${sanitizeFilename(title)}.xlsx`)
}

export function shareUrl() {
  const url = window.location.href
  if (navigator.share) {
    navigator.share({ title: 'SPBapp', url })
  } else {
    navigator.clipboard.writeText(url)
  }
}
