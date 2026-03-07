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
  const fullName = location.state?.fullName || 'Frank Oliver Bentoy'

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Customers</h3>
      <ul className="space-y-4 flex-1">
        {customers.map((customer) => (
          <li
            key={customer.name}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
          >
            <p className="font-medium text-gray-900">{customer.name}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-0 text-sm text-gray-500">
              <span>{customer.visits} total visits</span>
              <span>{customer.lastVisit}</span>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => navigate('/receptionist/customers', { state: { fullName } })}
        className="mt-4 w-full py-2.5 rounded-lg bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        View All Customers
      </button>
    </div>
  )
}
