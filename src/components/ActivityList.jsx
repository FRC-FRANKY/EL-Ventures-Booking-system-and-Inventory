const fallback = [
  { id: 1, time: '—', text: 'Connect Firebase to see live booking activity.' },
]

export default function ActivityList({ items }) {
  const activities = Array.isArray(items) && items.length ? items : fallback
  const empty = Array.isArray(items) && items.length === 0

  return (
    <div className="h-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Recent activity</h3>
      {empty ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">No recent appointments in the system yet.</p>
      ) : (
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
      )}
    </div>
  )
}
