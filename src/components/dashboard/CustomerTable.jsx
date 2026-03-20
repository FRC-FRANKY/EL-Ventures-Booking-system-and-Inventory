import { useEffect, useMemo, useState } from 'react'
import { Phone, Mail } from 'lucide-react'
import { listenToBranchCustomers } from '../../utils/firebaseHelpers'

const customers = [
  {
    id: 1,
    branch: 'Mandaue City Branch',
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
    branch: 'Mandaue City Branch',
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
    branch: 'Pusok Branch',
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
    branch: 'Pusok Branch',
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
    branch: 'Pajac Branch',
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
    branch: 'Pajac Branch',
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
    branch: 'Cebu City Branch',
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
    branch: 'Cebu City Branch',
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

export default function CustomerTable({ branch, query }) {
  const [loading, setLoading] = useState(true)
  const [readError, setReadError] = useState('')
  const [fetchedCustomers, setFetchedCustomers] = useState([])
  const [didLoad, setDidLoad] = useState(false)

  useEffect(() => {
    if (!branch) return undefined

    setLoading(true)
    setReadError('')
    setDidLoad(false)

    const unsubscribe = listenToBranchCustomers(
      branch,
      (data) => {
        setFetchedCustomers(data)
        setLoading(false)
        setDidLoad(true)
      },
      (error) => {
        console.error('Failed to load customers:', error)
        setReadError(
          error?.code === 'PERMISSION_DENIED'
            ? 'Permission denied while loading customers.'
            : 'Failed to load customers.'
        )
        setLoading(false)
        setDidLoad(true)
      }
    )

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [branch])

  function formatPhp(value) {
    if (value == null || value === '') return '—'
    if (typeof value === 'string') {
      if (value.toUpperCase().includes('PHP')) return value
      const cleaned = value.replace(/[^\d.\\-]/g, '')
      const n = Number(cleaned)
      return Number.isFinite(n) ? `PHP ${n.toFixed(2)}` : '—'
    }
    if (typeof value === 'number') return `PHP ${value.toFixed(2)}`
    return '—'
  }

  const normalizedCustomers = useMemo(() => {
    const source = didLoad ? fetchedCustomers : customers
    return (source || []).map((c) => {
      const name = c.fullName || c.name || c.customerName || c.username || 'Unknown'
      const phone = c.phone || c.contact || c.mobile || '—'
      const email = c.email || '—'
      const visits = c.visits ?? c.visitCount ?? c.visit_num ?? 0

      return {
        id: c.id,
        branch: c.branch,
        name,
        phone,
        email,
        visits,
        totalSpent: formatPhp(c.totalSpent ?? c.total ?? c.amount ?? null),
        lastVisit: c.lastVisit || c.lastLoggedIn || c.updatedAt || '—',
        preferredStylist: c.preferredStylist || c.stylist || '—',
        isVip: Boolean(c.isVip ?? c.vip),
      }
    })
  }, [didLoad, fetchedCustomers])

  const filtered = useMemo(() => {
    const term = query?.trim().toLowerCase()
    return normalizedCustomers.filter((c) => {
      if (branch && c.branch && c.branch !== branch) return false
      if (!term) return true
      const haystack = `${c.name} ${c.phone} ${c.email}`.toLowerCase()
      return haystack.includes(term)
    })
  }, [normalizedCustomers, branch, query])

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-0 shadow-card backdrop-blur-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900">
          All customers ({filtered.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Name
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Visits
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Spent
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Last Visit
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Preferred Stylist
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && !didLoad ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="px-4 py-4">
                    <div className="h-4 w-44 animate-pulse rounded bg-slate-200/80" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-36 animate-pulse rounded bg-slate-200/80" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-16 animate-pulse rounded bg-slate-200/80" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-200/80" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-28 animate-pulse rounded bg-slate-200/80" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-32 animate-pulse rounded bg-slate-200/80" />
                  </td>
                </tr>
              ))
            ) : null}

            {!loading && filtered.map((customer) => (
              <tr
                key={customer.id || `${customer.name}-${customer.phone}`}
                className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">
                      {customer.name}
                    </span>
                    {customer.isVip ? (
                      <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-fuchsia-100 text-fuchsia-800">
                        VIP
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col gap-0.5 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      {customer.email}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex min-w-[2rem] items-center justify-center rounded-full bg-slate-100 px-2 py-0.5 text-sm font-medium text-slate-700">
                    {customer.visits}
                  </span>
                </td>
                <td className="py-4 px-4 font-medium text-emerald-700">{customer.totalSpent}</td>
                <td className="py-4 px-4 text-sm text-slate-600">{customer.lastVisit}</td>
                <td className="py-4 px-4 text-sm text-slate-700">{customer.preferredStylist}</td>
              </tr>
            ))}

            {!loading && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 px-4 text-center text-sm text-slate-500"
                >
                  {readError ? readError : 'No customers match your search.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
