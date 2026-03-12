const rows = [
  { label: 'Cash', value: 'PHP 6,965.00' },
  { label: 'GCash', value: 'PHP 13,530.00' },
  { label: 'Gift Certificate', value: 'PHP 500.00' },
]

const valueBgClasses = ['bg-blue-50', 'bg-purple-50', 'bg-pink-50']

export default function PaymentBreakdown() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
          <span className="text-sm font-semibold text-purple-700">₱</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900">Payment Breakdown</h3>
      </div>
      <ul className="space-y-2">
        {rows.map((row, i) => (
          <li
            key={row.label}
            className={`flex justify-between items-center text-sm py-2 px-3 rounded ${valueBgClasses[i % valueBgClasses.length]}`}
          >
            <span className="text-gray-700">{row.label}:</span>
            <span className="font-semibold text-gray-900">{row.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
