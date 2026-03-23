import { useNavigate, useLocation } from 'react-router-dom'
import { Users, ClipboardList, CalendarOff, TrendingUp, FileText, UserPlus } from 'lucide-react'
import ManagementShell from '../components/shell/ManagementShell'
import WelcomeGradientBanner from '../components/dashboard-ui/WelcomeGradientBanner'
import KpiStatCard from '../components/dashboard-ui/KpiStatCard'
import PanelCard from '../components/dashboard-ui/PanelCard'
import EmployeeTablePanel from '../components/dashboard-ui/EmployeeTablePanel'
import { TrendLineChart, SalesBarChart, CategoryPieChart } from '../components/dashboard-ui/charts/DashboardCharts'
import ActivityList from '../components/ActivityList'
import QuickActions from '../components/QuickActions'

export default function HRManagerDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const displayName = location.state?.fullName || 'HR Recel Orcales'

  return (
    <ManagementShell
      module="hr"
      portalSubtitle="HR Manager Portal"
      userName={displayName}
    >
      <WelcomeGradientBanner
        title={`Welcome back, ${displayName}`}
        subtitle="Monitor workforce health, attendance, and daily operations."
        icon={TrendingUp}
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiStatCard
          title="Total employees"
          value="18"
          trend="+2 vs last month"
          trendTone="positive"
          subtitle="Active headcount"
          icon={Users}
          delay={0.05}
        />
        <KpiStatCard
          title="Attendance rate"
          value="96.4%"
          trend="+1.2% vs last week"
          trendTone="positive"
          subtitle="Branch average"
          icon={ClipboardList}
          delay={0.1}
        />
        <KpiStatCard
          title="Leave requests"
          value="5"
          trend="2 pending approval"
          trendTone="neutral"
          subtitle="This week"
          icon={CalendarOff}
          delay={0.15}
        />
        <KpiStatCard
          title="Open positions"
          value="2"
          trend="Salon · Nail"
          trendTone="neutral"
          subtitle="Recruitment"
          icon={UserPlus}
          delay={0.2}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PanelCard title="Attendance trend" description="Rolling 7-day check-ins" className="lg:col-span-2">
          <TrendLineChart title="" />
        </PanelCard>
        <PanelCard title="Department load" description="Headcount by area">
          <SalesBarChart title="" />
        </PanelCard>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PanelCard title="Leave mix" description="Types of time-off">
          <CategoryPieChart title="" />
        </PanelCard>
        <PanelCard
          title="Daily report"
          description="Sales & commission overview"
          className="lg:col-span-2"
          action={
            <button
              type="button"
              onClick={() => navigate('/hr-manager/daily-report')}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              <FileText className="h-3.5 w-3.5" />
              Open report
            </button>
          }
        >
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Review stylists, transactions, and commission breakdowns. Export or print for records.
          </p>
          <button
            type="button"
            onClick={() => navigate('/hr-manager/daily-report')}
            className="mt-4 w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-[#C2185B] transition hover:bg-violet-50 dark:border-slate-700 dark:text-fuchsia-300 dark:hover:bg-slate-800"
          >
            Go to daily report →
          </button>
        </PanelCard>
      </section>

      <PanelCard title="Employee directory" description="Snapshot of key staff">
        <EmployeeTablePanel />
      </PanelCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ActivityList />
        <QuickActions />
      </div>
    </ManagementShell>
  )
}
