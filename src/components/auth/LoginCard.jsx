import { motion } from 'framer-motion'

export default function LoginCard({
  title,
  subtitle,
  roleName,
  icon: Icon,
  iconGradientClass,
  children,
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative w-full max-w-md rounded-3xl border border-white/30 bg-white/18 p-6 shadow-[0_30px_90px_-30px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:p-8"
      aria-label={`${roleName} login`}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 to-white/5" />
      <div className="relative">
        <motion.div
          whileHover={{ scale: 1.06, rotate: -4 }}
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${iconGradientClass} text-white shadow-lg`}
        >
          <Icon className="h-7 w-7" aria-hidden="true" />
        </motion.div>

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-white">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">{subtitle}</p>
        </div>

        {children}
      </div>
    </motion.section>
  )
}
