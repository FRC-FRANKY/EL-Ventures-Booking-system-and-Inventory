import { ShoppingBag } from 'lucide-react'

const rows = [
  { label: 'Sessions Sold', value: '0 - PHP 0.00', highlight: false },
  { label: 'Sessions', value: '0 (PHP 0.00)', highlight: false },
  { label: 'GC', value: '1 - PHP 0.00', highlight: false },
  { label: 'Services', value: '27 - PHP 21,375.00', highlight: true },
  { label: 'Products', value: '0 - PHP 0.00', highlight: false },
  { label: 'Combi', value: '0 - PHP 0.00', highlight: false },
]

export default function TransactionBreakdown() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Transaction Breakdown</h3>
      </div>
      <ul className="space-y-2">
        {rows.map((row) => (
          <li
            key={row.label}
            className={`flex justify-between items-center text-sm py-1.5 px-2 rounded ${
              row.highlight ? 'bg-green-50 text-gray-800' : 'text-gray-700'
            }`}
          >
            <span>{row.label}:</span>
            <span className={row.highlight ? 'font-semibold' : ''}>{row.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
