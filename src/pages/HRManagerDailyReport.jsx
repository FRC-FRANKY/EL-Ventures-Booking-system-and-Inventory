import { useState, useCallback, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import ManagementShell from '../components/shell/ManagementShell'
import ReportFilters from '../components/report/ReportFilters'
import ReportHeader from '../components/report/ReportHeader'
import CustomerActivity from '../components/report/CustomerActivity'
import TransactionBreakdown from '../components/report/TransactionBreakdown'
import PaymentBreakdown from '../components/report/PaymentBreakdown'
import FinancialSummary from '../components/report/FinancialSummary'
import CommissionFilters from '../components/report/CommissionFilters'
import CommissionReport from '../components/report/CommissionReport'
import EditCommissionRateModal from '../components/report/EditCommissionRateModal'
import { useCommissionTransactions } from '../hooks/useCommissionTransactions'
import { updateAppointmentCommissionRate } from '../utils/firebaseHelpers'

function formatLongDate(dateKey) {
  if (!dateKey) return 'No Date'
  const d = new Date(dateKey)
  if (Number.isNaN(d.getTime())) return dateKey
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function flattenAndFilter(commissionData, stylistFilter, dateFilter, serviceSearch) {
  const all = commissionData.flatMap((group) => group.entries.map((e) => ({ ...e, date: group.date })))
  return all.filter((e) => {
    if (stylistFilter && stylistFilter !== 'All Stylists' && e.stylist !== stylistFilter) return false
    if (dateFilter && dateFilter !== 'All Dates' && e.date !== dateFilter) return false
    if (serviceSearch.trim() && !e.service.toLowerCase().includes(serviceSearch.trim().toLowerCase())) {
      return false
    }
    return true
  })
}

function groupByDate(entries) {
  const byDate = {}
  entries.forEach((e) => {
    if (!byDate[e.date]) byDate[e.date] = []
    byDate[e.date].push(e)
  })
  return Object.entries(byDate).map(([date, ent]) => ({ date, entries: ent }))
}

export default function HRManagerDailyReport() {
  const location = useLocation()
  const displayName = location.state?.fullName || 'HR Recel Orcales'

  const [editingEntry, setEditingEntry] = useState(null)
  const [stylistFilter, setStylistFilter] = useState('All Stylists')
  const [dateFilter, setDateFilter] = useState('All Dates')
  const [serviceSearch, setServiceSearch] = useState('')
  const [reportDate, setReportDate] = useState('07/03/2026')
  const [selectedBranch, setSelectedBranch] = useState('Mandaue City Branch')
  const knownBranches = useMemo(
    () => ['Mandaue City Branch', 'Pusok Branch', 'Pajac Branch', 'Cebu City Branch'],
    []
  )

  const commissionScope = { branchName: selectedBranch }

  const { loading, error, transactions, stylists } = useCommissionTransactions(commissionScope)

  const branchOptions = useMemo(() => {
    const discovered = Array.from(new Set(transactions.map((row) => row.branch).filter(Boolean)))
    return Array.from(new Set([...knownBranches, ...discovered]))
  }, [knownBranches, transactions])

  useEffect(() => {
    if (!branchOptions.includes(selectedBranch)) {
      setSelectedBranch(branchOptions[0] || 'Mandaue City Branch')
    }
  }, [branchOptions, selectedBranch])

  const branchScoped = transactions

  const commissionData = useMemo(() => {
    return groupByDate(
      branchScoped.map((row) => ({
        id: row.id,
        appointmentId: row.appointmentId,
        serviceKey: row.serviceKey,
        serviceIndex: row.serviceIndex,
        date: formatLongDate(row.dateKey),
        branch: row.branch,
        stylist: row.stylistName,
        service: row.service,
        price: Number(row.price || 0),
        rate: Number(row.commissionRate || 0),
        amount: Number(row.commissionAmount || 0),
      }))
    )
  }, [branchScoped])

  const dateOptions = useMemo(() => {
    const set = new Set(commissionData.map((g) => g.date))
    return ['All Dates', ...Array.from(set)]
  }, [commissionData])

  const filteredFlat = useMemo(
    () => flattenAndFilter(commissionData, stylistFilter, dateFilter, serviceSearch),
    [commissionData, stylistFilter, dateFilter, serviceSearch]
  )
  const filteredGrouped = useMemo(() => groupByDate(filteredFlat), [filteredFlat])
  const summary = useMemo(
    () => ({
      records: filteredFlat.length,
      sales: filteredFlat.reduce((s, e) => s + e.price, 0),
      commission: filteredFlat.reduce((s, e) => s + e.amount, 0),
    }),
    [filteredFlat]
  )

  const handleClearFilters = useCallback(() => {
    setStylistFilter('All Stylists')
    setDateFilter('All Dates')
    setServiceSearch('')
  }, [])

  const handleEditRate = useCallback((entry) => {
    setEditingEntry(entry)
  }, [])

  const handleCloseModal = useCallback(() => {
    setEditingEntry(null)
  }, [])

  const handleSaveCommission = useCallback(async (updated) => {
    const branchToWrite = updated.branch || selectedBranch
    await updateAppointmentCommissionRate(
      updated.appointmentId,
      updated.rate,
      branchToWrite,
      updated.serviceKey,
      updated.serviceIndex
    )
  }, [selectedBranch])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const handleExport = useCallback(() => {
    const payload = {
      exportedAt: new Date().toISOString(),
      reportDate,
      branch: selectedBranch,
      commissionFilters: { stylistFilter, dateFilter, serviceSearch },
      commissionSummary: summary,
      commissionEntries: filteredFlat,
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hr-daily-report_${selectedBranch.replace(/\s+/g, '_')}_${reportDate.replaceAll('/', '-')}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, [reportDate, selectedBranch, stylistFilter, dateFilter, serviceSearch, summary, filteredFlat])

  return (
    <ManagementShell module="hr" portalSubtitle="HR Manager · Reports" userName={displayName}>
      <div className="space-y-6">
        <ReportFilters
          reportDate={reportDate}
          branch={selectedBranch}
          branchOptions={branchOptions}
          onReportDateChange={setReportDate}
          onBranchChange={setSelectedBranch}
          onPrint={handlePrint}
          onExport={handleExport}
        />
        <ReportHeader branch={selectedBranch} reportDate={reportDate} />
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <CustomerActivity />
            <TransactionBreakdown />
          </div>
          <div className="space-y-6">
            <PaymentBreakdown />
            <FinancialSummary />
          </div>
        </div>

        <CommissionFilters
          stylistFilter={stylistFilter}
          dateFilter={dateFilter}
          serviceSearch={serviceSearch}
          stylistOptions={stylists}
          dateOptions={dateOptions}
          onStylistChange={setStylistFilter}
          onDateChange={setDateFilter}
          onServiceSearchChange={setServiceSearch}
          onClearFilters={handleClearFilters}
          totalRecords={summary.records}
          totalSales={`PHP ${summary.sales.toFixed(2)}`}
          totalCommission={`PHP ${summary.commission.toFixed(2)}`}
        />
        {loading ? (
          <div className="rounded-xl bg-white p-6 text-sm text-slate-500 shadow-sm">
            Loading commission records...
          </div>
        ) : (
          <CommissionReport data={filteredGrouped} onEditRate={handleEditRate} />
        )}
      </div>
      {editingEntry && (
        <EditCommissionRateModal
          entry={editingEntry}
          onClose={handleCloseModal}
          onSave={handleSaveCommission}
        />
      )}
    </ManagementShell>
  )
}
