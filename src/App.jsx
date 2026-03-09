import { Routes, Route } from 'react-router-dom'
import RoleSelection from './pages/RoleSelection'
import Login from './pages/Login'
import ReceptionistWelcome from './pages/ReceptionistWelcome'
import ReceptionistDashboard from './pages/ReceptionistDashboard'
import ReceptionistAppointments from './pages/ReceptionistAppointments'
import ReceptionistCustomers from './pages/ReceptionistCustomers'
import HRManagerDashboard from './pages/HRManagerDashboard'
import HRManagerDailyReport from './pages/HRManagerDailyReport'
import AccountingDashboard from './pages/AccountingDashboard'
import AccountingPlaceholder from './pages/AccountingPlaceholder'
import InventoryPage from './pages/InventoryPage'
import ReceiptPage from './pages/ReceiptPage'

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
      <Route path="/accounting-inventory/dashboard" element={<AccountingDashboard />} />
      <Route path="/accounting-inventory/inventory" element={<InventoryPage />} />
      <Route path="/accounting-inventory/sales" element={<AccountingPlaceholder title="Sales" />} />
      <Route path="/accounting-inventory/expenses" element={<AccountingPlaceholder title="Expenses" />} />
      <Route path="/accounting-inventory/receipt" element={<ReceiptPage />} />
    </Routes>
  )
}

export default App
