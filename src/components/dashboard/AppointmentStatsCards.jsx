import { Calendar, CheckCircle, Clock, Users } from 'lucide-react'

const stats = [
  {
    title: "Today's Appointments",
    value: '2',
    icon: Calendar,
    iconBg: 'bg-blue-500',
  },
  {
    title: 'Confirmed',
    value: '10',
    icon: CheckCircle,
    iconBg: 'bg-green-500',
  },
  {
    title: 'Pending',
    value: '5',
    icon: Clock,
    iconBg: 'bg-amber-400',
  },
  {
    title: 'Total Revenue',
    value: '$45',
    icon: Users,
    iconBg: 'bg-purple-500',
  },
]

export default function AppointmentStatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.title}
            className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 transition-shadow hover:shadow-md"
          >
            <div
              className={`w-12 h-12 rounded-lg ${stat.iconBg} flex items-center justify-center flex-shrink-0`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
