import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Wallet, Users } from 'lucide-react'
import ManagementShell from '../components/shell/ManagementShell'
import PanelCard from '../components/dashboard-ui/PanelCard'
import { getCutoffForPeriod, isDateInCutoff } from '../utils/payrollCutoffs'
import { useCommissionTransactions } from '../hooks/useCommissionTransactions'

function toStylistKey(name, fallbackId) {
  if (fallbackId) return String(fallbackId)
  return String(name || 'Unknown Stylist')
}

function groupByStylist(cutoff, records) {
  const inPeriod = records.filter((row) =>
    isDateInCutoff(row.dateKey, cutoff.workStartIso, cutoff.workEndIso) &&
    String(row.status || '').toLowerCase() === 'completed'
  )
  const grouped = inPeriod.reduce((acc, row) => {
    const key = toStylistKey(row.stylistName, row.stylistId)
    if (!acc[key]) {
      const base = Number(row.baseSalary || 0)
      acc[key] = {
        stylist: { id: key, name: row.stylistName || 'Unknown Stylist' },
        baseSalary: base,
        completedCount: 0,
        totalCommission: 0,
        totalPay: 0,
        details: [],
      }
    }
    acc[key].completedCount += 1
    acc[key].baseSalary = Number(row.baseSalary || acc[key].baseSalary || 0)
    acc[key].totalCommission += Number(row.commissionAmount || 0)
    acc[key].details.push({
      id: row.id,
      service: row.service,
      price: Number(row.price || 0),
      rate: Number(row.commissionRate || 0),
      amount: Number(row.commissionAmount || 0),
      dateTime: row.dateTime,
    })
    return acc
  }, {})

  const rows = Object.values(grouped).map((entry) => ({
    ...entry,
    totalPay: Number(entry.baseSalary || 0) + Number(entry.totalCommission || 0),
  }))

  rows.sort((a, b) => b.totalCommission - a.totalCommission)
  return rows
}

export default function HRManagerPayroll() {
  const location = useLocation()
  const displayName = location.state?.fullName || 'HR Manager'
  const now = new Date()
  const knownBranches = ['Mandaue City Branch', 'Pusok Branch', 'Pajac Branch', 'Cebu City Branch']
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [period, setPeriod] = useState('first')
  const [selectedBranch, setSelectedBranch] = useState('Mandaue City Branch')
  const [cutoffInitialized, setCutoffInitialized] = useState(false)
  const { loading, error, transactions } = useCommissionTransactions({ branchName: selectedBranch })

  useEffect(() => {
    if (cutoffInitialized || loading || transactions.length === 0) return
    const withDate = transactions.filter((row) => row.dateKey)
    if (withDate.length === 0) return

    const latest = withDate.reduce((acc, row) => (row.dateKey > acc.dateKey ? row : acc), withDate[0])
    const dt = new Date(latest.dateKey)
    if (Number.isNaN(dt.getTime())) return

    const day = dt.getDate()
    const resolvedPeriod = day >= 26 ? 'second' : 'first'
    setYear(dt.getFullYear())
    setMonth(dt.getMonth() + 1)
    setPeriod(resolvedPeriod)
    setCutoffInitialized(true)
  }, [transactions, loading, cutoffInitialized])

  const cutoff = useMemo(() => getCutoffForPeriod(year, month, period), [year, month, period])
  const rows = useMemo(() => groupByStylist(cutoff, transactions), [cutoff, transactions])
  const totals = useMemo(
    () => ({
      base: rows.reduce((s, r) => s + r.baseSalary, 0),
      commission: rows.reduce((s, r) => s + r.totalCommission, 0),
      gross: rows.reduce((s, r) => s + r.totalPay, 0),
    }),
    [rows]
  )

  return (
    <ManagementShell module="hr" portalSubtitle="HR Manager · Payroll" userName={displayName}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Stylist payroll</h1>
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}
        <PanelCard title="Semi-monthly schedule">
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>
              <strong>1st-15th</strong> work is paid on the <strong>20th</strong> (same month).
            </li>
            <li>
              <strong>26th-last day</strong> work is paid on the <strong>15th</strong> (next month).
            </li>
          </ul>
        </PanelCard>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <Users className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Stylists</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{rows.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <Wallet className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Total commission</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-emerald-700">
              PHP {totals.commission.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <Wallet className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Total payroll</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-fuchsia-800">
              PHP {totals.gross.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 rounded-2xl border border-slate-200/80 bg-white p-4">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            {knownBranches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            {Array.from({ length: 7 }, (_, i) => now.getFullYear() - 2 + i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2000, i, 1).toLocaleDateString('en-US', { month: 'long' })}
              </option>
            ))}
          </select>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="first">1st - 15th</option>
            <option value="second">26th - last day</option>
          </select>
          <div className="rounded-xl bg-fuchsia-50 px-3 py-2 text-xs text-slate-700">
            <p className="font-semibold">{cutoff.label}</p>
            <p>{cutoff.payLabel}</p>
          </div>
        </div>

        <PanelCard title="Payroll by stylist">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="py-3 pr-4">Stylist</th>
                  <th className="py-3 pr-4">Completed</th>
                  <th className="py-3 pr-4 text-right">Base</th>
                  <th className="py-3 pr-4 text-right">Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500">
                      Loading payroll data...
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500">
                      No booking records found for this cutoff.
                    </td>
                  </tr>
                ) : null}
                {rows.map((r) => (
                  <tr key={r.stylist.id} className="align-top">
                    <td className="py-4 pr-4 font-semibold">{r.stylist.name}</td>
                    <td className="py-4 pr-4">{r.completedCount}</td>
                    <td className="py-4 pr-4 text-right">
                      PHP {r.baseSalary.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 pr-4 text-right text-emerald-700">
                      PHP {r.totalCommission.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PanelCard>
      </div>
    </ManagementShell>
  )
}
