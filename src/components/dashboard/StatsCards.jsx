const stats = [
  {
    title: "Today's Appointments",
    value: '12',
    extra: '+3 from yesterday',
    accent: 'border-l-blue-500',
  },
  {
    title: 'Pending Confirmations',
    value: '5',
    extra: '2 urgent',
    accent: 'border-l-orange-400',
  },
  {
    title: 'Total Customers',
    value: '342',
    extra: '+8 this week',
    extraClass: 'text-green-600',
    accent: 'border-l-green-500',
  },
  {
    title: 'Available Slots',
    value: '7',
    extra: 'Today remaining',
    accent: 'border-l-purple-500',
  },
]

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className={`bg-white rounded-xl shadow-sm border-l-4 ${stat.accent} p-4 transition-shadow hover:shadow-md`}
        >
          <p className="text-sm font-medium text-gray-500">{stat.title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          <p className={`text-sm text-gray-500 mt-0.5 ${stat.extraClass || ''}`}>
            {stat.extra}
          </p>
        </div>
      ))}
    </div>
  )
}
