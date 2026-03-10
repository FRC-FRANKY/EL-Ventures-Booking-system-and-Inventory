import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Clock } from 'lucide-react'
import Header from '../components/dashboard/Header'
import Navbar from '../components/dashboard/Navbar'
import WelcomeBanner from '../components/dashboard/WelcomeBanner'
import StatsCards from '../components/dashboard/StatsCards'
import QuickActions from '../components/dashboard/QuickActions'
import AppointmentsList from '../components/dashboard/AppointmentsList'
import RecentCustomers from '../components/dashboard/RecentCustomers'
import LoginHistoryModal from '../components/dashboard/LoginHistoryModal'

export default function ReceptionistDashboard() {
  const location = useLocation()
  const fullName = location.state?.fullName || 'Frank Oliver Bentoy'
  const [showLoginHistory, setShowLoginHistory] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header fullName={fullName} />
      <Navbar fullName={fullName} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex-1 min-w-0" />
          <button
            type="button"
            onClick={() => setShowLoginHistory(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <Clock className="w-4 h-4" />
            Login History
          </button>
        </div>
        <WelcomeBanner fullName={fullName} />

        <section>
          <StatsCards />
        </section>

        <QuickActions />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AppointmentsList />
          <RecentCustomers />
        </div>
      </main>

      {showLoginHistory && (
        <LoginHistoryModal onClose={() => setShowLoginHistory(false)} />
      )}
    </div>
  )
}
