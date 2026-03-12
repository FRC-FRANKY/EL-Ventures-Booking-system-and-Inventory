import { Calendar, ChevronDown, Printer, Download } from 'lucide-react'

export default function ReportFilters({
  reportDate,
  branch,
  onReportDateChange,
  onBranchChange,
  onPrint,
  onExport,
}) {
  return (
    <div className="bg-gray-100 rounded-xl shadow-sm p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 items-end">
        <div className="flex-1 min-w-[140px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Report Date
          </label>
          <div className="relative">
            <input
              type="text"
              value={reportDate}
              onChange={(e) => onReportDateChange?.(e.target.value)}
              className="w-full pl-3 pr-10 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Branch
          </label>
          <div className="relative">
            <select
              value={branch}
              onChange={(e) => onBranchChange?.(e.target.value)}
              className="w-full pl-3 pr-10 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
            >
              <option>Mandaue City Branch</option>
              <option>Pusok Branch</option>
              <option>Pajac Branch</option>
              <option>Cebu City Branch</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
    </div>
  )
}
