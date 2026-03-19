import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import Header from '../components/dashboard/Header'
import Navbar from '../components/dashboard/Navbar'
import CustomerStatsCards from '../components/dashboard/CustomerStatsCards'
import CustomerSearchBar from '../components/dashboard/CustomerSearchBar'
import VIPCustomersSection from '../components/dashboard/VIPCustomersSection'
import CustomerTable from '../components/dashboard/CustomerTable'

export default function ReceptionistCustomers() {
  const location = useLocation()
  const fullName = location.state?.fullName || 'Receptionist'
  const branch = location.state?.branch || 'Mandaue City Branch'
  const [query, setQuery] = useState('')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header fullName={fullName} />
      <Navbar fullName={fullName} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <section>
          <CustomerStatsCards />
        </section>

        <CustomerSearchBar query={query} onQueryChange={setQuery} />

        <VIPCustomersSection />

        <CustomerTable branch={branch} query={query} />
      </main>
    </div>
  )
}
