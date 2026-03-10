import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import '../css/pages/Login.css'

const ROLE_LABELS = {
  'hr-manager': 'HR Manager',
  receptionist: 'Receptionist',
  'accounting-inventory': 'Accounting & Inventory',
}

const DEMO_CREDENTIALS = {
  receptionist: { username: 'receptionteam.el@gmail.com', password: 'position_reception' },
  'hr-manager': { username: 'hrteam.el@gmail.com', password: 'position_hr' },
  'accounting-inventory': { username: 'account&inveteam.el@gmail.com', password: 'position_account&inve' },
}

function UserIcon() {
  return (
    <svg className="login-input__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg className="login-input__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg className="login-input__toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg className="login-input__toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-7-11-7a18.45 18.45 0 0 1 5.11-5.11" />
      <path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88" />
      <path d="M1 1l22 22" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg className="login-btn__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function UserSymbolIcon() {
  return (
    <svg className="login-card__role-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  )
}

function DollarIcon() {
  return (
    <svg className="login-card__role-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

export default function Login() {
  const { role } = useParams()
  const navigate = useNavigate()
  const roleLabel = ROLE_LABELS[role] || role
  const isReceptionist = role === 'receptionist'
  const isHrManager = role === 'hr-manager'
  const isAccounting = role === 'accounting-inventory'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const trimmedUsername = username.trim()
    const trimmedPassword = password.trim()
    if (!trimmedUsername || !trimmedPassword) {
      setError('Please enter both username and password.')
      return
    }

    if (isReceptionist) {
      const demo = DEMO_CREDENTIALS.receptionist
      if (trimmedUsername === demo.username && trimmedPassword === demo.password) {
        navigate('/receptionist/welcome', { state: { username } })
        return
      }
      setError('Invalid username or password. Please try again.')
      return
    }

    if (isHrManager) {
      const demo = DEMO_CREDENTIALS['hr-manager']
      if (trimmedUsername === demo.username && trimmedPassword === demo.password) {
        navigate('/hr-manager/dashboard', { state: { fullName: 'HR Recel Orcales' } })
        return
      }
      setError('Invalid username or password. Please try again.')
      return
    }

    if (isAccounting) {
      const demo = DEMO_CREDENTIALS['accounting-inventory']
      if (trimmedUsername === demo.username && trimmedPassword === demo.password) {
        navigate('/accounting-inventory/dashboard', { state: { username: trimmedUsername } })
        return
      }
      setError('Invalid username or password. Please try again.')
      return
    }

    setError('Login for this role is not configured yet.')
  }

  if (isReceptionist) {
    return (
      <div className="login-page login-page--receptionist">
        <Link to="/" className="login-page__back-link">
          <span className="login-page__back-arrow">←</span> Back to Role Selection
        </Link>

        <div className="login-card">
          <div className="login-card__icon-wrap">
            <UserSymbolIcon />
          </div>
          <h1 className="login-card__title">Receptionist Login</h1>
          <p className="login-card__subtitle">Enter your credentials to access the receptionist portal</p>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="login-form__error" role="alert">
                {error}
              </div>
            )}

            <label className="login-form__label" htmlFor="login-username">
              Username
            </label>
            <div className="login-input-wrap">
              <UserIcon />
              <input
                id="login-username"
                type="text"
                className="login-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
              />
            </div>

            <label className="login-form__label" htmlFor="login-password">
              Password
            </label>
            <div className="login-input-wrap">
              <LockIcon />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="login-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-input__toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <button type="submit" className="login-btn">
              <span>Login</span>
              <ArrowRightIcon />
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (isHrManager) {
    return (
      <div className="login-page login-page--hr">
        <Link to="/" className="login-page__back-link">
          <span className="login-page__back-arrow">←</span> Back to Role Selection
        </Link>

        <div className="login-card">
          <div className="login-card__icon-wrap login-card__icon-wrap--purple">
            <UserSymbolIcon />
          </div>
          <h1 className="login-card__title">HR Manager Login</h1>
          <p className="login-card__subtitle">Enter your credentials to access the HR management portal.</p>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="login-form__error" role="alert">
                {error}
              </div>
            )}

            <label className="login-form__label" htmlFor="hr-login-username">
              Username
            </label>
            <div className="login-input-wrap">
              <UserIcon />
              <input
                id="hr-login-username"
                type="text"
                className="login-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
              />
            </div>

            <label className="login-form__label" htmlFor="hr-login-password">
              Password
            </label>
            <div className="login-input-wrap">
              <LockIcon />
              <input
                id="hr-login-password"
                type={showPassword ? 'text' : 'password'}
                className="login-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-input__toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <button type="submit" className="login-btn login-btn--purple">
              <span>Login</span>
              <ArrowRightIcon />
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (isAccounting) {
    return (
      <div className="login-page login-page--accounting">
        <Link to="/" className="login-page__back-link">
          <span className="login-page__back-arrow">←</span> Back to Role Selection
        </Link>

        <div className="login-card login-card--max-md">
          <div className="login-card__icon-wrap login-card__icon-wrap--purple-gradient">
            <DollarIcon />
          </div>
          <h1 className="login-card__title">Accounting & Inventory Login</h1>
          <p className="login-card__subtitle">Enter your credentials to access the Accounting & Inventory portal.</p>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="login-form__error" role="alert">
                {error}
              </div>
            )}

            <label className="login-form__label" htmlFor="accounting-login-username">
              Username
            </label>
            <div className="login-input-wrap">
              <UserIcon />
              <input
                id="accounting-login-username"
                type="text"
                className="login-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
              />
            </div>

            <label className="login-form__label" htmlFor="accounting-login-password">
              Password
            </label>
            <div className="login-input-wrap">
              <LockIcon />
              <input
                id="accounting-login-password"
                type={showPassword ? 'text' : 'password'}
                className="login-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-input__toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <button type="submit" className="login-btn login-btn--purple-gradient">
              <span>Login</span>
              <ArrowRightIcon />
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <div className="login-page__card">
        <button
          type="button"
          className="login-page__back"
          onClick={() => navigate('/')}
          aria-label="Back to role selection"
        >
          ← Back
        </button>
        <h1 className="login-page__title">EL Ventures Incorporated</h1>
        <h2 className="login-page__role">{roleLabel} Login</h2>
        <p className="login-page__placeholder">
          Login form for {roleLabel} will be implemented here.
        </p>
      </div>
    </div>
  )
}
