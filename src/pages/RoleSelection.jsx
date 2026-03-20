import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, UsersRound, Calculator } from 'lucide-react'

const ROLES = [
  {
    id: 'hr-manager',
    title: 'HR Manager',
    description: 'Access daily reports and employee management.',
    accent: 'from-[#9C1B5A] to-[#C2185B]',
    icon: Briefcase,
    buttonLabel: 'HR Manager',
    loginPath: '/login/hr-manager',
  },
  {
    id: 'receptionist',
    title: 'Receptionist',
    description: 'Manage appointments and customer database.',
    accent: 'from-[#C2185B] to-[#EC407A]',
    icon: UsersRound,
    buttonLabel: 'Receptionist',
    loginPath: '/login/receptionist',
  },
  {
    id: 'accounting-inventory',
    title: 'Accounting & Inventory',
    description: 'Handle inventory, sales, expenses, and receipts.',
    accent: 'from-[#D81B60] to-[#EC407A]',
    icon: Calculator,
    buttonLabel: 'Accounting',
    loginPath: '/login/accounting-inventory',
  },
]

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

function Ripple({ x, y }) {
  return (
    <motion.span
      initial={{ scale: 0, opacity: 0.45, x, y }}
      animate={{ scale: 6, opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="pointer-events-none absolute h-3 w-3 rounded-full bg-white"
    />
  )
}

function RoleCard({
  role,
  isActive,
  isLoading,
  onHover,
  onBlur,
  onSelect,
}) {
  const [ripple, setRipple] = useState(null)
  const Icon = role.icon

  const handleButtonClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setRipple({
      key: Date.now(),
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
    onSelect(role)
  }

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: 0.99 }}
      onMouseEnter={onHover}
      onMouseLeave={onBlur}
      onFocus={onHover}
      onBlur={onBlur}
      className={[
        'group relative rounded-3xl border border-white/50 bg-white/80 p-6 shadow-[0_20px_60px_-22px_rgba(136,19,74,0.45)] backdrop-blur-xl transition-all duration-300',
        'focus-within:ring-2 focus-within:ring-fuchsia-300/70',
        isActive
          ? 'ring-2 ring-pink-200/80 shadow-[0_24px_72px_-18px_rgba(194,24,91,0.42)]'
          : 'hover:shadow-[0_26px_75px_-18px_rgba(136,19,74,0.48)]',
      ].join(' ')}
      aria-live="polite"
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/60 to-white/15" />
      <div className="relative flex h-full flex-col gap-4 text-slate-900">
        <motion.div
          animate={isActive ? { rotate: [0, -8, 8, 0], y: [0, -2, 0] } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${role.accent} text-white shadow-lg`}
        >
          <Icon className="h-7 w-7" aria-hidden="true" />
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">{role.title}</h2>
          <p className="text-sm leading-relaxed text-slate-700">{role.description}</p>
        </div>

        <div className="mt-auto pt-3">
          <motion.button
            type="button"
            onClick={handleButtonClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            aria-label={`Select ${role.title} role`}
            className={[
              'relative w-full overflow-hidden rounded-xl px-4 py-3 text-sm font-semibold text-white outline-none transition-all',
              'focus-visible:ring-2 focus-visible:ring-pink-100/90 focus-visible:ring-offset-2 focus-visible:ring-offset-pink-900/40',
              `bg-gradient-to-r ${role.accent}`,
              isLoading ? 'cursor-wait opacity-80' : 'hover:shadow-[0_0_28px_rgba(255,255,255,0.35)]',
            ].join(' ')}
          >
            <AnimatePresence>
              {ripple ? <Ripple key={ripple.key} x={ripple.x} y={ripple.y} /> : null}
            </AnimatePresence>
            <span className="relative z-10 inline-flex items-center gap-2">
              {isLoading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    className="inline-block h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
                  />
                  Entering...
                </>
              ) : (
                role.buttonLabel
              )}
            </span>
          </motion.button>
        </div>
      </div>
    </motion.article>
  )
}

export default function RoleSelection() {
  const navigate = useNavigate()
  const [activeRole, setActiveRole] = useState(null)
  const [loadingRole, setLoadingRole] = useState(null)

  const particles = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        size: 6 + i * 2,
        x: `${10 + i * 11}%`,
        y: `${8 + (i % 4) * 20}%`,
        delay: i * 0.35,
        duration: 4.5 + i * 0.25,
      })),
    []
  )

  const handleSelect = (role) => {
    setLoadingRole(role.id)
    setTimeout(() => navigate(role.loginPath), 460)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#C2185B] via-[#EC407A] to-[#F8BBD0] text-slate-100">
      <motion.div
        aria-hidden="true"
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            'radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.28), transparent 42%), radial-gradient(circle at 78% 16%, rgba(236, 64, 122, 0.42), transparent 38%), radial-gradient(circle at 52% 84%, rgba(194, 24, 91, 0.34), transparent 40%)',
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
            left: particle.x,
            top: particle.y,
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

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-10 text-center"
        >
          <p className="mb-3 inline-flex rounded-full border border-white/35 bg-white/15 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-pink-50">
            Internal Access Portal
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            EL Ventures Incorporated
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-3 text-sm text-pink-50 sm:text-base"
          >
            Securely choose your workspace and continue with your daily operations.
          </motion.p>
        </motion.header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
          aria-label="Role selection cards"
        >
          {ROLES.map((role) => (
            <div key={role.id} role="listitem">
              <RoleCard
                role={role}
                isActive={activeRole === role.id}
                isLoading={loadingRole === role.id}
                onHover={() => setActiveRole(role.id)}
                onBlur={() => setActiveRole((prev) => (prev === role.id ? null : prev))}
                onSelect={handleSelect}
              />
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 0.45 }}
          className="mt-8 max-w-xl text-center text-sm text-pink-100"
        >
          Select your role to access tools tailored for your responsibilities.
        </motion.p>
      </section>
    </main>
  )
}
