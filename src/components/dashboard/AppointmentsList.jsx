const appointments = [
  {
    time: '10:00 AM',
    customer: 'Sarah Johnson',
    service: 'Haircut & Style with Maria Santos',
  },
  {
    time: '11:30 AM',
    customer: 'Michael Chen',
    service: 'Hair Coloring with Lisa Cruz',
  },
  {
    time: '1:00 PM',
    customer: 'Emma Wilson',
    service: 'Manicure & Pedicure with Ana Reyes',
  },
  {
    time: '2:30 PM',
    customer: 'James Brown',
    service: 'Hair Treatment with Maria Santos',
  },
]

export default function AppointmentsList() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Today's Upcoming Appointments
      </h3>
      <ul className="space-y-4 flex-1">
        {appointments.map((apt) => (
          <li
            key={`${apt.time}-${apt.customer}`}
            className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
          >
            <span className="font-semibold text-purple-600 text-sm w-20 flex-shrink-0">
              {apt.time}
            </span>
            <div>
              <p className="font-medium text-gray-900">{apt.customer}</p>
              <p className="text-sm text-gray-500">{apt.service}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
