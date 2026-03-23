import {
  LayoutDashboard,
  FileText,
  Calendar,
  Users,
  History,
  Package,
  Receipt,
  Wallet,
} from 'lucide-react'

/**
 * @param {'hr' | 'receptionist' | 'accounting'} module
 * @param {{ fullName?: string; branch?: string } | undefined} receptionistState
 */
export function getSidebarNav(module, receptionistState) {
  const state = receptionistState || undefined

  switch (module) {
    case 'hr':
      return [
        { to: '/hr-manager/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
        { to: '/hr-manager/daily-report', label: 'Reports', icon: FileText },
        { to: '/hr-manager/payroll', label: 'Payroll', icon: Wallet },
      ]
    case 'receptionist':
      return [
        { to: '/receptionist/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true, state },
        { to: '/receptionist/appointments', label: 'Appointments', icon: Calendar, state },
        { to: '/receptionist/transactions', label: 'Transaction History', icon: History, state },
        { to: '/receptionist/customers', label: 'Customers', icon: Users, state },
      ]
    case 'accounting':
      return [
        {
          to: '/accounting-inventory/dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          end: true,
        },
        { to: '/accounting-inventory/inventory', label: 'Inventory', icon: Package },
        { to: '/accounting-inventory/expenses', label: 'Expenses', icon: Receipt },
        { to: '/accounting-inventory/receipt', label: 'Receipt', icon: FileText },
      ]
    default:
      return []
  }
}

export const MODULE_SWITCHER = [
  { label: 'HR Management', path: '/hr-manager/dashboard' },
  { label: 'Receptionist', path: '/receptionist/welcome' },
  { label: 'Accounting & Inventory', path: '/accounting-inventory/dashboard' },
]
