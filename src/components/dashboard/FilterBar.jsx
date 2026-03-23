import { Filter, Search, Calendar, ChevronDown } from 'lucide-react'

export default function FilterBar({
  search,
  status,
  date,
  stylist,
  stylistOptions = [],
  onSearchChange,
  onStatusChange,
  onDateChange,
  onStylistChange,
}) {

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-card backdrop-blur-sm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#C2185B]/15 via-[#EC407A]/15 to-[#F48FB1]/15">
            <Filter className="h-4 w-4 text-[#C2185B] dark:text-[#EC407A]" />
          </div>
          <span className="text-sm font-semibold text-slate-900">
            Filter appointments
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 pl-9 text-sm text-slate-900 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-300/50"
            />
          </div>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => onStatusChange?.(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-300/50"
            >
              <option>All Statuses</option>
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="dd/mm/yyyy"
              value={date}
              onChange={(e) => onDateChange?.(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 pl-9 text-sm text-slate-900 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-300/50"
            />
          </div>
          <div className="relative">
            <select
              value={stylist}
              onChange={(e) => onStylistChange?.(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-300/50"
            >
              <option>All Stylists</option>
              {stylistOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  )
}
