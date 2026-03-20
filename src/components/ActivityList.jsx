const activities = [
  { id: 1, time: '2 min ago', text: 'New appointment booked - Sarah Johnson' },
  { id: 2, time: '15 min ago', text: 'Sale completed - PHP 3,450.00' },
  { id: 3, time: '32 min ago', text: 'Expense added - Utilities' },
  { id: 4, time: '1 hour ago', text: 'New customer registered - Mike Chen' },
  { id: 5, time: '2 hours ago', text: 'Inventory updated - Hair Products' },
]

export default function ActivityList() {
  return (
    <div className="h-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Recent activity</h3>
      <ul className="space-y-1">
        {activities.map((item) => (
          <li
            key={item.id}
            className="flex flex-col gap-0.5 border-b border-slate-100 py-3 text-sm last:border-0 dark:border-slate-800 sm:flex-row sm:items-center sm:gap-2"
          >
            <span className="shrink-0 text-xs font-medium text-slate-500 dark:text-slate-400">
              {item.time}
            </span>
            <span className="text-slate-700 dark:text-slate-200">— {item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
