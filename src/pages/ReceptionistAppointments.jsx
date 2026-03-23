import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ManagementShell from '../components/shell/ManagementShell'
import AppointmentStatsCards from '../components/dashboard/AppointmentStatsCards'
import FilterBar from '../components/dashboard/FilterBar'
import AppointmentTabs from '../components/dashboard/AppointmentTabs'
import AppointmentsTable from '../components/dashboard/AppointmentsTable'
import { useReceptionistSwitchRole } from '../hooks/useReceptionistSwitchRole'
import { extractStylistsFromAppointment, listenToBranchAppointments } from '../utils/firebaseHelpers'

export default function ReceptionistAppointments() {
  const location = useLocation()
  const fullName = location.state?.fullName || 'Receptionist'
  const branch = location.state?.branch || 'Mandaue City Branch'
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All Statuses')
  const [date, setDate] = useState('')
  const [stylist, setStylist] = useState('All Stylists')
  const [activeTab, setActiveTab] = useState('Today')
  const switchRole = useReceptionistSwitchRole()
  const [stylistOptions, setStylistOptions] = useState([])

  useEffect(() => {
    const unsubscribe = listenToBranchAppointments(
      branch,
      (appointments) => {
        const names = new Set()
        for (const apt of appointments || []) {
          for (const stylistRow of extractStylistsFromAppointment(apt.stylists)) {
            if (stylistRow?.name) names.add(String(stylistRow.name))
          }
        }
        setStylistOptions(Array.from(names).sort((a, b) => a.localeCompare(b)))
      },
      () => {
        setStylistOptions([])
      }
    )
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [branch])

  useEffect(() => {
    if (stylist === 'All Stylists') return
    if (!stylistOptions.includes(stylist)) {
      setStylist('All Stylists')
    }
  }, [stylist, stylistOptions])

  const receptionistState = { fullName, branch }

  return (
    <ManagementShell
      module="receptionist"
      portalSubtitle={`Receptionist · Appointments · ${branch}`}
      userName={fullName}
      receptionistState={receptionistState}
      onSwitchRole={switchRole}
    >
      <section>
        <AppointmentStatsCards branch={branch} />
      </section>

      <FilterBar
        search={search}
        status={status}
        date={date}
        stylist={stylist}
        stylistOptions={stylistOptions}
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
    </ManagementShell>
  )
}
