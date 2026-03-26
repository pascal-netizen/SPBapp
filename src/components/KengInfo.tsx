import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const kengData = [
  { key: 'slotting', range: '2.0 – 2.5' },
  { key: 'fifty', range: '1.7 – 2.0' },
  { key: 'thirty', range: '1.4 – 1.7' },
  { key: 'face', range: '1.2 – 1.5' },
  { key: 'highFeed', range: '1.1 – 1.3' },
]

export function KengInfo() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()
  return (
    <div className="relative inline-block">
      <button onClick={() => setIsOpen(!isOpen)} className="text-blue-500 hover:text-blue-700 text-xs ml-1" title={t('kengTable.title')}>ⓘ</button>
      {isOpen && (
        <div className="absolute z-10 mt-1 right-0 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <div className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">{t('kengTable.title')}</div>
          <table className="w-full text-xs">
            <tbody>
              {kengData.map((row) => (
                <tr key={row.key} className="border-t border-gray-100 dark:border-gray-700">
                  <td className="py-1 text-gray-600 dark:text-gray-400">{t(`kengTable.${row.key}`)}</td>
                  <td className="py-1 text-right font-mono text-gray-800 dark:text-gray-200">{row.range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
