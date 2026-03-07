import AccountingHeader from '../components/accounting/AccountingHeader'
import AccountingNavbar from '../components/accounting/AccountingNavbar'

export default function AccountingPlaceholder({ title }) {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <AccountingHeader />
      <AccountingNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-500 mt-1">Content coming soon.</p>
      </main>
    </div>
  )
}
