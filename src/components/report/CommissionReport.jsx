import { Pencil } from 'lucide-react'

export default function CommissionReport({ data, onEditRate }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900">Commission Report</h3>
      {data.length === 0 ? (
        <div className="rounded-xl bg-white p-6 text-sm text-gray-500 shadow-sm">
          No commission records found
        </div>
      ) : (
        data.map((group) => (
          <div key={group.date}>
            <h4 className="mb-3 text-base font-bold text-gray-800">{group.date}</h4>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Stylist
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Commission Rate
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Commission Amount
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.entries.map((entry) => (
                      <tr
                        key={entry.id}
                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-gray-900">{entry.stylist}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{entry.service}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">PHP {entry.price.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          {entry.rate > 0 ? (
                            <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                              {(entry.rate * 100).toFixed(2)}%
                            </span>
                          ) : (
                            <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-100 text-amber-800">
                              No rate set
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-green-600">
                          PHP {entry.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => onEditRate?.({ ...entry, date: group.date })}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit Rate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
