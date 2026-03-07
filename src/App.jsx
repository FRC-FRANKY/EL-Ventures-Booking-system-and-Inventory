import { Routes, Route } from 'react-router-dom'
import RoleSelection from './pages/RoleSelection'
import Login from './pages/Login'
import ReceptionistWelcome from './pages/ReceptionistWelcome'
import ReceptionistDashboard from './pages/ReceptionistDashboard'
import ReceptionistAppointments from './pages/ReceptionistAppointments'
import ReceptionistCustomers from './pages/ReceptionistCustomers'
import HRManagerDashboard from './pages/HRManagerDashboard'
import HRManagerDailyReport from './pages/HRManagerDailyReport'

function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelection />} />
      <Route path="/login/:role" element={<Login />} />
      <Route path="/receptionist/welcome" element={<ReceptionistWelcome />} />
      <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />
      <Route path="/receptionist/appointments" element={<ReceptionistAppointments />} />
      <Route path="/receptionist/customers" element={<ReceptionistCustomers />} />
      <Route path="/hr-manager/dashboard" element={<HRManagerDashboard />} />
      <Route path="/hr-manager/daily-report" element={<HRManagerDailyReport />} />
    </Routes>
  )
}

export default App
