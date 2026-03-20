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
    <div className="h-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Quick actions</h3>
      <div className="flex flex-col gap-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.label}
              type="button"
              onClick={() => navigate(action.path)}
              className="flex w-full items-center gap-3 rounded-xl border border-transparent bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-violet-200 hover:bg-white hover:shadow-sm dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-fuchsia-500/30 dark:hover:bg-slate-800"
            >
              <Icon className="h-5 w-5 shrink-0 text-violet-600 dark:text-fuchsia-400" />
              {action.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
