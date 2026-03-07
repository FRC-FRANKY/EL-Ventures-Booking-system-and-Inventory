export default function StatsCard({ title, value, change, changePositive, accentColor }) {
  const accentClasses = {
    green: 'border-l-green-500',
    blue: 'border-l-blue-500',
    purple: 'border-l-purple-500',
    orange: 'border-l-orange-500',
  }
  const borderClass = accentClasses[accentColor] || 'border-l-gray-400'

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border-l-4 ${borderClass} p-4 transition-shadow hover:shadow-md`}
    >
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      <p
        className={`text-sm mt-1 ${
          changePositive === false ? 'text-red-600' : 'text-green-600'
        }`}
      >
        {change}
      </p>
    </div>
  )
}
