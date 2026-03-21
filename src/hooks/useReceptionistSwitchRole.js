import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import { updateLoginHistorySession } from '../utils/firebaseHelpers'

function formatDuration(startMs, endMs) {
  if (!startMs || !endMs || endMs <= startMs) return '—'
  const diffMs = endMs - startMs
  const totalMinutes = Math.max(1, Math.round(diffMs / 60000))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours && minutes) return `${hours}h ${minutes}m`
  if (hours) return `${hours}h`
  return `${minutes}m`
}

export function useReceptionistSwitchRole() {
  const navigate = useNavigate()

  return useCallback(async () => {
    try {
      const user = auth.currentUser
      const sessionId = localStorage.getItem('currentReceptionistSessionId')
      const basePath = localStorage.getItem('currentReceptionistSessionBasePath') || ''
      const startedAtRaw = localStorage.getItem('currentReceptionistSessionStartedAtMs')
      const startedAtMs = startedAtRaw ? Number(startedAtRaw) : 0
      const branchFromPath = basePath.startsWith('branches/')
        ? basePath.split('/')[1] || ''
        : ''

      if (user && sessionId) {
        const now = new Date()
        const logoutAt = now.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })

        let duration = '—'
        if (startedAtMs > 0) {
          duration = formatDuration(startedAtMs, now.getTime())
        }
        await updateLoginHistorySession(
          user.uid,
          sessionId,
          {
            logoutAt,
            duration,
            endedAtMs: now.getTime(),
          },
          branchFromPath,
          basePath
        )

        localStorage.removeItem('currentReceptionistSessionId')
        localStorage.removeItem('currentReceptionistSessionBasePath')
        localStorage.removeItem('currentReceptionistSessionStartedAtMs')
      }
    } catch {
      // ignore
    }

    navigate('/')
  }, [navigate])
}
