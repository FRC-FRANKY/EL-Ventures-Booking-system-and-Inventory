import { useNavigate } from 'react-router-dom'
import { FileText, BarChart3, TrendingUp } from 'lucide-react'

const actions = [
  { label: "View Today's Report", icon: FileText, path: '/hr-manager/daily-report' },
  { label: 'View Branch Performance', icon: BarChart3, path: '/hr-manager/daily-report' },
  { label: 'Analyze Sales Trends', icon: TrendingUp, path: '/hr-manager/daily-report' },
  { label: 'Generate Monthly Report', icon: FileText, path: '/hr-manager/daily-report' },
]

export default function QuickActions() {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 h-full">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
      <div className="flex flex-col gap-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.label}
              type="button"
              onClick={() => navigate(action.path)}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <Icon className="w-5 h-5 text-purple-600 shrink-0" />
              {action.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
