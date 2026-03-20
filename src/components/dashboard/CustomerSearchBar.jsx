import { Search } from 'lucide-react'

export default function CustomerSearchBar({ query, onQueryChange }) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
      <input
        type="text"
        placeholder="Search by name, phone, or email…"
        value={query}
        onChange={(e) => onQueryChange?.(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white/80 pl-12 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-300/50 shadow-sm backdrop-blur-sm"
      />
    </div>
  )
}
