export default function VIPCustomerCard({ name, phone, totalSpent, visits }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-card hover:shadow-card-hover transition-shadow">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{name}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">{phone}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-emerald-700">{totalSpent}</p>
        <p className="text-sm text-slate-500">{visits} visits</p>
      </div>
    </div>
  )
}
