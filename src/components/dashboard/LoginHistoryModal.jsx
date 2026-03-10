import { useEffect, useState } from 'react'
import { X, Clock, User } from 'lucide-react'

const SAMPLE_HISTORY = [
  {
    id: '1',
    username: 'Frank Oliver Bentoy',
    roleTag: '@receptionist1',
    loginAt: 'Mar 7, 2026 at 03:32 PM',
    logoutAt: 'Mar 7, 2026 at 03:37 PM',
    duration: '5m',
  },
  {
    id: '2',
    username: 'allienne',
    roleTag: '@receptionist1',
    loginAt: 'Mar 6, 2026 at 09:15 AM',
    logoutAt: 'Mar 6, 2026 at 05:42 PM',
    duration: '8h 27m',
  },
]

const STORAGE_KEY = 'receptionistLoginHistory'

export default function LoginHistoryModal({ onClose, title = 'Receptionist Login History' }) {
  const [records, setRecords] = useState(SAMPLE_HISTORY)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        setRecords(parsed)
      }
    } catch {
      // ignore parse errors and keep sample data
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-gray-600" />
            <h4 className="font-semibold text-gray-900">{title}</h4>
          </div>

          <div className="space-y-3">
            {records.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900">{record.username}</p>
                    <p className="text-sm text-gray-500">{record.roleTag}</p>
                    <div className="mt-2 space-y-0.5 text-sm text-gray-600">
                      <p>Login: {record.loginAt}</p>
                      <p>Logout: {record.logoutAt}</p>
                      <p>Duration: {record.duration}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
