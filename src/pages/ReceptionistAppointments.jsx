import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import Header from '../components/dashboard/Header'
import Navbar from '../components/dashboard/Navbar'
import AppointmentStatsCards from '../components/dashboard/AppointmentStatsCards'
import FilterBar from '../components/dashboard/FilterBar'
import AppointmentTabs from '../components/dashboard/AppointmentTabs'
import AppointmentsTable from '../components/dashboard/AppointmentsTable'

export default function ReceptionistAppointments() {
  const location = useLocation()
  const fullName = location.state?.fullName || 'Receptionist'
  const branch = location.state?.branch || 'Mandaue City Branch'
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All Statuses')
  const [date, setDate] = useState('')
  const [stylist, setStylist] = useState('All Stylists')
  const [activeTab, setActiveTab] = useState('Today')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header fullName={fullName} />
      <Navbar fullName={fullName} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <section>
          <AppointmentStatsCards />
        </section>

        <FilterBar
          search={search}
          status={status}
          date={date}
          stylist={stylist}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onDateChange={setDate}
          onStylistChange={setStylist}
        />

        <AppointmentTabs activeTab={activeTab} onChange={setActiveTab} />

        <AppointmentsTable
          branch={branch}
          activeTab={activeTab}
          search={search}
          status={status}
          date={date}
          stylist={stylist}
        />
      </main>
    </div>
  )
}
