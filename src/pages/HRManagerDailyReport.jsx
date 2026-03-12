import { useState, useCallback, useMemo } from 'react'
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import ReportFilters from '../components/report/ReportFilters'
import ReportHeader from '../components/report/ReportHeader'
import CustomerActivity from '../components/report/CustomerActivity'
import TransactionBreakdown from '../components/report/TransactionBreakdown'
import PaymentBreakdown from '../components/report/PaymentBreakdown'
import FinancialSummary from '../components/report/FinancialSummary'
import CommissionFilters from '../components/report/CommissionFilters'
import CommissionReport from '../components/report/CommissionReport'
import EditCommissionRateModal from '../components/report/EditCommissionRateModal'

const INITIAL_COMMISSION_DATA = [
  {
    date: 'Friday, March 6, 2026',
    entries: [
      { id: '1', stylist: 'Rachel Adams', service: 'Hair Extensions', price: 450, rate: 46.9, amount: 211.05 },
    ],
  },
  {
    date: 'Thursday, March 5, 2026',
    entries: [
      { id: '2', stylist: 'Emma Williams', service: 'Haircut & Styling', price: 85, rate: 40, amount: 34 },
      { id: '3', stylist: 'Emma Williams', service: 'Hair Coloring', price: 180, rate: 40, amount: 72 },
      { id: '4', stylist: 'Sophia Martinez', service: 'Manicure & Pedicure', price: 75, rate: 35, amount: 26.25 },
      { id: '5', stylist: 'James Taylor', service: 'Beard Trim', price: 35, rate: 30, amount: 10.5 },
      { id: '6', stylist: 'Emma Williams', service: 'Balayage', price: 220, rate: 40, amount: 88 },
      { id: '7', stylist: 'James Taylor', service: 'Haircut', price: 45, rate: 30, amount: 13.5 },
      { id: '8', stylist: 'Rachel Adams', service: 'Keratin Treatment', price: 250, rate: 45, amount: 112.5 },
      { id: '9', stylist: 'Michael Ross', service: 'Haircut & Beard Trim', price: 60, rate: 35, amount: 21 },
    ],
  },
]

function flattenAndFilter(commissionData, stylistFilter, dateFilter, serviceSearch) {
  const all = commissionData.flatMap((group) =>
    group.entries.map((e) => ({ ...e, date: group.date }))
  )
  return all.filter((e) => {
    if (stylistFilter && stylistFilter !== 'All Stylists' && e.stylist !== stylistFilter) return false
    if (dateFilter && dateFilter !== 'All Dates' && e.date !== dateFilter) return false
    if (serviceSearch.trim() && !e.service.toLowerCase().includes(serviceSearch.trim().toLowerCase())) return false
    return true
  })
}

function groupByDate(entries) {
  const byDate = {}
  entries.forEach((e) => {
    if (!byDate[e.date]) byDate[e.date] = []
    byDate[e.date].push(e)
  })
  return Object.entries(byDate).map(([date, entries]) => ({ date, entries }))
}

export default function HRManagerDailyReport() {
  const [commissionData, setCommissionData] = useState(INITIAL_COMMISSION_DATA)
  const [editingEntry, setEditingEntry] = useState(null)
  const [stylistFilter, setStylistFilter] = useState('All Stylists')
  const [dateFilter, setDateFilter] = useState('All Dates')
  const [serviceSearch, setServiceSearch] = useState('')
  const [reportDate, setReportDate] = useState('07/03/2026')
  const [branch, setBranch] = useState('Mandaue City Branch')

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

  const handleSaveCommission = useCallback((updated) => {
    setCommissionData((prev) =>
      prev.map((group) => {
        if (group.date !== updated.date) return group
        return {
          ...group,
          entries: group.entries.map((e) =>
            e.id === updated.id ? { ...e, rate: updated.rate, amount: updated.amount } : e
          ),
        }
      })
    )
  }, [])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const handleExport = useCallback(() => {
    const payload = {
      exportedAt: new Date().toISOString(),
      reportDate,
      branch,
      commissionFilters: { stylistFilter, dateFilter, serviceSearch },
      commissionSummary: summary,
      commissionEntries: filteredFlat,
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hr-daily-report_${branch.replace(/\s+/g, '_')}_${reportDate.replaceAll('/', '-')}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, [reportDate, branch, stylistFilter, dateFilter, serviceSearch, summary, filteredFlat])

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Header />
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <ReportFilters
          reportDate={reportDate}
          branch={branch}
          onReportDateChange={setReportDate}
          onBranchChange={setBranch}
          onPrint={handlePrint}
          onExport={handleExport}
        />
        <ReportHeader branch={branch} reportDate={reportDate} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          onStylistChange={setStylistFilter}
          onDateChange={setDateFilter}
          onServiceSearchChange={setServiceSearch}
          onClearFilters={handleClearFilters}
          totalRecords={summary.records}
          totalSales={`PHP ${summary.sales.toFixed(2)}`}
          totalCommission={`PHP ${summary.commission.toFixed(2)}`}
        />
        <CommissionReport data={filteredGrouped} onEditRate={handleEditRate} />
      </main>

      {editingEntry && (
        <EditCommissionRateModal
          entry={editingEntry}
          onClose={handleCloseModal}
          onSave={handleSaveCommission}
        />
      )}
    </div>
  )
}
