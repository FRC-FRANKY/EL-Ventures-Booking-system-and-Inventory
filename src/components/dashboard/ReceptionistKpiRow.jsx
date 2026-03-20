import { Calendar, UserCheck, Clock, Users } from 'lucide-react'
import KpiStatCard from '../dashboard-ui/KpiStatCard'

export default function ReceptionistKpiRow() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiStatCard
        title="Appointments today"
        value="12"
        trend="+3 vs yesterday"
        trendTone="positive"
        subtitle="Scheduled slots"
        icon={Calendar}
        delay={0.05}
      />
      <KpiStatCard
        title="Visitors logged"
        value="28"
        trend="Front desk"
        trendTone="neutral"
        subtitle="Since open"
        icon={UserCheck}
        delay={0.1}
      />
      <KpiStatCard
        title="Pending requests"
        value="5"
        trend="2 urgent"
        trendTone="neutral"
        subtitle="Confirmations"
        icon={Clock}
        delay={0.15}
      />
      <KpiStatCard
        title="Walk-ins"
        value="4"
        trend="Peak 11am–2pm"
        trendTone="positive"
        subtitle="Today"
        icon={Users}
        delay={0.2}
      />
    </section>
  )
}
