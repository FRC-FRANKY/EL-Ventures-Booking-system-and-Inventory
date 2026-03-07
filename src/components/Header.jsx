import { useNavigate } from 'react-router-dom'
import { Scissors, ChevronRight } from 'lucide-react'

export default function Header() {
  const navigate = useNavigate()

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
              <Scissors className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                EL Ventures Incorporated Management System
              </h1>
              <p className="text-sm text-gray-500">HR Manager Portal</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Switch Role
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
