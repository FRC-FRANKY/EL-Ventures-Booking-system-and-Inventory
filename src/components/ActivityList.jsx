const activities = [
  { id: 1, time: '2 min ago', text: 'New appointment booked - Sarah Johnson' },
  { id: 2, time: '15 min ago', text: 'Sale completed - PHP 3,450.00' },
  { id: 3, time: '32 min ago', text: 'Expense added - Utilities' },
  { id: 4, time: '1 hour ago', text: 'New customer registered - Mike Chen' },
  { id: 5, time: '2 hours ago', text: 'Inventory updated - Hair Products' },
]

export default function ActivityList() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 h-full">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
      <ul className="space-y-3">
        {activities.map((item) => (
          <li
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 py-2 border-b border-gray-100 last:border-0 text-sm"
          >
            <span className="text-gray-500 font-medium shrink-0">{item.time}</span>
            <span className="text-gray-700">— {item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
