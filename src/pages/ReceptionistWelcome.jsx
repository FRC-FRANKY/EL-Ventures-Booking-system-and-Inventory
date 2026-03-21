import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Sparkles, UserRound } from 'lucide-react'
import { auth } from '../firebase'
import { createLoginHistorySession } from '../utils/firebaseHelpers'

export default function ReceptionistWelcome() {
  const navigate = useNavigate()
  const location = useLocation()

  const username = location.state?.username
  const branch = location.state?.branch || 'Mandaue City Branch'
  const displayName = username || 'Receptionist'

  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)

  useEffect(() => {
    if (!username) navigate('/login/receptionist', { replace: true })
  }, [username, navigate])

  const backgroundCircles = useMemo(
    () => [
      { id: 1, size: 220, left: '8%', top: '18%', delay: 0, duration: 9 },
      { id: 2, size: 180, left: '78%', top: '12%', delay: 0.4, duration: 10 },
      { id: 3, size: 260, left: '65%', top: '72%', delay: 0.2, duration: 12 },
    ],
    []
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = fullName.trim()

    if (!trimmed) {
      setError('Full name is required.')
      setShakeKey((prev) => prev + 1)
      return
    }

    const user = auth.currentUser
    if (!user) {
      navigate('/login/receptionist')
      return
    }

    setLoading(true)
    setError('')

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

      const result = await createLoginHistorySession(
        user.uid,
        {
        fullName: trimmed,
        username,
        branch,
        loginAt,
        logoutAt: '—',
        duration: '—',
        startedAtMs: now.getTime(),
        },
        branch
      )

      localStorage.setItem('currentReceptionistSessionId', result.sessionId)
      localStorage.setItem('currentReceptionistSessionBasePath', result.basePath)
      localStorage.setItem('currentReceptionistSessionStartedAtMs', String(now.getTime()))
      localStorage.setItem('currentReceptionistLoginUid', user.uid)
    } catch {
      // ignore errors saving history
    } finally {
      setLoading(false)
    }

    navigate('/receptionist/dashboard', {
      state: { fullName: fullName.trim(), branch, fromWelcome: true },
    })
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#C2185B] via-[#EC407A] to-[#F8BBD0] px-4 py-8">
      {/* Animated gradient glow */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.30), transparent 42%), radial-gradient(circle at 80% 15%, rgba(236,64,122,0.40), transparent 38%), radial-gradient(circle at 50% 85%, rgba(194,24,91,0.32), transparent 40%)',
          backgroundSize: '140% 140%',
        }}
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
      />

      {/* Floating blurred shapes */}
      {backgroundCircles.map((c) => (
        <motion.div
          key={c.id}
          aria-hidden="true"
          className="absolute rounded-full bg-pink-100/45 blur-2xl"
          style={{
            width: c.size,
            height: c.size,
            left: c.left,
            top: c.top,
          }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: c.duration, repeat: Infinity, delay: c.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* Low-opacity brand watermark */}
      <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 select-none text-center opacity-10">
        <motion.div
          animate={{ opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="text-5xl font-extrabold tracking-widest text-white/90"
        >
          EL GLAMOROUS
        </motion.div>
      </div>

      {/* Logout */}
      <Link
        to="/login/receptionist"
        className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-2 text-sm font-medium text-white/95 backdrop-blur-md transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        <ArrowLeft className="h-4 w-4" />
        Logout
      </Link>

      <motion.section
        key={shakeKey}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md rounded-3xl border border-white/45 bg-white/80 p-6 shadow-[0_30px_90px_-30px_rgba(255,255,255,0.25)] backdrop-blur-md sm:p-8"
      >
        {/* subtle inner glow */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 to-white/10" />

        <div className="relative">
          <div className="flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C2185B] to-[#EC407A] shadow-lg">
              <UserRound className="h-7 w-7 text-white" />
            </div>
          </div>

          <div className="mt-5 text-center">
            <p className="text-sm font-semibold tracking-wide text-slate-900/80">
              Welcome back,
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">
              <span className="bg-gradient-to-r from-[#C2185B] via-[#EC407A] to-[#F48FB1] bg-clip-text text-transparent">
                {displayName}
              </span>
            </h1>
            <p className="mt-3 text-sm text-slate-700 sm:text-base">
              Let&apos;s get you set up to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div className="space-y-2">
              <label htmlFor="welcome-fullname" className="block text-sm font-semibold text-slate-800">
                Full Name
              </label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#C2185B]" />
                <motion.input
                  id="welcome-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value)
                    if (error) setError('')
                  }}
                  autoComplete="name"
                  autoFocus
                  placeholder="Enter your full name"
                  initial={false}
                  animate={
                    error
                      ? { x: [-6, 6, -4, 4, 0] }
                      : { x: 0 }
                  }
                  transition={{ duration: 0.25 }}
                  className={[
                    'w-full rounded-full border bg-white/70 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none',
                    'transition focus:border-pink-500 focus:ring-4 focus:ring-pink-500/30',
                    'placeholder:text-slate-500/80 border-white/60 hover:border-white/90',
                  ].join(' ')}
                />
              </div>
              <AnimatePresence>
                {error ? (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-xs font-medium text-rose-700"
                    role="alert"
                  >
                    {error}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: loading ? 1 : 1.03 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              disabled={loading}
              className="relative flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-pink-400 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_-18px_rgba(244,63,94,0.9)] transition hover:shadow-[0_24px_60px_-22px_rgba(244,63,94,1)] disabled:opacity-70"
            >
              <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition-opacity duration-200 hover:opacity-100" />

              {loading ? (
                <>
                  <motion.span
                    aria-hidden="true"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.9, ease: 'linear', repeat: Infinity }}
                    className="h-4 w-4 rounded-full border-2 border-white/50 border-t-white"
                  />
                  Processing…
                </>
              ) : (
                <>
                  Continue to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-5 text-center text-xs text-slate-700/80 sm:text-sm">
            Your name will be used to personalize your experience
          </p>

          {/* small signature */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-slate-700/70">
            <Sparkles className="h-3.5 w-3.5 text-[#C2185B]" />
            EL Ventures Incorporated
          </div>
        </div>
      </motion.section>
    </main>
  )
}
