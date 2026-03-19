import { useNavigate, useLocation } from 'react-router-dom'
import { Calendar, Users } from 'lucide-react'

const actions = [
  {
    title: 'Manage Appointments',
    description: 'View and manage customer bookings.',
    icon: Calendar,
    iconBg: 'bg-blue-500',
    path: '/receptionist/appointments',
  },
  {
    title: 'Customer Database',
    description: 'Access customer information and history.',
    icon: Users,
    iconBg: 'bg-green-500',
    path: '/receptionist/customers',
  },
]

export default function QuickActions() {
  const navigate = useNavigate()
  const location = useLocation()
  const fullName = location.state?.fullName || 'Receptionist'

  return (
    <section>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.title}
              type="button"
              onClick={() => navigate(action.path, { state: { fullName } })}
              className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 text-left hover:shadow-md hover:bg-gray-50/50 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <div
                className={`w-12 h-12 rounded-full ${action.iconBg} flex items-center justify-center flex-shrink-0`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{action.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {action.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
