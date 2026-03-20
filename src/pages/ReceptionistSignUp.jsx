import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff, Lock, Mail, UserRound } from 'lucide-react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { ref, set } from 'firebase/database'
import { auth, db } from '../firebase'
import InputField from '../components/auth/InputField'
import AnimatedButton from '../components/auth/AnimatedButton'

function getPasswordStrength(value) {
  let score = 0
  if (value.length >= 8) score += 1
  if (/[A-Z]/.test(value)) score += 1
  if (/[0-9]/.test(value)) score += 1
  if (/[^A-Za-z0-9]/.test(value)) score += 1

  if (score <= 1) return { label: 'Weak', width: '25%', color: 'bg-rose-500' }
  if (score === 2) return { label: 'Fair', width: '50%', color: 'bg-amber-500' }
  if (score === 3) return { label: 'Good', width: '75%', color: 'bg-fuchsia-500' }
  return { label: 'Strong', width: '100%', color: 'bg-emerald-500' }
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
  const [focusedField, setFocusedField] = useState('')
  const [shakeKey, setShakeKey] = useState(0)

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password])
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword

  const particles = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        size: 8 + i * 2,
        left: `${10 + i * 10}%`,
        top: `${8 + (i % 4) * 20}%`,
        delay: i * 0.35,
        duration: 4.5 + i * 0.25,
      })),
    []
  )

  const triggerError = (message) => {
    setError(message)
    setShakeKey((prev) => prev + 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      triggerError('Please fill in all fields.')
      return
    }
    if (password !== confirmPassword) {
      triggerError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      triggerError('Password must be at least 8 characters long.')
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
      triggerError(err?.message || 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#C2185B] via-[#EC407A] to-[#F8BBD0] px-4 py-8 sm:px-6">
      <motion.div
        aria-hidden="true"
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            'radial-gradient(circle at 18% 18%, rgba(255,255,255,0.28), transparent 42%), radial-gradient(circle at 78% 16%, rgba(236,64,122,0.42), transparent 38%), radial-gradient(circle at 52% 84%, rgba(194,24,91,0.34), transparent 40%)',
          backgroundSize: '140% 140%',
        }}
      />

      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          aria-hidden="true"
          className="absolute rounded-full bg-pink-100/35 blur-[1px]"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.left,
            top: particle.top,
          }}
          animate={{ y: [0, -14, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 w-full max-w-md"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-4 py-2 text-sm font-medium text-pink-50 transition hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Role Selection
          </Link>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative w-full max-w-md rounded-3xl border border-white/50 bg-white/80 p-6 shadow-[0_30px_90px_-30px_rgba(136,19,74,0.5)] backdrop-blur-md sm:p-8"
          aria-label="Receptionist signup"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/60 to-white/15" />
          <div className="relative">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Receptionist Sign Up
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Create your account to access the EL Ventures receptionist workspace.
              </p>
            </div>

            <motion.form
              key={shakeKey}
              animate={error ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.36 }}
              onSubmit={handleSubmit}
              className="space-y-4"
              noValidate
            >
              <InputField
                id="signup-fullname"
                label="Full Name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                icon={UserRound}
                placeholder="Enter your full name"
                autoComplete="name"
                autoFocus
                focused={focusedField === 'fullName'}
                onFocus={() => setFocusedField('fullName')}
                onBlur={() => setFocusedField('')}
                theme={{
                  inputBorder: 'border-white/45',
                  inputFocusBorder: 'focus:border-pink-500',
                  inputFocusRing: 'focus:ring-pink-500/30',
                }}
              />

              <InputField
                id="signup-email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                placeholder="you@elventures.com"
                autoComplete="email"
                focused={focusedField === 'email'}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
                theme={{
                  inputBorder: 'border-white/45',
                  inputFocusBorder: 'focus:border-pink-500',
                  inputFocusRing: 'focus:ring-pink-500/30',
                }}
              />

              <div className="space-y-2">
                <label
                  htmlFor="signup-branch"
                  className="block text-sm font-medium text-slate-700"
                >
                  Branch
                </label>
                <select
                  id="signup-branch"
                  className="w-full rounded-xl border border-white/45 bg-white/70 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-500/30"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                >
                  <option value="Mandaue City Branch">Mandaue City Branch</option>
                  <option value="Pusok Branch">Pusok Branch</option>
                  <option value="Pajac Branch">Pajac Branch</option>
                  <option value="Cebu City Branch">Cebu City Branch</option>
                </select>
              </div>

              <InputField
                id="signup-password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                placeholder="Enter your password"
                autoComplete="new-password"
                focused={focusedField === 'password'}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('')}
                theme={{
                  inputBorder: 'border-white/45',
                  inputFocusBorder: 'focus:border-pink-500',
                  inputFocusRing: 'focus:ring-pink-500/30',
                }}
                rightElement={
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="rounded-md p-1 text-slate-500 transition hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </motion.button>
                }
              />

              <div className="space-y-1">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <motion.div
                    animate={{ width: password ? passwordStrength.width : '0%' }}
                    transition={{ duration: 0.25 }}
                    className={`h-full rounded-full ${passwordStrength.color}`}
                  />
                </div>
                <p className="text-xs text-slate-600">
                  Password strength: {password ? passwordStrength.label : '—'}
                </p>
              </div>

              <InputField
                id="signup-confirm-password"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={Lock}
                placeholder="Confirm your password"
                autoComplete="new-password"
                focused={focusedField === 'confirmPassword'}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField('')}
                theme={{
                  inputBorder: 'border-white/45',
                  inputFocusBorder: 'focus:border-pink-500',
                  inputFocusRing: 'focus:ring-pink-500/30',
                }}
                rightElement={
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="rounded-md p-1 text-slate-500 transition hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
                    aria-label={
                      showConfirmPassword
                        ? 'Hide confirm password'
                        : 'Show confirm password'
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </motion.button>
                }
              />

              <AnimatePresence>
                {confirmPassword.length > 0 && !passwordsMatch ? (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="text-xs text-rose-600"
                  >
                    Passwords do not match.
                  </motion.p>
                ) : null}
              </AnimatePresence>

              <AnimatePresence>
                {error ? (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="rounded-lg border border-rose-300/45 bg-rose-500/15 px-3 py-2 text-sm text-rose-700"
                    role="alert"
                  >
                    {error}
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <AnimatedButton
                type="submit"
                loading={loading}
                disabled={loading}
                gradientClass="bg-gradient-to-r from-pink-600 to-pink-400"
              >
                Create Account
              </AnimatedButton>
            </motion.form>

            <p className="mt-5 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link
                to="/login/receptionist"
                className="font-medium text-pink-700 underline-offset-4 transition hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </motion.section>
      </section>
    </main>
  )
}

