import { useEffect, useMemo, useState } from 'react'
import { Calendar, UserCheck, Clock, Users } from 'lucide-react'
import KpiStatCard from '../dashboard-ui/KpiStatCard'
import { listenToBranchAppointments, listenToBranchVisitorLog } from '../../utils/firebaseHelpers'

function startOfDay(ts) {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export default function ReceptionistKpiRow({ branch }) {
  const [appointments, setAppointments] = useState([])
  const [visitors, setVisitors] = useState([])

  useEffect(() => {
    if (!branch) return undefined
    const unsubA = listenToBranchAppointments(branch, setAppointments)
    const unsubV = listenToBranchVisitorLog(branch, setVisitors)
    return () => {
      if (typeof unsubA === 'function') unsubA()
      if (typeof unsubV === 'function') unsubV()
    }
  }, [branch])

  const kpis = useMemo(() => {
    const now = Date.now()
    const todayStart = startOfDay(now)
    const yesterdayStart = todayStart - 86400000

    let todayApts = 0
    let yesterdayApts = 0
    let pending = 0
    let pendingToday = 0
    let walkInsFromAppointments = 0

    for (const apt of appointments) {
      const aptDate = new Date(apt.preferredDate)
      const day = startOfDay(aptDate.getTime())
      const st = String(apt.status || '').toLowerCase()
      if (day === todayStart) {
        todayApts += 1
        if (st === 'pending') pendingToday += 1
        const notes = String(apt.notes || '').toLowerCase()
        const src = String(apt.source || apt.bookingSource || '').toLowerCase()
        if (notes.includes('walk') || src.includes('walk')) walkInsFromAppointments += 1
      }
      if (day === yesterdayStart) yesterdayApts += 1
      if (st === 'pending') pending += 1
    }

    let visitorsToday = 0
    let walkInVisitors = 0
    let inNow = 0
    for (const v of visitors) {
      const checked = v.checkedInAt || v.time
      const t = typeof checked === 'number' ? checked : new Date(checked).getTime()
      if (!Number.isFinite(t)) continue
      if (startOfDay(t) === todayStart) {
        visitorsToday += 1
        const purpose = String(v.purpose || v.reason || '').toLowerCase()
        if (purpose.includes('walk')) walkInVisitors += 1
      }
      if (String(v.status || '').toLowerCase() === 'in') inNow += 1
    }

    const walkIns = Math.max(walkInVisitors, walkInsFromAppointments)
    const deltaDay = todayApts - yesterdayApts
    const trendDay =
      yesterdayApts === 0
        ? todayApts > 0
          ? 'First bookings today'
          : 'No bookings yet'
        : `${deltaDay >= 0 ? '+' : ''}${deltaDay} vs yesterday`

    const dayTrendPositive = yesterdayApts === 0 ? todayApts > 0 : deltaDay >= 0

    const urgent =
      pendingToday > 0 ? `${pendingToday} need today` : pending > 0 ? `${pending} total pending` : 'All clear'

    return {
      todayApts,
      trendDay,
      visitorsToday,
      inNow,
      pending,
      urgent,
      walkIns,
      dayTrendPositive,
    }
  }, [appointments, visitors])

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiStatCard
        title="Appointments today"
        value={String(kpis.todayApts)}
        trend={kpis.trendDay}
        trendTone={kpis.dayTrendPositive ? 'positive' : 'neutral'}
        subtitle="Scheduled for this branch"
        icon={Calendar}
        delay={0.05}
      />
      <KpiStatCard
        title="Visitors logged"
        value={String(kpis.visitorsToday)}
        trend={kpis.inNow ? `${kpis.inNow} currently in` : 'Front desk'}
        trendTone="neutral"
        subtitle="Check-ins today"
        icon={UserCheck}
        delay={0.1}
      />
      <KpiStatCard
        title="Pending requests"
        value={String(kpis.pending)}
        trend={kpis.urgent}
        trendTone="neutral"
        subtitle="Awaiting confirmation"
        icon={Clock}
        delay={0.15}
      />
      <KpiStatCard
        title="Walk-ins"
        value={String(kpis.walkIns)}
        trend="Visitor log & notes"
        trendTone="positive"
        subtitle="Today"
        icon={Users}
        delay={0.2}
      />
    </section>
  )
}
