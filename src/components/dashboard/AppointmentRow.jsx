import { User, Phone, Clock } from 'lucide-react'

const statusStyles = {
  Confirmed: 'bg-blue-100 text-blue-800',
  Pending: 'bg-amber-100 text-amber-800',
  Completed: 'bg-green-100 text-green-800',
}

export default function AppointmentRow({ appointment }) {
  const statusClass = statusStyles[appointment.status] || 'bg-gray-100 text-gray-800'

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-purple-600" />
          </div>
          <span className="font-medium text-gray-900">{appointment.customer}</span>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm">{appointment.contact}</span>
        </div>
      </td>
      <td className="py-4 px-4 text-sm text-gray-700">{appointment.service}</td>
      <td className="py-4 px-4 text-sm text-gray-700">{appointment.stylist}</td>
      <td className="py-4 px-4 text-sm text-gray-700">{appointment.dateTime}</td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {appointment.duration}
        </div>
      </td>
      <td className="py-4 px-4 font-medium text-gray-900">{appointment.price}</td>
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
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
        >
          View Details
        </button>
      </td>
    </tr>
  )
}
