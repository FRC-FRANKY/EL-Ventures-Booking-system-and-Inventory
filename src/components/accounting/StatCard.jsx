import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'

const accentColors = {
  green: 'border-l-green-500',
  blue: 'border-l-blue-500',
  purple: 'border-l-purple-500',
  orange: 'border-l-orange-500',
}

const growthColors = {
  green: 'text-green-600',
  blue: 'text-blue-600',
  purple: 'text-purple-600',
  orange: 'text-orange-600',
}

export default function StatCard({ title, value, growth, note, accentColor, showTrend = true }) {
  const borderClass = accentColors[accentColor] || 'border-l-gray-400'
  const textClass = growthColors[accentColor] || 'text-gray-600'
  const isNegative = growth && growth.startsWith('-')

  return (
    <div className={`bg-white rounded-xl shadow-sm border-l-4 ${borderClass} p-4 transition-shadow hover:shadow-md`}>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {showTrend && growth && (
        <p className={`text-sm mt-1 flex items-center gap-1 ${isNegative ? 'text-blue-600' : textClass}`}>
          {isNegative ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
          {growth}
        </p>
      )}
      {note && (
        <p className="text-sm mt-1 flex items-center gap-1 text-orange-600">
          <AlertTriangle className="w-4 h-4" />
          {note}
        </p>
      )}
    </div>
  )
}
