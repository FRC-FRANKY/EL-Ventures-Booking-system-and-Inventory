import { useLocation } from 'react-router-dom'
import Header from '../components/dashboard/Header'
import Navbar from '../components/dashboard/Navbar'
import AppointmentStatsCards from '../components/dashboard/AppointmentStatsCards'
import FilterBar from '../components/dashboard/FilterBar'
import AppointmentTabs from '../components/dashboard/AppointmentTabs'
import AppointmentsTable from '../components/dashboard/AppointmentsTable'

export default function ReceptionistAppointments() {
  const location = useLocation()
  const fullName = location.state?.fullName || 'Frank Oliver Bentoy'

  return (
    <div className="min-h-screen bg-gray-50">
      <Header fullName={fullName} />
      <Navbar fullName={fullName} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <section>
          <AppointmentStatsCards />
        </section>

        <FilterBar />

        <AppointmentTabs />

        <AppointmentsTable />
      </main>
    </div>
  )
}
