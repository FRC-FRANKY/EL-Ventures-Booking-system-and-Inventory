export default function VIPCustomerCard({ name, phone, totalSpent, visits }) {
  return (
    <div className="bg-white rounded-xl border border-amber-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:shadow-md transition-shadow">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{name}</span>
          <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
            Regular Customer
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">{phone}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-green-600">{totalSpent}</p>
        <p className="text-sm text-gray-500">{visits} visits</p>
      </div>
    </div>
  )
}
