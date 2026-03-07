import AccountingHeader from '../components/accounting/AccountingHeader'
import AccountingNavbar from '../components/accounting/AccountingNavbar'
import WelcomeBanner from '../components/accounting/WelcomeBanner'
import StatCard from '../components/accounting/StatCard'
import ModuleCard from '../components/accounting/ModuleCard'
import RecentTransactions from '../components/accounting/RecentTransactions'
import LowStockAlerts from '../components/accounting/LowStockAlerts'

const stats = [
  { title: 'Monthly Revenue', value: 'PHP 458,325.00', growth: '+12.5%', accentColor: 'green' },
  { title: 'Monthly Expenses', value: 'PHP 125,450.00', growth: '-5.2%', accentColor: 'blue' },
  { title: 'Net Profit', value: 'PHP 332,875.00', growth: '+18.3%', accentColor: 'purple' },
  { title: 'Low Stock Items', value: '8', note: 'Needs attention', accentColor: 'orange', showTrend: false },
]

export default function AccountingDashboard() {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <AccountingHeader />
      <AccountingNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <WelcomeBanner />

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </section>

        <ModuleCard />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentTransactions />
          <LowStockAlerts />
        </div>
      </main>
    </div>
  )
}
