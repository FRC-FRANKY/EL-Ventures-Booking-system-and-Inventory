import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import '../css/pages/ReceptionistWelcome.css'
import { auth, db } from '../firebase'
import { ref, push } from 'firebase/database'

function UserAvatarIcon() {
  return (
    <svg className="welcome-card__avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  )
}

function UserInputIcon() {
  return (
    <svg className="welcome-input__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg className="welcome-btn__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

export default function ReceptionistWelcome() {
  const navigate = useNavigate()
  const location = useLocation()
  const username = location.state?.username
  const branch = location.state?.branch || 'Mandaue City Branch'
  const [fullName, setFullName] = useState('')
  const displayName = username || 'Receptionist'

  // If this page is opened directly without username in state,
  // send the user back to the receptionist login page.
  useEffect(() => {
    if (!username) {
      navigate('/login/receptionist', { replace: true })
    }
  }, [username, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fullName.trim()) return

    const user = auth.currentUser
    if (!user) {
      navigate('/login/receptionist')
      return
    }

    try {
      const now = new Date()
      const loginAt = now.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })

      const historyRef = ref(db, `loginHistory/${user.uid}`)
      const newEntryRef = await push(historyRef, {
        fullName: fullName.trim(),
        username,
        branch,
        loginAt,
        logoutAt: '—',
        duration: '—',
        startedAtMs: now.getTime(),
      })

      localStorage.setItem('currentReceptionistSessionId', newEntryRef.key)
    } catch {
      // ignore errors saving history
    }

    navigate('/receptionist/dashboard', {
      state: { fullName: fullName.trim(), branch, fromWelcome: true },
    })
  }

  return (
    <div className="welcome-page">
      <Link to="/login/receptionist" className="welcome-page__logout">
        <span className="welcome-page__logout-arrow">←</span> Logout
      </Link>

      <div className="welcome-card">
        <div className="welcome-card__icon-wrap">
          <UserAvatarIcon />
        </div>
        <h1 className="welcome-card__title">Welcome, {displayName}!</h1>
        <p className="welcome-card__subtitle">Please enter your full name to continue</p>

        <form className="welcome-form" onSubmit={handleSubmit}>
          <label className="welcome-form__label" htmlFor="welcome-fullname">
            Full Name
          </label>
          <div className="welcome-input-wrap">
            <UserInputIcon />
            <input
              id="welcome-fullname"
              type="text"
              className="welcome-input"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              autoFocus
            />
          </div>

          <button type="submit" className="welcome-btn" disabled={!fullName.trim()}>
            Continue to Dashboard
            <ArrowRightIcon />
          </button>
        </form>

        <p className="welcome-card__helper">
          Your name will be used to personalize your experience
        </p>
      </div>
    </div>
  )
}
