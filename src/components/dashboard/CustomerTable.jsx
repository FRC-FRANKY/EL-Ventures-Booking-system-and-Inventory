import { useMemo } from 'react'
import { Phone, Mail } from 'lucide-react'

const customers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    isVip: false,
    phone: '(555) 123-4567',
    email: 'sarah.j@email.com',
    visits: 12,
    totalSpent: 'PHP 1,450.00',
    lastVisit: '3/6/2026',
    preferredStylist: 'Jennifer Lee',
  },
  {
    id: 2,
    name: 'Michael Chen',
    isVip: false,
    phone: '(555) 234-5678',
    email: 'mchen@email.com',
    visits: 8,
    totalSpent: 'PHP 360.00',
    lastVisit: '3/6/2026',
    preferredStylist: 'Marcus Brown',
  },
  {
    id: 3,
    name: 'Emily Davis',
    isVip: true,
    phone: '(555) 345-6789',
    email: 'emily.davis@email.com',
    visits: 15,
    totalSpent: 'PHP 2,100.00',
    lastVisit: '3/6/2026',
    preferredStylist: 'Jennifer Lee',
  },
  {
    id: 4,
    name: 'David Wilson',
    isVip: false,
    phone: '(555) 456-7890',
    email: 'dwilson@email.com',
    visits: 6,
    totalSpent: 'PHP 390.00',
    lastVisit: '3/5/2026',
    preferredStylist: 'Marcus Brown',
  },
  {
    id: 5,
    name: 'Sophie Brown',
    isVip: true,
    phone: '(555) 789-0123',
    email: 'sophie.b@email.com',
    visits: 18,
    totalSpent: 'PHP 3,200.00',
    lastVisit: '3/6/2026',
    preferredStylist: 'Jennifer Lee',
  },
  {
    id: 6,
    name: 'James Martinez',
    isVip: false,
    phone: '(555) 567-8901',
    email: 'jmartinez@email.com',
    visits: 4,
    totalSpent: 'PHP 280.00',
    lastVisit: '3/4/2026',
    preferredStylist: 'Ana Reyes',
  },
  {
    id: 7,
    name: 'Lisa Thompson',
    isVip: false,
    phone: '(555) 678-9012',
    email: 'lisa.t@email.com',
    visits: 9,
    totalSpent: 'PHP 720.00',
    lastVisit: '3/5/2026',
    preferredStylist: 'Marcus Brown',
  },
  {
    id: 8,
    name: 'Robert Taylor',
    isVip: false,
    phone: '(555) 890-1234',
    email: 'rtaylor@email.com',
    visits: 5,
    totalSpent: 'PHP 390.00',
    lastVisit: '3/3/2026',
    preferredStylist: 'Maria Santos',
  },
]

export default function CustomerTable({ query }) {
  const filtered = useMemo(() => {
    const term = query?.trim().toLowerCase()
    if (!term) return customers
    return customers.filter((c) => {
      const haystack = `${c.name} ${c.phone} ${c.email}`.toLowerCase()
      return haystack.includes(term)
    })
  }, [query])

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">All Customers (8)</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Visits
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Spent
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Last Visit
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Preferred Stylist
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer) => (
              <tr
                key={customer.id}
                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {customer.name}
                    </span>
                    {customer.isVip && (
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                        Regular Customer
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col gap-0.5 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      {customer.email}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                    {customer.visits}
                  </span>
                </td>
                <td className="py-4 px-4 font-medium text-green-600">
                  {customer.totalSpent}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {customer.lastVisit}
                </td>
                <td className="py-4 px-4 text-sm text-gray-700">
                  {customer.preferredStylist}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-6 px-4 text-center text-sm text-gray-500"
                >
                  No customers match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
