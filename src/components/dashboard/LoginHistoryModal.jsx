import { useEffect, useState } from 'react'
import { X, Clock, User } from 'lucide-react'
import { auth } from '../../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { listenToAllLoginHistory, listenToLoginHistory } from '../../utils/firebaseHelpers'

function formatDuration(startMs, endMs) {
  if (!startMs || !endMs || endMs <= startMs) return '—'
  const totalMinutes = Math.max(1, Math.round((endMs - startMs) / 60000))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours && minutes) return `${hours}h ${minutes}m`
  if (hours) return `${hours}h`
  return `${minutes}m`
}

function getDisplayDuration(record) {
  if (record.duration && record.duration !== '—') return record.duration
  if (record.startedAtMs && record.endedAtMs) {
    return formatDuration(record.startedAtMs, record.endedAtMs)
  }
  if (record.startedAtMs && (!record.logoutAt || record.logoutAt === '—')) {
    return formatDuration(record.startedAtMs, Date.now())
  }
  return '—'
}

export default function LoginHistoryModal({ onClose, title = 'Receptionist Login History' }) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [readError, setReadError] = useState('')

  useEffect(() => {
    let historyUnsubs = []
    let allHistoryUnsub = null
    const authUnsub = onAuthStateChanged(auth, (user) => {
      const storedUid = localStorage.getItem('currentReceptionistLoginUid') || ''
      const uids = Array.from(new Set([user?.uid || '', storedUid].filter(Boolean)))

      if (!uids.length) {
        setRecords([])
        setReadError('No active receptionist session found.')
        setLoading(false)
        historyUnsubs.forEach((u) => u())
        historyUnsubs = []
        return
      }

      setLoading(true)
      setReadError('')
      const basePath = localStorage.getItem('currentReceptionistSessionBasePath') || ''
      const branchFromPath = basePath.startsWith('branches/')
        ? basePath.split('/')[1] || ''
        : ''

      const byUid = new Map()
      const status = new Map(uids.map((uid) => [uid, 'pending']))
      let allList = []

      const emitMerged = () => {
        const merged = []
        for (const uid of uids) {
          const list = byUid.get(uid) || []
          merged.push(...list)
        }
        if (merged.length === 0 && allList.length > 0) {
          merged.push(...allList)
        }
        merged.sort((a, b) => (b.startedAtMs || 0) - (a.startedAtMs || 0))
        setRecords(merged)
      }

      historyUnsubs.forEach((u) => u())
      historyUnsubs = uids.map((uid) =>
        listenToLoginHistory(
          uid,
          branchFromPath,
          (snap) => {
            byUid.set(uid, Array.isArray(snap) ? snap : [])
            status.set(uid, 'ok')
            emitMerged()
            const allDone = Array.from(status.values()).every((s) => s !== 'pending')
            if (allDone) setLoading(false)
          },
          (error) => {
            status.set(uid, 'error')
            const allDone = Array.from(status.values()).every((s) => s !== 'pending')
            if (!allDone) return
            setLoading(false)
            setReadError(
              error?.code === 'PERMISSION_DENIED'
                ? 'Permission denied while reading login history.'
                : 'Failed to load login history.'
            )
          }
        )
      )

      if (allHistoryUnsub) allHistoryUnsub()
      allHistoryUnsub = listenToAllLoginHistory(
        (list) => {
          allList = list
          emitMerged()
        },
        () => {
          // keep silent; user-specific history may still work
        }
      )
    })

    return () => {
      authUnsub()
      historyUnsubs.forEach((u) => u())
      if (allHistoryUnsub) allHistoryUnsub()
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

          {loading ? (
            <p className="text-sm text-gray-500">Loading login history...</p>
          ) : readError ? (
            <p className="text-sm text-rose-600">{readError}</p>
          ) : records.length === 0 ? (
            <p className="text-sm text-gray-500">No login history records yet.</p>
          ) : (
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
                      <p className="font-medium text-gray-900">{record.fullName || 'Receptionist'}</p>
                      {record.username ? (
                        <p className="text-sm text-gray-500">@{record.username}</p>
                      ) : null}
                      <div className="mt-2 space-y-0.5 text-sm text-gray-600">
                        <p>Login: {record.loginAt || '—'}</p>
                        <p>Logout: {record.logoutAt || '—'}</p>
                        <p>Duration: {getDisplayDuration(record)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
