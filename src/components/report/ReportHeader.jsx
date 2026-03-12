function formatHeaderDate(reportDate) {
  // expects MM/DD/YYYY; falls back to showing raw string if parse fails
  const m = String(reportDate || '')
  const match = m.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return reportDate || ''
  const [, mm, dd, yyyy] = match
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd))
  if (Number.isNaN(d.getTime())) return reportDate || ''
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' })
  return `${weekday}, ${mm}/${dd}`
}

export default function ReportHeader({ branch = 'Mandaue City Branch', reportDate = '07/03/2026' }) {
  return (
    <div className="bg-purple-50 rounded-xl shadow-sm p-5 text-center">
      <h2 className="text-xl font-bold text-gray-900">{branch}</h2>
      <p className="text-gray-700 mt-1">{formatHeaderDate(reportDate)}</p>
      <p className="text-sm text-gray-500 mt-0.5">12:01 PM - 09:55 PM</p>
    </div>
  )
}
