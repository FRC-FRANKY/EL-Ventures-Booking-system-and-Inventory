import { useState } from 'react'
import { PhilippinePeso, Receipt, Package, AlertTriangle } from 'lucide-react'
import ManagementShell from '../components/shell/ManagementShell'
import WelcomeGradientBanner from '../components/dashboard-ui/WelcomeGradientBanner'
import KpiStatCard from '../components/dashboard-ui/KpiStatCard'
import PanelCard from '../components/dashboard-ui/PanelCard'
import ModuleCard from '../components/accounting/ModuleCard'
import RecentTransactions from '../components/accounting/RecentTransactions'
import LowStockAlerts from '../components/accounting/LowStockAlerts'
import { TrendLineChart, SalesBarChart, CategoryPieChart } from '../components/dashboard-ui/charts/DashboardCharts'

export default function AccountingDashboard() {
  const [range, setRange] = useState('30d')

  return (
    <ManagementShell
      module="accounting"
      portalSubtitle="Accounting & Inventory"
      userName="Finance team"
    >
      <WelcomeGradientBanner
        title="Accounting & inventory"
        subtitle="Revenue, expenses, stock, and operational health."
        icon={PhilippinePeso}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Filters apply to charts (demo data).
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="acct-range" className="sr-only">
            Date range
          </label>
          <select
            id="acct-range"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-[#C2185B]/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <select
            aria-label="Category"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-[#C2185B]/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            defaultValue="all"
          >
            <option value="all">All categories</option>
            <option value="salon">Salon</option>
            <option value="nail">Nail</option>
            <option value="clinic">Clinic</option>
          </select>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiStatCard
          title="Total revenue"
          value="PHP 458,325"
          trend="+12.5% vs prior period"
          trendTone="positive"
          subtitle="Month to date"
          icon={PhilippinePeso}
        />
        <KpiStatCard
          title="Monthly expenses"
          value="PHP 125,450"
          trend="-5.2% vs prior"
          trendTone="positive"
          subtitle="Controlled spend"
          icon={Receipt}
        />
        <KpiStatCard
          title="Inventory value"
          value="PHP 892,100"
          trend="Stable"
          trendTone="neutral"
          subtitle="On-hand valuation"
          icon={Package}
        />
        <KpiStatCard
          title="Low stock alerts"
          value="8"
          trend="Needs reorder"
          trendTone="neutral"
          subtitle="SKUs below minimum"
          icon={AlertTriangle}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PanelCard title="Revenue trend" description={`Range: ${range}`} className="lg:col-span-2">
          <TrendLineChart title="" />
        </PanelCard>
        <PanelCard title="Category mix" description="Share of revenue">
          <CategoryPieChart title="" />
        </PanelCard>
      </section>

      <PanelCard title="Sales by channel" description="Compare performance">
        <SalesBarChart title="" />
      </PanelCard>

      <ModuleCard />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentTransactions />
        <LowStockAlerts />
      </div>
    </ManagementShell>
  )
}
