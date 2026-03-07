const transactions = [
  { id: '1', type: 'Sale', description: 'Hair Services Package', amount: 'PHP 3,450.00', time: '2 hours ago' },
  { id: '2', type: 'Expense', description: 'Product Supplies', amount: 'PHP 5,200.00', time: '4 hours ago' },
  { id: '3', type: 'Sale', description: 'Nail Services', amount: 'PHP 1,850.00', time: '1 day ago' },
  { id: '4', type: 'Expense', description: 'Utilities Payment', amount: 'PHP 3,500.00', time: '1 day ago' },
  { id: '5', type: 'Sale', description: 'Hair Treatment', amount: 'PHP 2,200.00', time: '2 days ago' },
]

export default function RecentTransactions() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h3>
      <ul className="space-y-3 flex-1">
        {transactions.map((tx) => (
          <li
            key={tx.id}
            className="flex flex-wrap items-center justify-between gap-2 py-3 border-b border-gray-100 last:border-0"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                  tx.type === 'Sale' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {tx.type}
              </span>
              <span className="text-sm text-gray-500">{tx.time}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{tx.description}</p>
              <p className="text-sm font-semibold text-gray-700">{tx.amount}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
