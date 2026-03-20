import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Clock, Calendar } from 'lucide-react'
import ManagementShell from '../components/shell/ManagementShell'
import WelcomeGradientBanner from '../components/dashboard-ui/WelcomeGradientBanner'
import ReceptionistKpiRow from '../components/dashboard/ReceptionistKpiRow'
import ReceptionistQuickActionsBar from '../components/dashboard/ReceptionistQuickActionsBar'
import PanelCard from '../components/dashboard-ui/PanelCard'
import VisitorLogPanel from '../components/dashboard-ui/VisitorLogPanel'
import AppointmentsList from '../components/dashboard/AppointmentsList'
import RecentCustomers from '../components/dashboard/RecentCustomers'
import LoginHistoryModal from '../components/dashboard/LoginHistoryModal'
import { useReceptionistSwitchRole } from '../hooks/useReceptionistSwitchRole'

export default function ReceptionistDashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const fullName = location.state?.fullName
  const branch = location.state?.branch || 'Mandaue City Branch'
  const [showLoginHistory, setShowLoginHistory] = useState(false)
  const switchRole = useReceptionistSwitchRole()

  useEffect(() => {
    if (!fullName) {
      navigate('/receptionist/welcome', { replace: true })
    }
  }, [fullName, navigate])

  const receptionistState = { fullName: fullName || 'Receptionist', branch }

  return (
    <ManagementShell
      module="receptionist"
      portalSubtitle={`Receptionist · ${branch}`}
      userName={fullName || 'Receptionist'}
      receptionistState={receptionistState}
      onSwitchRole={switchRole}
    >
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setShowLoginHistory(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus:ring-offset-slate-900"
        >
          <Clock className="h-4 w-4" />
          Login history
        </button>
      </div>

      <WelcomeGradientBanner
        title={`Welcome, ${fullName || 'Receptionist'}`}
        subtitle={branch}
        icon={Calendar}
      />

      <ReceptionistKpiRow />

      <ReceptionistQuickActionsBar fullName={fullName} branch={branch} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PanelCard title="Visitor log" description="Fast check-in for walk-ins and guests">
          <VisitorLogPanel />
        </PanelCard>
        <AppointmentsList />
      </div>

      <RecentCustomers />

      {showLoginHistory && (
        <LoginHistoryModal onClose={() => setShowLoginHistory(false)} />
      )}
    </ManagementShell>
  )
}
