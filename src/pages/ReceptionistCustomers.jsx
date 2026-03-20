import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import ManagementShell from '../components/shell/ManagementShell'
import CustomerStatsCards from '../components/dashboard/CustomerStatsCards'
import CustomerSearchBar from '../components/dashboard/CustomerSearchBar'
import VIPCustomersSection from '../components/dashboard/VIPCustomersSection'
import CustomerTable from '../components/dashboard/CustomerTable'
import { useReceptionistSwitchRole } from '../hooks/useReceptionistSwitchRole'

export default function ReceptionistCustomers() {
  const location = useLocation()
  const fullName = location.state?.fullName || 'Receptionist'
  const branch = location.state?.branch || 'Mandaue City Branch'
  const [query, setQuery] = useState('')
  const switchRole = useReceptionistSwitchRole()

  const receptionistState = { fullName, branch }

  return (
    <ManagementShell
      module="receptionist"
      portalSubtitle={`Receptionist · Customers · ${branch}`}
      userName={fullName}
      receptionistState={receptionistState}
      onSwitchRole={switchRole}
    >
      <section>
        <CustomerStatsCards />
      </section>

      <CustomerSearchBar query={query} onQueryChange={setQuery} />

      <VIPCustomersSection />

      <CustomerTable branch={branch} query={query} />
    </ManagementShell>
  )
}
