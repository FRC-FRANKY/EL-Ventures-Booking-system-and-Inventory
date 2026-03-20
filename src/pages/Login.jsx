import { useMemo, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Calculator,
  Eye,
  EyeOff,
  Lock,
  UsersRound,
  UserRound,
} from 'lucide-react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { ref, get } from 'firebase/database'
import { auth, db } from '../firebase'
import LoginCard from '../components/auth/LoginCard'
import InputField from '../components/auth/InputField'
import AnimatedButton from '../components/auth/AnimatedButton'

const ROLE_THEMES = {
  receptionist: {
    label: 'Receptionist',
    icon: UsersRound,
    cardIcon: 'from-[#C2185B] to-[#EC407A]',
    button: 'bg-gradient-to-r from-[#C2185B] to-[#EC407A]',
    focusBorder: 'focus:border-pink-500',
    focusRing: 'focus:ring-pink-500/30',
  },
  'hr-manager': {
    label: 'HR Manager',
    icon: Briefcase,
    cardIcon: 'from-[#9C1B5A] to-[#C2185B]',
    button: 'bg-gradient-to-r from-[#9C1B5A] to-[#C2185B]',
    focusBorder: 'focus:border-pink-500',
    focusRing: 'focus:ring-pink-500/30',
  },
  'accounting-inventory': {
    label: 'Accounting & Inventory',
    icon: Calculator,
    cardIcon: 'from-[#D81B60] to-[#EC407A]',
    button: 'bg-gradient-to-r from-[#D81B60] to-[#EC407A]',
    focusBorder: 'focus:border-pink-500',
    focusRing: 'focus:ring-pink-500/30',
  },
}

const SHARED_PAGE_GRADIENT =
  'from-[#C2185B] via-[#EC407A] to-[#F8BBD0]'

const DEMO_CREDENTIALS = {
  'hr-manager': { username: 'hrteam.el@gmail.com', password: 'position_hr' },
  'accounting-inventory': {
    username: 'account&inveteam.el@gmail.com',
    password: 'position_account&inve',
  },
}

export default function Login() {
  const { role } = useParams()
  const navigate = useNavigate()
  const theme = ROLE_THEMES[role]

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)
  const [focusedField, setFocusedField] = useState('')

  const particles = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        id: i,
        size: 8 + i * 2,
        left: `${8 + i * 14}%`,
        top: `${10 + (i % 4) * 18}%`,
        delay: i * 0.35,
        duration: 4.6 + i * 0.35,
      })),
    []
  )

  const isReceptionist = role === 'receptionist'
  const isHrManager = role === 'hr-manager'
  const isAccounting = role === 'accounting-inventory'

  const usernameLabel = isReceptionist ? 'Email' : 'Username'
  const usernameType = isReceptionist ? 'email' : 'text'

  const triggerError = (message) => {
    setError(message)
    setShakeKey((prev) => prev + 1)
  }

  const navigateWithSuccess = (path, state) => {
    setIsSuccess(true)
    setTimeout(() => navigate(path, { state }), 420)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const trimmedUsername = username.trim()
    const trimmedPassword = password.trim()

    if (!trimmedUsername || !trimmedPassword) {
      triggerError(
        isReceptionist
          ? 'Please enter both email and password.'
          : 'Please enter both username and password.'
      )
      return
    }

    if (!theme) {
      triggerError('Login for this role is not configured yet.')
      return
    }

    setLoading(true)

    try {
      if (isReceptionist) {
        const credential = await signInWithEmailAndPassword(
          auth,
          trimmedUsername,
          trimmedPassword
        )
        const uid = credential.user.uid

        let branch = 'Mandaue City Branch'
        let usernameForWelcome = trimmedUsername.split('@')[0]

        try {
          const snap = await get(ref(db, `receptionists/${uid}`))
          if (snap.exists()) {
            const profile = snap.val()
            if (profile.branch) branch = profile.branch
            if (profile.username) usernameForWelcome = profile.username
          }
        } catch {
          // keep default values when profile fetch fails
        }

        navigateWithSuccess('/receptionist/welcome', {
          username: usernameForWelcome,
          branch,
        })
        return
      }

      if (isHrManager) {
        const demo = DEMO_CREDENTIALS['hr-manager']
        if (trimmedUsername === demo.username && trimmedPassword === demo.password) {
          navigateWithSuccess('/hr-manager/dashboard', {
            fullName: 'HR Recel Orcales',
          })
          return
        }
        triggerError('Invalid username or password. Please try again.')
        return
      }

      if (isAccounting) {
        const demo = DEMO_CREDENTIALS['accounting-inventory']
        if (trimmedUsername === demo.username && trimmedPassword === demo.password) {
          navigateWithSuccess('/accounting-inventory/dashboard', {
            username: trimmedUsername,
          })
          return
        }
        triggerError('Invalid username or password. Please try again.')
        return
      }
    } catch {
      triggerError(
        isReceptionist
          ? 'Invalid email or password. Please try again.'
          : 'Unable to sign in right now. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (!theme) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-8 text-center text-white backdrop-blur-md">
          Unknown role. Please go back and choose a valid role.
        </div>
      </main>
    )
  }

  const RoleIcon = theme.icon

  return (
    <main
      className={`relative min-h-screen overflow-hidden bg-gradient-to-br ${SHARED_PAGE_GRADIENT} px-4 py-8 sm:px-6`}
    >
      <motion.div
        aria-hidden="true"
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 12% 20%, rgba(255,255,255,0.24), transparent 35%), radial-gradient(circle at 82% 14%, rgba(236,64,122,0.40), transparent 34%), radial-gradient(circle at 44% 90%, rgba(194,24,91,0.30), transparent 36%)',
          backgroundSize: '145% 145%',
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
          animate={{ y: [0, -14, 0], opacity: [0.2, 0.45, 0.2] }}
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

        <LoginCard
          roleName={theme.label}
          title={`${theme.label} Login`}
          subtitle="Sign in to access your EL Ventures workspace."
          icon={RoleIcon}
          iconGradientClass={theme.cardIcon}
        >
          <motion.form
            key={shakeKey}
            animate={error ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.36 }}
            onSubmit={handleSubmit}
            className="space-y-4"
            noValidate
          >
            <InputField
              id={`${role}-username`}
              label={usernameLabel}
              type={usernameType}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              icon={UserRound}
              placeholder={isReceptionist ? 'name@elventures.com' : 'Enter your username'}
              autoComplete={isReceptionist ? 'email' : 'username'}
              autoFocus
              focused={focusedField === 'username'}
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField('')}
              theme={{
                inputBorder: 'border-white/30',
                inputFocusBorder: theme.focusBorder,
                inputFocusRing: theme.focusRing,
              }}
            />

            <InputField
              id={`${role}-password`}
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              placeholder="Enter your password"
              autoComplete="current-password"
              focused={focusedField === 'password'}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField('')}
              theme={{
                inputBorder: 'border-white/30',
                inputFocusBorder: theme.focusBorder,
                inputFocusRing: theme.focusRing,
              }}
              rightElement={
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="rounded-md p-1 text-slate-500 transition hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={showPassword ? 'hide' : 'show'}
                      initial={{ opacity: 0, rotate: -20, scale: 0.9 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 20, scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                      className="inline-flex"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              }
            />

            <AnimatePresence>
              {error ? (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="rounded-lg border border-rose-300/35 bg-rose-500/15 px-3 py-2 text-sm text-rose-100"
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
              gradientClass={theme.button}
              icon={ArrowRight}
            >
              Login
            </AnimatedButton>

            {isReceptionist ? (
              <motion.button
                type="button"
                onClick={() => navigate('/receptionist/signup')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-xl border border-white/30 bg-white/15 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                Create Receptionist Account
              </motion.button>
            ) : null}
          </motion.form>
        </LoginCard>
      </section>

      <AnimatePresence>
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-2xl border border-white/20 bg-white/15 px-6 py-5 text-center text-white"
            >
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="mx-auto mb-2 h-6 w-6 rounded-full border-2 border-white/50 border-t-white"
              />
              Redirecting...
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  )
}
