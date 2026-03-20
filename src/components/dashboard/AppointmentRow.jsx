import { User, Phone } from 'lucide-react'

const statusStyles = {
  Confirmed: 'bg-emerald-100 text-emerald-800',
  Pending: 'bg-fuchsia-100 text-fuchsia-800',
  Completed: 'bg-emerald-100 text-emerald-800',
  Cancelled: 'bg-rose-100 text-rose-800',
}

export default function AppointmentRow({ appointment, onViewDetails }) {
  const statusClass = statusStyles[appointment.status] || 'bg-gray-100 text-gray-800'

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600/15 via-fuchsia-500/15 to-sky-500/15">
            <User className="h-4 w-4 text-violet-700" />
          </div>
          <span className="font-medium text-slate-900">{appointment.customer}</span>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <span className="text-sm text-slate-700">{appointment.contact}</span>
        </div>
      </td>
      <td className="py-4 px-4 text-sm text-slate-700">{appointment.service}</td>
      <td className="py-4 px-4 text-sm text-slate-700">{appointment.stylist}</td>
      <td className="py-4 px-4 text-sm text-slate-700">{appointment.dateTime}</td>
      <td className="py-4 px-4 font-medium text-slate-900">{appointment.price}</td>
      <td className="py-4 px-4">
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusClass}`}
        >
          {appointment.status}
        </span>
      </td>
      <td className="py-4 px-4">
        <button
          type="button"
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-1"
          onClick={() => onViewDetails?.(appointment)}
        >
          View Details
        </button>
      </td>
    </tr>
  )
}
