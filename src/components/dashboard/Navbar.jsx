import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Calendar, Users } from 'lucide-react'

const navItems = [
  { to: '/receptionist/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/receptionist/appointments', icon: Calendar, label: 'Appointments' },
  { to: '/receptionist/customers', icon: Users, label: 'Customers' },
]

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex gap-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/receptionist/dashboard'}
            className={({ isActive }) =>
              `inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                isActive
                  ? 'text-purple-600 border-purple-600 bg-purple-50/50'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
