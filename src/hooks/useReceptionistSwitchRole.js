import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ref, get, update } from 'firebase/database'
import { auth, db } from '../firebase'

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

      if (user && sessionId) {
        const sessionRef = ref(db, `loginHistory/${user.uid}/${sessionId}`)
        const snap = await get(sessionRef)
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
        if (snap.exists() && snap.val().startedAtMs) {
          duration = formatDuration(snap.val().startedAtMs, now.getTime())
        }

        await update(sessionRef, {
          logoutAt,
          duration,
        })

        localStorage.removeItem('currentReceptionistSessionId')
      }
    } catch {
      // ignore
    }

    navigate('/')
  }, [navigate])
}
