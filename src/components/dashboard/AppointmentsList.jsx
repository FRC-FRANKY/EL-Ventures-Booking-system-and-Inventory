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
    <div className="flex h-full flex-col rounded-xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
        Today&apos;s upcoming appointments
      </h3>
      <ul className="space-y-4 flex-1">
        {appointments.map((apt) => (
          <li
            key={`${apt.time}-${apt.customer}`}
            className="flex gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0 dark:border-slate-800"
          >
            <span className="w-20 flex-shrink-0 text-sm font-semibold text-[#C2185B] dark:text-[#EC407A]">
              {apt.time}
            </span>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">{apt.customer}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{apt.service}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
