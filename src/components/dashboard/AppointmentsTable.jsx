import AppointmentRow from './AppointmentRow'

const appointments = [
  {
    id: 1,
    customer: 'Sarah Johnson',
    contact: '(555) 123-4567',
    service: 'Haircut & Styling',
    stylist: 'Emma Williams',
    dateTime: 'Mar 5, 2026 – 9:00 AM',
    duration: '60 min',
    price: 'PHP 85',
    status: 'Confirmed',
  },
  {
    id: 2,
    customer: 'Michael Chen',
    contact: '(555) 234-5678',
    service: 'Hair Coloring',
    stylist: 'Lisa Cruz',
    dateTime: 'Mar 5, 2026 – 10:30 AM',
    duration: '120 min',
    price: 'PHP 180',
    status: 'Confirmed',
  },
  {
    id: 3,
    customer: 'Emily Rodriguez',
    contact: '(555) 345-6789',
    service: 'Manicure & Pedicure',
    stylist: 'Ana Reyes',
    dateTime: 'Mar 5, 2026 – 2:00 PM',
    duration: '90 min',
    price: 'PHP 75',
    status: 'Pending',
  },
  {
    id: 4,
    customer: 'Robert Taylor',
    contact: '(555) 456-7890',
    service: 'Haircut',
    stylist: 'Maria Santos',
    dateTime: 'Mar 4, 2026 – 11:00 AM',
    duration: '45 min',
    price: 'PHP 45',
    status: 'Completed',
  },
]

const tableDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export default function AppointmentsTable() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <p className="text-sm text-gray-600">{tableDate}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Stylist
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <AppointmentRow key={appointment.id} appointment={appointment} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
