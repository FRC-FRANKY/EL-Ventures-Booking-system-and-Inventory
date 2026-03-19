import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../css/pages/Login.css'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { ref, set } from 'firebase/database'

function EyeIcon() {
  return (
    <svg
      className="login-input__toggle-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg
      className="login-input__toggle-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-7-11-7a18.45 18.45 0 0 1 5.11-5.11" />
      <path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88" />
      <path d="M1 1l22 22" />
    </svg>
  )
}

export default function ReceptionistSignUp() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [branch, setBranch] = useState('Mandaue City Branch')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const emailNormalized = email.trim().toLowerCase()
      const userCred = await createUserWithEmailAndPassword(auth, emailNormalized, password)

      await updateProfile(userCred.user, {
        displayName: fullName.trim(),
      })

      const userRef = ref(db, `receptionists/${userCred.user.uid}`)
      await set(userRef, {
        fullName: fullName.trim(),
        email: emailNormalized,
        branch,
        createdAt: new Date().toISOString(),
      })

      navigate('/receptionist/welcome', {
        state: { fullName: fullName.trim(), branch },
      })
    } catch (err) {
      setError(err?.message || 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page login-page--receptionist">
      <Link to="/" className="login-page__back-link">
        <span className="login-page__back-arrow">←</span> Back to Role Selection
      </Link>

      <div className="login-card login-card--max-md">
        <h1 className="login-card__title">Receptionist Sign Up</h1>
        <p className="login-card__subtitle">
          Create your receptionist account to access the dashboard.
        </p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="login-form__error" role="alert">
              {error}
            </div>
          )}

          <label className="login-form__label" htmlFor="signup-fullname">
            Full Name
          </label>
          <input
            id="signup-fullname"
            type="text"
            className="login-input"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            autoFocus
          />

          <label className="login-form__label" htmlFor="signup-email">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            className="login-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <label className="login-form__label" htmlFor="signup-branch">
            Branch
          </label>
          <select
            id="signup-branch"
            className="login-input"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          >
            <option value="Mandaue City Branch">Mandaue City Branch</option>
            <option value="Pusok Branch">Pusok Branch</option>
            <option value="Pajac Branch">Pajac Branch</option>
            <option value="Cebu City Branch">Cebu City Branch</option>
          </select>

          <label className="login-form__label" htmlFor="signup-password">
            Password
          </label>
          <div className="login-input-wrap">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              className="login-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
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

          <label className="login-form__label" htmlFor="signup-confirm-password">
            Confirm Password
          </label>
          <div className="login-input-wrap">
            <input
              id="signup-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              className="login-input"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="login-input__toggle"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            <span>{loading ? 'Creating account…' : 'Sign Up'}</span>
          </button>
        </form>
      </div>
    </div>
  )
}

