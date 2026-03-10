import { useNavigate, useLocation } from 'react-router-dom'
import { Scissors, ChevronRight, TrendingUp, FileText } from 'lucide-react'
import Navbar from '../components/Navbar'
import StatsCard from '../components/StatsCard'
import ActivityList from '../components/ActivityList'
import QuickActions from '../components/QuickActions'

const formatDate = (date) =>
  date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

const stats = [
  {
    title: 'Total Revenue (MTD)',
    value: 'PHP 458,325.00',
    change: '+12.5% from last period',
    changePositive: true,
    accentColor: 'green',
  },
  {
    title: 'Active Employees',
    value: '18',
    change: '+2 from last period',
    changePositive: true,
    accentColor: 'blue',
  },
  {
    title: "Today's Sales",
    value: 'PHP 21,375.00',
    change: '+8.3% from last period',
    changePositive: true,
    accentColor: 'purple',
  },
  {
    title: 'Monthly Expenses',
    value: 'PHP 125,450.00',
    change: '-5.2% from last period',
    changePositive: false,
    accentColor: 'orange',
  },
]

export default function HRManagerDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const displayName = location.state?.fullName || 'HR Recel Orcales'

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                <Scissors className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  EL Ventures Incorporated Management System
                </h1>
                <p className="text-sm text-gray-500">HR Manager Portal</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Switch Role
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Welcome Banner */}
        <div className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Welcome, {displayName}
            </h2>
            <p className="text-white/90 text-sm sm:text-base mt-1">
              {formatDate(new Date())}
            </p>
          </div>
          <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 sm:w-9 sm:h-9 text-white" strokeWidth={2} />
          </div>
        </div>

        {/* Statistics Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </section>

        {/* HR Management Section */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-4">HR Management</h3>
          <button
            type="button"
            onClick={() => navigate('/hr-manager/daily-report')}
            className="w-full bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 text-left hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Daily Report</p>
              <p className="text-sm text-gray-500 mt-0.5">
                View detailed daily sales and activity reports
              </p>
            </div>
          </button>
        </section>

        {/* Bottom Grid: Recent Activity + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityList />
          <QuickActions />
        </div>
      </main>
    </div>
  )
}
