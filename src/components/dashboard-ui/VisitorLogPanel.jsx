import { UserPlus, LogOut } from 'lucide-react'

const visitors = [
  { name: 'Alyssa Jane Prak', time: '10:12 AM', purpose: 'Appointment', status: 'In' },
  { name: 'Michael Chen', time: '9:45 AM', purpose: 'Consultation', status: 'Out' },
  { name: 'Emily Rodriguez', time: '9:10 AM', reason: 'Walk-in', status: 'In' },
]

export default function VisitorLogPanel() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C2185B] via-[#EC407A] to-[#F48FB1] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:scale-[1.03] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          <UserPlus className="h-4 w-4" />
          Check-in visitor
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#C2185B] focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:focus:ring-offset-slate-900"
        >
          <LogOut className="h-4 w-4" />
          Check-out
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
        <table className="w-full min-w-[400px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
            <tr>
              <th className="px-3 py-2">Visitor</th>
              <th className="px-3 py-2">Time</th>
              <th className="px-3 py-2">Purpose</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {visitors.map((v) => (
              <tr key={v.name} className="text-slate-700 dark:text-slate-200">
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-white">{v.name}</td>
                <td className="px-3 py-2">{v.time}</td>
                <td className="px-3 py-2">{'purpose' in v ? v.purpose : v.reason}</td>
                <td className="px-3 py-2">
                  <span
                    className={
                      v.status === 'In'
                        ? 'rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                        : 'rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }
                  >
                    {v.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
