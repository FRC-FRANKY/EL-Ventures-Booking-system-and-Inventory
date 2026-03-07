import { TrendingUp } from 'lucide-react'

const rows = [
  { label: 'Sales', value: 'PHP 21,375.00', bgClass: 'bg-green-50' },
  { label: 'Disc', value: '1 - PHP 1,180.00', bgClass: 'bg-orange-50' },
  { label: 'Expenses', value: 'PHP 1,170.00', bgClass: 'bg-red-50' },
  { label: 'Net', value: 'PHP 19,025.00', bgClass: 'bg-purple-50' },
  { label: 'Payments', value: 'PHP 20,495.00', bgClass: 'bg-blue-50' },
]

export default function FinancialSummary() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Financial Summary</h3>
      </div>
      <ul className="space-y-2">
        {rows.map((row) => (
          <li
            key={row.label}
            className={`flex justify-between items-center text-sm py-2 px-3 rounded ${row.bgClass}`}
          >
            <span className="text-gray-700">{row.label}:</span>
            <span className="font-semibold text-gray-900">{row.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
