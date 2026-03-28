import { Fragment, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Wallet,
  Users,
  Download,
  Printer,
  ChevronRight,
  ChevronDown,
  Search,
} from 'lucide-react'
import ManagementShell from '../components/shell/ManagementShell'
import PanelCard from '../components/dashboard-ui/PanelCard'
import { getCutoffForPeriod } from '../utils/payrollCutoffs'
import { useCommissionTransactions } from '../hooks/useCommissionTransactions'
import { listenToBranchStylistPayrollMap } from '../utils/firebaseHelpers'
import { groupPayrollByStylist, payrollSummary } from '../utils/payrollGrouping'
import { STYLISTS as DEMO_STYLISTS } from '../data/hrPayrollData'

const ALL_BRANCHES_VALUE = '__ALL_BRANCHES__'
const KNOWN_BRANCHES = ['Mandaue City Branch', 'Pusok Branch', 'Pajac Branch', 'Cebu City Branch']

function csvEscape(value) {
  const t = String(value ?? '')
  if (/[",\n\r]/.test(t)) return `"${t.replace(/"/g, '""')}"`
  return t
}

function downloadCsv(filename, lines) {
  const blob = new Blob([lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function formatRate(rate) {
  const n = Number(rate) || 0
  if (n <= 0) return '—'
  if (n <= 1) return `${(n * 100).toFixed(2)}%`
  return `${n.toFixed(2)}%`
}

export default function HRManagerPayroll() {
  const location = useLocation()
  const displayName = location.state?.fullName || 'HR Manager'
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [period, setPeriod] = useState('first')
  const [selectedBranch, setSelectedBranch] = useState(KNOWN_BRANCHES[0])
  const [cutoffInitialized, setCutoffInitialized] = useState(false)
  const [payrollMapsByBranch, setPayrollMapsByBranch] = useState({})
  const [expandedId, setExpandedId] = useState(null)
  const [search, setSearch] = useState('')

  const isAllBranches = selectedBranch === ALL_BRANCHES_VALUE

  const { loading, error, transactions } = useCommissionTransactions(
    isAllBranches ? { branchNames: KNOWN_BRANCHES } : { branchName: selectedBranch }
  )

  useEffect(() => {
    setPayrollMapsByBranch({})
  }, [selectedBranch])

  useEffect(() => {
    const branches = isAllBranches ? KNOWN_BRANCHES : [selectedBranch]
    const unsubs = branches.map((b) =>
      listenToBranchStylistPayrollMap(b, (map) => {
        setPayrollMapsByBranch((prev) => ({ ...prev, [b]: map }))
      })
    )
    return () => unsubs.forEach((u) => {
      if (typeof u === 'function') u()
    })
  }, [selectedBranch, isAllBranches])

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

  const rows = useMemo(
    () =>
      groupPayrollByStylist(cutoff, transactions, {
        allBranches: isAllBranches,
        payrollMapsByBranch,
        demoStylists: DEMO_STYLISTS,
      }),
    [cutoff, transactions, isAllBranches, payrollMapsByBranch]
  )

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => {
      const name = String(r.stylist.name || '').toLowerCase()
      const branch = String(r.stylist.branch || '').toLowerCase()
      return name.includes(q) || branch.includes(q)
    })
  }, [rows, search])

  const totals = useMemo(() => payrollSummary(filteredRows), [filteredRows])

  function exportSummaryCsv() {
    const header = [
      'Stylist',
      'Branch',
      'Completed services',
      'Service total (PHP)',
      'Commission (PHP)',
      'Gross (PHP)',
    ]
    const lines = [
      header.map(csvEscape).join(','),
      ...filteredRows.map((r) =>
        [
          r.stylist.name,
          r.stylist.branch || (isAllBranches ? '' : selectedBranch),
          r.completedCount,
          r.baseSalary.toFixed(2),
          r.totalCommission.toFixed(2),
          r.totalPay.toFixed(2),
        ]
          .map(csvEscape)
          .join(',')
      ),
    ]
    downloadCsv(
      `payroll-summary-${cutoff.workStartIso}-to-${cutoff.workEndIso}.csv`,
      lines
    )
  }

  function exportDetailCsv() {
    const header = [
      'Stylist',
      'Branch',
      'Service',
      'Date',
      'Price (PHP)',
      'Commission rate',
      'Commission (PHP)',
    ]
    const lines = [header.map(csvEscape).join(',')]
    for (const r of filteredRows) {
      for (const d of r.details) {
        lines.push(
          [
            r.stylist.name,
            d.branch || r.stylist.branch || '',
            d.service,
            d.dateTime,
            d.price.toFixed(2),
            formatRate(d.rate),
            d.amount.toFixed(2),
          ]
            .map(csvEscape)
            .join(',')
        )
      }
    }
    downloadCsv(
      `payroll-detail-${cutoff.workStartIso}-to-${cutoff.workEndIso}.csv`,
      lines
    )
  }

  function handlePrint() {
    window.print()
  }

  const stylistLabel = (r) =>
    isAllBranches && r.stylist.branch
      ? `${r.stylist.name} · ${r.stylist.branch}`
      : r.stylist.name

  return (
    <ManagementShell module="hr" portalSubtitle="HR Manager · Payroll" userName={displayName}>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Stylist payroll</h1>
          <div className="flex flex-wrap gap-2 payroll-no-print">
            <button
              type="button"
              onClick={exportSummaryCsv}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Download className="h-4 w-4" />
              Export summary (CSV)
            </button>
            <button
              type="button"
              onClick={exportDetailCsv}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Download className="h-4 w-4" />
              Export line items (CSV)
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400">
          <strong>Service total</strong> is the sum of completed service prices per stylist in this cutoff.{' '}
          <strong>Gross</strong> pay is contract base (from Firebase{' '}
          <code className="rounded bg-slate-100 px-1 text-xs dark:bg-slate-800">baseSalaryPerCutoff</code> /{' '}
          <code className="rounded bg-slate-100 px-1 text-xs dark:bg-slate-800">monthlySalary</code> when set) plus commission. Does not include tax or other deductions.
        </p>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200">
            {error}
          </div>
        )}
        <PanelCard title="Semi-monthly schedule">
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            <li>
              <strong>1st-15th</strong> work is paid on the <strong>20th</strong> (same month).
            </li>
            <li>
              <strong>26th-last day</strong> work is paid on the <strong>15th</strong> (next month).
            </li>
          </ul>
        </PanelCard>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Users className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Stylists</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{totals.stylistCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Wallet className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Total service sales</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              PHP {totals.base.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Wallet className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Total commission</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              PHP {totals.commission.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Wallet className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Total gross</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-fuchsia-800 dark:text-fuchsia-300">
              PHP {totals.gross.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 payroll-no-print">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          >
            <option value={ALL_BRANCHES_VALUE}>All branches</option>
            {KNOWN_BRANCHES.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
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
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
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
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          >
            <option value="first">1st - 15th</option>
            <option value="second">26th - last day</option>
          </select>
          <div className="rounded-xl bg-fuchsia-50 px-3 py-2 text-xs text-slate-700 dark:bg-fuchsia-950/40 dark:text-fuchsia-100">
            <p className="font-semibold">{cutoff.label}</p>
            <p>{cutoff.payLabel}</p>
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              Work window: {cutoff.workStartIso} → {cutoff.workEndIso}
            </p>
          </div>
        </div>

        <div className="payroll-no-print flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stylist or branch…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <PanelCard title="Payroll by stylist">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  <th className="w-10 py-3 pr-2" aria-hidden />
                  <th className="py-3 pr-4">Stylist</th>
                  <th className="py-3 pr-4">Services</th>
                  <th className="py-3 pr-4 text-right">Service total</th>
                  <th className="py-3 pr-4 text-right">Commission</th>
                  <th className="py-3 text-right">Gross</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-500 dark:text-slate-400">
                      Loading payroll data...
                    </td>
                  </tr>
                ) : filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-500 dark:text-slate-400">
                      No completed booking lines in this cutoff for the selected scope.
                    </td>
                  </tr>
                ) : null}
                {filteredRows.map((r) => {
                  const open = expandedId === r.stylist.id
                  return (
                    <Fragment key={r.stylist.id}>
                      <tr className="align-top">
                        <td className="py-3 pr-2">
                          <button
                            type="button"
                            aria-expanded={open}
                            onClick={() => setExpandedId(open ? null : r.stylist.id)}
                            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            {open ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                        <td className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">
                          {stylistLabel(r)}
                        </td>
                        <td className="py-3 pr-4 text-slate-700 dark:text-slate-300">{r.completedCount}</td>
                        <td className="py-3 pr-4 text-right tabular-nums text-slate-800 dark:text-slate-200">
                          PHP {r.baseSalary.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 pr-4 text-right tabular-nums text-emerald-700 dark:text-emerald-400">
                          PHP {r.totalCommission.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 text-right tabular-nums font-semibold text-fuchsia-900 dark:text-fuchsia-300">
                          PHP {r.totalPay.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                      {open ? (
                        <tr className="bg-slate-50/80 dark:bg-slate-800/50">
                          <td colSpan={6} className="px-3 pb-4 pt-0">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                              Commission line items
                            </p>
                            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                              <table className="w-full min-w-[640px] text-left text-xs">
                                <thead>
                                  <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-600 dark:text-slate-400">
                                    <th className="px-3 py-2">Service</th>
                                    <th className="px-3 py-2">When</th>
                                    {isAllBranches ? <th className="px-3 py-2">Branch</th> : null}
                                    <th className="px-3 py-2 text-right">Price</th>
                                    <th className="px-3 py-2 text-right">Rate</th>
                                    <th className="px-3 py-2 text-right">Commission</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                  {r.details.length === 0 ? (
                                    <tr>
                                      <td
                                        colSpan={isAllBranches ? 6 : 5}
                                        className="px-3 py-3 text-slate-500"
                                      >
                                        No line detail (legacy appointment).
                                      </td>
                                    </tr>
                                  ) : (
                                    r.details.map((d) => (
                                      <tr key={d.id}>
                                        <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-200">
                                          {d.service}
                                        </td>
                                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                                          {d.dateTime}
                                        </td>
                                        {isAllBranches ? (
                                          <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                                            {d.branch || '—'}
                                          </td>
                                        ) : null}
                                        <td className="px-3 py-2 text-right tabular-nums">
                                          PHP {d.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-3 py-2 text-right tabular-nums">{formatRate(d.rate)}</td>
                                        <td className="px-3 py-2 text-right tabular-nums text-emerald-700 dark:text-emerald-400">
                                          PHP {d.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                        </td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </PanelCard>
      </div>
    </ManagementShell>
  )
}
