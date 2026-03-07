import { useState } from 'react'
import { Filter, Search, Calendar, ChevronDown } from 'lucide-react'

export default function FilterBar() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All Statuses')
  const [date, setDate] = useState('')
  const [stylist, setStylist] = useState('All Stylists')

  return (
    <div className="bg-gray-100 rounded-xl p-4 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-semibold text-gray-700">
            Filter Appointments
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full pl-3 pr-9 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
            >
              <option>All Statuses</option>
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="dd/mm/yyyy"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select
              value={stylist}
              onChange={(e) => setStylist(e.target.value)}
              className="w-full pl-3 pr-9 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
            >
              <option>All Stylists</option>
              <option>Maria Santos</option>
              <option>Emma Williams</option>
              <option>Lisa Cruz</option>
              <option>Ana Reyes</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  )
}
