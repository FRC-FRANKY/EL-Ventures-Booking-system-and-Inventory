import { useNavigate, useLocation } from 'react-router-dom'

const customers = [
  { name: 'Sarah Johnson', visits: 15, lastVisit: '2 days ago' },
  { name: 'Michael Chen', visits: 8, lastVisit: '1 week ago' },
  { name: 'Emma Wilson', visits: 22, lastVisit: '3 days ago' },
  { name: 'James Brown', visits: 5, lastVisit: '5 days ago' },
]

export default function RecentCustomers() {
  const navigate = useNavigate()
  const location = useLocation()
  const fullName = location.state?.fullName || 'Receptionist'
  const branch = location.state?.branch || 'Mandaue City Branch'

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Recent customers</h3>
      <ul className="flex-1 space-y-4">
        {customers.map((customer) => (
          <li
            key={customer.name}
            className="flex flex-col gap-1 border-b border-slate-100 pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800"
          >
            <p className="font-medium text-slate-900 dark:text-white">{customer.name}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-0 text-sm text-slate-500 dark:text-slate-400">
              <span>{customer.visits} total visits</span>
              <span>{customer.lastVisit}</span>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => navigate('/receptionist/customers', { state: { fullName, branch } })}
        className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus:ring-offset-slate-900"
      >
        View all customers
      </button>
    </div>
  )
}
