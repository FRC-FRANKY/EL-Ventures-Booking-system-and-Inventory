import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import '../css/pages/ReceptionistWelcome.css'

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

const STORAGE_KEY = 'receptionistLoginHistory'

export default function ReceptionistWelcome() {
  const navigate = useNavigate()
  const location = useLocation()
  const username = location.state?.username || 'receptionist1'
  const [fullName, setFullName] = useState('')
  const displayName = fullName.trim() || username

  const handleSubmit = (e) => {
    e.preventDefault()
    if (fullName.trim()) {
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
        const newRecord = {
          id: String(Date.now()),
          username: fullName.trim(),
          roleTag: `@${username}`,
          loginAt,
          logoutAt: '—',
          duration: '—',
        }
        const existingRaw = localStorage.getItem(STORAGE_KEY)
        const existing = existingRaw ? JSON.parse(existingRaw) : []
        const records = Array.isArray(existing) ? existing : []
        const updated = [newRecord, ...records]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch {
        // ignore storage errors
      }
      navigate('/receptionist/dashboard', { state: { fullName: fullName.trim(), username } })
    }
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
