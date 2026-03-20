import { motion } from 'framer-motion'

const formatDate = (date) =>
  date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

export default function WelcomeGradientBanner({
  title,
  subtitle,
  date = new Date(),
  icon: Icon,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={[
        'relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-sky-500 p-6 shadow-card-hover sm:p-8',
        className,
      ].join(' ')}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-sky-400/30 blur-3xl" />
      <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-white/90 sm:text-base">{subtitle}</p>
          ) : null}
          <p className="mt-2 text-xs font-medium text-white/80 sm:text-sm">{formatDate(date)}</p>
        </div>
        {Icon ? (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-sm sm:h-16 sm:w-16">
            <Icon className="h-8 w-8 sm:h-9 sm:w-9" strokeWidth={1.75} />
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}
