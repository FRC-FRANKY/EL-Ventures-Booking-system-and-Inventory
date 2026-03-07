import { Filter, ChevronDown } from 'lucide-react'

const STYLISTS = ['All Stylists', 'Rachel Adams', 'Emma Williams', 'Sophia Martinez', 'James Taylor', 'Michael Ross']
const DATES = ['All Dates', 'Friday, March 6, 2026', 'Thursday, March 5, 2026']

export default function CommissionFilters({
  stylistFilter,
  dateFilter,
  serviceSearch,
  onStylistChange,
  onDateChange,
  onServiceSearchChange,
  onClearFilters,
  totalRecords,
  totalSales,
  totalCommission,
}) {
  return (
    <div className="bg-gray-100 rounded-xl shadow-sm p-5 space-y-4">
      <h3 className="text-lg font-bold text-gray-900">Stylist Commission Management</h3>

      <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 items-end">
        <div className="min-w-[140px] flex-1 sm:max-w-[180px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Stylist
          </label>
          <div className="relative">
            <select
              value={stylistFilter}
              onChange={(e) => onStylistChange(e.target.value)}
              className="w-full pl-3 pr-9 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
            >
              {STYLISTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="min-w-[140px] flex-1 sm:max-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Date
          </label>
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full pl-3 pr-9 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
            >
              {DATES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="min-w-[160px] flex-1 sm:max-w-[220px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Service
          </label>
          <input
            type="text"
            placeholder="e.g., Haircut"
            value={serviceSearch}
            onChange={(e) => onServiceSearchChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          <Filter className="w-4 h-4" />
          Clear Filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="rounded-xl bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-700">Total Records</p>
          <p className="text-2xl font-bold text-blue-800 mt-0.5">{totalRecords}</p>
        </div>
        <div className="rounded-xl bg-green-50 p-4">
          <p className="text-sm font-medium text-green-700">Total Sales</p>
          <p className="text-2xl font-bold text-green-800 mt-0.5">{totalSales}</p>
        </div>
        <div className="rounded-xl bg-purple-50 p-4">
          <p className="text-sm font-medium text-purple-700">Total Commission</p>
          <p className="text-2xl font-bold text-purple-800 mt-0.5">{totalCommission}</p>
        </div>
      </div>
    </div>
  )
}
