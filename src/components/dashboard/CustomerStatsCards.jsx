import { Users } from 'lucide-react'

const stats = [
  { title: 'Total Customers', value: '8', icon: Users },
  { title: 'VIP Customers', value: '2', icon: null },
  { title: 'Total Revenue', value: 'PHP 9,290.00', icon: null },
  { title: 'Avg. per Customer', value: 'PHP 1,161.25', icon: null },
]

export default function CustomerStatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.title}
            className="bg-white rounded-xl shadow-sm p-5 transition-shadow hover:shadow-md"
          >
            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
            <div className="flex items-center gap-2 mt-2">
              {Icon && (
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-purple-600" />
                </div>
              )}
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
