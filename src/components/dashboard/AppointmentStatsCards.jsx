import { useEffect, useMemo, useState } from 'react'
import { Calendar, CheckCircle, Clock, Users } from 'lucide-react'
import { listenToBranchAppointments } from '../../utils/firebaseHelpers'

function parseNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const n = Number(value.replace(/[^\d.\-]/g, ''))
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

function computeServicesTotal(services) {
  if (!services) return 0
  if (Array.isArray(services)) {
    return services.reduce((sum, item) => {
      if (typeof item === 'object' && item) {
        return (
          sum +
          parseNumber(
            item.price ?? item.amount ?? item.total ?? item.servicePrice ?? item.unitPrice
          )
        )
      }
      return sum + parseNumber(item)
    }, 0)
  }
  if (typeof services === 'object') {
    return Object.values(services).reduce((sum, item) => sum + computeServicesTotal(item), 0)
  }
  return parseNumber(services)
}

export default function AppointmentStatsCards({ branch }) {
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    if (!branch) return undefined
    const unsubscribe = listenToBranchAppointments(branch, setAppointments)
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [branch])

  const stats = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let todayCount = 0
    let confirmed = 0
    let pending = 0
    let revenue = 0

    for (const apt of appointments) {
      const status = String(apt.status || '').toLowerCase()
      const aptDate = new Date(apt.preferredDate)
      aptDate.setHours(0, 0, 0, 0)
      if (aptDate.getTime() === today.getTime()) todayCount += 1
      if (status === 'confirmed') confirmed += 1
      if (status === 'pending') pending += 1

      const byPrice = parseNumber(apt.price)
      revenue += byPrice > 0 ? byPrice : computeServicesTotal(apt.services)
    }

    return [
      {
        title: "Today's Appointments",
        value: String(todayCount),
        icon: Calendar,
        iconBg: 'bg-gradient-to-br from-violet-600 to-fuchsia-500',
      },
      {
        title: 'Confirmed',
        value: String(confirmed),
        icon: CheckCircle,
        iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-400',
      },
      {
        title: 'Pending',
        value: String(pending),
        icon: Clock,
        iconBg: 'bg-gradient-to-br from-amber-400 to-rose-400',
      },
      {
        title: 'Total Revenue',
        value: `PHP ${revenue.toFixed(2)}`,
        icon: Users,
        iconBg: 'bg-gradient-to-br from-fuchsia-500 to-violet-600',
      },
    ]
  }, [appointments])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.title}
            className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 flex items-center gap-4 shadow-card backdrop-blur-sm transition-all hover:shadow-card-hover"
          >
            <div
              className={`h-12 w-12 rounded-xl ${stat.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">{stat.title}</p>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
