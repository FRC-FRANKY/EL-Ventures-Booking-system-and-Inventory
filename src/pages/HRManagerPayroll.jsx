import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Wallet, Users } from 'lucide-react'
import ManagementShell from '../components/shell/ManagementShell'
import PanelCard from '../components/dashboard-ui/PanelCard'
import {
  STYLISTS,
  COMPLETED_SERVICES_LOG,
  commissionForService,
} from '../data/hrPayrollData'
import { getCutoffForPeriod, isDateInCutoff } from '../utils/payrollCutoffs'

function buildStylistPayroll(cutoff, stylist) {
  const inPeriod = COMPLETED_SERVICES_LOG.filter(
    (row) =>
      row.stylistId === stylist.id &&
      isDateInCutoff(row.serviceDate, cutoff.workStartIso, cutoff.workEndIso)
  )

  const byService = {}
  let totalCommission = 0
  for (const row of inPeriod) {
    const amt = commissionForService(row.serviceName)
    totalCommission += amt
    if (!byService[row.serviceName]) {
      byService[row.serviceName] = { count: 0, commissionEach: amt, subtotal: 0 }
    }
    byService[row.serviceName].count += 1
    byService[row.serviceName].subtotal += amt
  }

  const base = stylist.baseSalaryPerCutoff
  const totalPay = base + totalCommission

  return {
    stylist,
    baseSalary: base,
    completedCount: inPeriod.length,
    totalCommission,
    totalPay,
    lines: Object.entries(byService).map(([serviceName, v]) => ({ serviceName, ...v })),
  }
}

export default function HRManagerPayroll() {
  const location = useLocation()
  const displayName = location.state?.fullName || 'HR Manager'
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [period, setPeriod] = useState('first')

  const cutoff = useMemo(() => getCutoffForPeriod(year, month, period), [year, month, period])
  const rows = useMemo(() => STYLISTS.map((s) => buildStylistPayroll(cutoff, s)), [cutoff])
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
            <p className="mt-2 text-2xl font-bold text-slate-900">{STYLISTS.length}</p>
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
                  <th className="py-3 pr-4">Commission detail</th>
                  <th className="py-3 pr-4 text-right">Base</th>
                  <th className="py-3 pr-4 text-right">Commission</th>
                  <th className="py-3 text-right">Total pay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.stylist.id} className="align-top">
                    <td className="py-4 pr-4 font-semibold">{r.stylist.name}</td>
                    <td className="py-4 pr-4">{r.completedCount}</td>
                    <td className="py-4 pr-4">
                      {r.lines.length === 0 ? (
                        <span className="text-slate-400">-</span>
                      ) : (
                        <ul className="space-y-1 text-xs text-slate-600">
                          {r.lines.map((line) => (
                            <li key={line.serviceName}>
                              {line.serviceName} x {line.count} @ PHP {line.commissionEach} = PHP{' '}
                              {line.subtotal}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="py-4 pr-4 text-right">
                      PHP {r.baseSalary.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 pr-4 text-right text-emerald-700">
                      PHP {r.totalCommission.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 text-right font-bold">
                      PHP {r.totalPay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
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
