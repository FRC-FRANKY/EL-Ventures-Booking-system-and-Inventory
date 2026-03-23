import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { History, Search, Calendar, ChevronDown } from 'lucide-react'
import ManagementShell from '../components/shell/ManagementShell'
import { useReceptionistSwitchRole } from '../hooks/useReceptionistSwitchRole'
import { listenToBranchAppointments } from '../utils/firebaseHelpers'

function toDisplayList(value) {
  if (!value) return 'N/A'
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (Array.isArray(value)) return value.map((v) => toDisplayList(v)).join(', ')
  if (typeof value === 'object') {
    const values = Object.values(value)
      .map((item) => {
        if (typeof item === 'string' || typeof item === 'number') return String(item)
        if (item && typeof item === 'object') {
          return (
            item.name ||
            item.serviceName ||
            item.stylistName ||
            item.fullName ||
            Object.values(item).find((v) => typeof v === 'string' || typeof v === 'number') ||
            ''
          )
        }
        return ''
      })
      .filter(Boolean)
    return values.length ? values.join(', ') : 'N/A'
  }
  return 'N/A'
}

function parseAmount(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const n = Number(value.replace(/[^\d.\-]/g, ''))
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

function computeTotalFromServices(services) {
  if (!services) return 0
  if (Array.isArray(services)) {
    return services.reduce((sum, item) => {
      if (typeof item === 'object' && item) {
        return (
          sum +
          parseAmount(
            item.price ?? item.amount ?? item.total ?? item.servicePrice ?? item.unitPrice
          )
        )
      }
      return sum + parseAmount(item)
    }, 0)
  }
  if (typeof services === 'object') {
    return Object.values(services).reduce((sum, item) => sum + computeTotalFromServices(item), 0)
  }
  return parseAmount(services)
}

function formatDateTime(date, time) {
  try {
    const d = new Date(date)
    const readableDate = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    return `${readableDate} - ${time || 'N/A'}`
  } catch {
    return `${date || 'N/A'} - ${time || 'N/A'}`
  }
}

function toDateInputValue(rawDate) {
  if (!rawDate) return ''
  const iso = String(rawDate).slice(0, 10)
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso
  const d = new Date(rawDate)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

export default function ReceptionistTransactions() {
  const location = useLocation()
  const fullName = location.state?.fullName || 'Receptionist'
  const branch = location.state?.branch || 'Mandaue City Branch'
  const switchRole = useReceptionistSwitchRole()

  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('All Payment Status')

  const receptionistState = { fullName, branch }

  useEffect(() => {
    setLoading(true)
    const unsubscribe = listenToBranchAppointments(branch, (data) => {
      const mapped = data
        .filter((apt) => {
          const status = String(apt.status || '').toLowerCase()
          return status === 'completed' || apt.paymentStatus || apt.price || apt.totalAmount
        })
        .map((apt) => {
          const amountRaw =
            parseAmount(apt.totalAmount) ||
            parseAmount(apt.price) ||
            computeTotalFromServices(apt.services)
          const statusRaw = String(apt.paymentStatus || '').toLowerCase()
          const normalizedPaymentStatus =
            statusRaw === 'paid' || statusRaw === 'pending'
              ? statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1)
              : String(apt.status || '').toLowerCase() === 'completed'
                ? 'Paid'
                : 'Pending'
          return {
            id: apt.id,
            customerName: apt.customerName || 'Unknown',
            services: toDisplayList(apt.services),
            stylistName: toDisplayList(apt.stylists),
            dateTime: formatDateTime(apt.preferredDate, apt.preferredTime),
            dateInput: toDateInputValue(apt.preferredDate),
            totalAmount: amountRaw,
            paymentStatus: normalizedPaymentStatus,
            branch: apt.branchName || branch,
            createdAt: apt.createdAt || 0,
          }
        })
        .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))

      setTransactions(mapped)
      setLoading(false)
    })

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [branch])

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (search.trim()) {
        const term = search.trim().toLowerCase()
        if (!tx.customerName.toLowerCase().includes(term)) return false
      }

      if (dateFilter && tx.dateInput !== dateFilter) return false

      if (
        paymentStatus !== 'All Payment Status' &&
        tx.paymentStatus.toLowerCase() !== paymentStatus.toLowerCase()
      ) {
        return false
      }

      return true
    })
  }, [transactions, search, dateFilter, paymentStatus])

  return (
    <ManagementShell
      module="receptionist"
      portalSubtitle={`Receptionist · Transaction History · ${branch}`}
      userName={fullName}
      receptionistState={receptionistState}
      onSwitchRole={switchRole}
    >
      <section className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-card backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#C2185B]/15 via-[#EC407A]/15 to-[#F48FB1]/15">
            <History className="h-4 w-4 text-[#C2185B]" />
          </div>
          <h2 className="text-sm font-semibold text-slate-900">Transaction History</h2>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Branch-scoped records only. You can view transactions for <strong>{branch}</strong>.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-card backdrop-blur-sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-300/50"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-300/50"
            />
          </div>

          <div className="relative">
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm text-slate-900 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-300/50"
            >
              <option>All Payment Status</option>
              <option>Paid</option>
              <option>Pending</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-card backdrop-blur-sm">
        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">Loading transactions...</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">No transactions available</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Customer Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Service(s) Availed
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Stylist Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Date &amp; Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Total Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Payment Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Branch
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 text-sm text-slate-900">{tx.customerName}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{tx.services}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{tx.stylistName}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{tx.dateTime}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                      PHP {Number(tx.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          tx.paymentStatus === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {tx.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{tx.branch}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </ManagementShell>
  )
}

