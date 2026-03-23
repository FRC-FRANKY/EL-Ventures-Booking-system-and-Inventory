import { useNavigate } from 'react-router-dom'
import { CalendarPlus, UserPlus } from 'lucide-react'

export default function ReceptionistQuickActionsBar({ fullName, branch }) {
  const navigate = useNavigate()
  const state = fullName ? { fullName, branch } : undefined

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => navigate('/receptionist/appointments', { state })}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C2185B] via-[#EC407A] to-[#F48FB1] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-[1.03] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
      >
        <CalendarPlus className="h-4 w-4" />
        New appointment
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#C2185B] focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:focus:ring-offset-slate-900"
      >
        <UserPlus className="h-4 w-4" />
        Log visitor
      </button>
    </div>
  )
}
