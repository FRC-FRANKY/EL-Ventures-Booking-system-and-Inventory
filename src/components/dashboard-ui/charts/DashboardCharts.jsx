import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

const DEFAULT_LINE = [
  { name: 'Mon', value: 42 },
  { name: 'Tue', value: 38 },
  { name: 'Wed', value: 55 },
  { name: 'Thu', value: 48 },
  { name: 'Fri', value: 62 },
  { name: 'Sat', value: 74 },
  { name: 'Sun', value: 58 },
]

const DEFAULT_BAR = [
  { name: 'Salon', sales: 12400 },
  { name: 'Nail', sales: 8200 },
  { name: 'Clinic', sales: 9600 },
  { name: 'Retail', sales: 5100 },
]

const DEFAULT_PIE = [
  { name: 'Services', value: 58 },
  { name: 'Products', value: 24 },
  { name: 'Packages', value: 18 },
]

const PIE_COLORS = ['#7c3aed', '#ec4899', '#0ea5e9', '#22c55e', '#f59e0b']

export function TrendLineChart({ title = '7-day trend', data }) {
  const lineData = Array.isArray(data) && data.length ? data : DEFAULT_LINE
  const empty = Array.isArray(data) && data.length === 0
  return (
    <div className="h-64 w-full">
      <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">{title}</p>
      {empty ? (
        <div className="flex h-52 items-center justify-center text-sm text-slate-500">
          No appointment data for this range.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#7c3aed"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#a855f7' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export function SalesBarChart({ title = 'Sales by category', data, barMetricLabel = 'Sales' }) {
  const barData = Array.isArray(data) && data.length ? data : DEFAULT_BAR
  const empty = Array.isArray(data) && data.length === 0
  const formatBar = (v) => {
    const n = Number(v)
    if (barMetricLabel === 'Staff') return [String(n), barMetricLabel]
    return [`PHP ${n.toLocaleString()}`, barMetricLabel]
  }
  return (
    <div className="h-64 w-full">
      <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">{title}</p>
      {empty ? (
        <div className="flex h-52 items-center justify-center text-sm text-slate-500">No stylist records yet.</div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <Tooltip
              formatter={formatBar}
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                fontSize: 12,
              }}
            />
            <Bar dataKey="sales" radius={[8, 8, 0, 0]} fill="url(#barGrad)" />
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export function CategoryPieChart({ title = 'Revenue mix', data }) {
  const pieData = Array.isArray(data) && data.length ? data : DEFAULT_PIE
  const empty = Array.isArray(data) && data.length === 0
  return (
    <div className="h-64 w-full">
      <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">{title}</p>
      {empty ? (
        <div className="flex h-52 items-center justify-center text-sm text-slate-500">No status data for this range.</div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={72}
              paddingAngle={3}
            >
              {pieData.map((entry, i) => (
                <Cell key={`${entry.name}-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
