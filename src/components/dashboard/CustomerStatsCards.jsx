import { Users } from 'lucide-react'

const stats = [
  { title: 'Total Customers', value: '8', icon: Users },
  { title: 'VIP Customers', value: '2', icon: null },
  { title: 'Total Revenue', value: 'PHP 9,290.00', icon: null },
  { title: 'Avg. per Customer', value: 'PHP 1,161.25', icon: null },
]

export default function CustomerStatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.title}
            className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-card backdrop-blur-sm transition hover:shadow-card-hover"
          >
            <p className="text-sm font-medium text-slate-600">{stat.title}</p>
            <div className="flex items-center gap-2 mt-2">
              {Icon && (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/15 via-fuchsia-500/15 to-sky-500/15">
                  <Icon className="h-5 w-5 text-violet-700" />
                </div>
              )}
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
