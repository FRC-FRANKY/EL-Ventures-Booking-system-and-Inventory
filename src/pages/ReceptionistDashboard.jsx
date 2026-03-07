import { useLocation } from 'react-router-dom'
import Header from '../components/dashboard/Header'
import Navbar from '../components/dashboard/Navbar'
import WelcomeBanner from '../components/dashboard/WelcomeBanner'
import StatsCards from '../components/dashboard/StatsCards'
import QuickActions from '../components/dashboard/QuickActions'
import AppointmentsList from '../components/dashboard/AppointmentsList'
import RecentCustomers from '../components/dashboard/RecentCustomers'

export default function ReceptionistDashboard() {
  const location = useLocation()
  const fullName = location.state?.fullName || 'Frank Oliver Bentoy'

  return (
    <div className="min-h-screen bg-gray-50">
      <Header fullName={fullName} />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
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
    </div>
  )
}
