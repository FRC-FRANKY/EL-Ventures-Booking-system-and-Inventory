import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { listenToBranchCustomers } from '../../utils/firebaseHelpers'

function formatRelative(isoOrStr) {
  if (isoOrStr == null || isoOrStr === '') return '—'
  const d = new Date(isoOrStr)
  if (Number.isNaN(d.getTime())) return String(isoOrStr)
  const diff = Date.now() - d.getTime()
  const days = Math.floor(diff / 86400000)
  if (days < 0) return 'Upcoming'
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} wk ago`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function parseVisitDate(c) {
  const raw = c.lastVisit ?? c.lastVisitAt ?? c.updatedAt ?? c.createdAt
  if (raw == null) return 0
  const t = typeof raw === 'number' ? raw : new Date(raw).getTime()
  return Number.isFinite(t) ? t : 0
}

export default function RecentCustomers({ branch }) {
  const navigate = useNavigate()
  const location = useLocation()
  const fullName = location.state?.fullName || 'Receptionist'
  const [customers, setCustomers] = useState([])

  useEffect(() => {
    if (!branch) {
      setCustomers([])
      return undefined
    }
    return listenToBranchCustomers(branch, setCustomers)
  }, [branch])

  const recent = useMemo(() => {
    const sorted = [...customers].sort((a, b) => parseVisitDate(b) - parseVisitDate(a))
    return sorted.slice(0, 6).map((c) => ({
      key: c.id || c.name,
      name: c.name || c.customerName || 'Customer',
      visits: c.visits ?? c.visitCount ?? c.totalVisits ?? '—',
      lastVisit: formatRelative(c.lastVisit ?? c.lastVisitAt ?? c.updatedAt ?? c.createdAt),
    }))
  }, [customers])

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Recent customers</h3>
      <ul className="flex-1 space-y-4">
        {recent.length === 0 ? (
          <li className="text-sm text-slate-500 dark:text-slate-400">
            No customers for this branch yet — they will appear here from your CRM.
          </li>
        ) : (
          recent.map((customer) => (
            <li
              key={customer.key}
              className="flex flex-col gap-1 border-b border-slate-100 pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800"
            >
              <p className="font-medium text-slate-900 dark:text-white">{customer.name}</p>
              <div className="flex flex-wrap gap-x-3 gap-y-0 text-sm text-slate-500 dark:text-slate-400">
                <span>{typeof customer.visits === 'number' ? `${customer.visits} total visits` : customer.visits}</span>
                <span>{customer.lastVisit}</span>
              </div>
            </li>
          ))
        )}
      </ul>
      <button
        type="button"
        onClick={() => navigate('/receptionist/customers', { state: { fullName, branch } })}
        className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#C2185B] focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus:ring-offset-slate-900"
      >
        View all customers
      </button>
    </div>
  )
}
