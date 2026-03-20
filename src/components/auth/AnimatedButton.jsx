import { motion } from 'framer-motion'

export default function AnimatedButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  gradientClass,
  icon: Icon,
  className = '',
}) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={[
        'relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3 text-sm font-semibold text-white transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900/40',
        gradientClass,
        disabled ? 'cursor-not-allowed opacity-80' : 'shadow-[0_10px_30px_-12px_rgba(255,255,255,0.7)]',
        className,
      ].join(' ')}
    >
      <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 hover:opacity-100 bg-white/10" />
      <span className="relative z-10 inline-flex items-center gap-2">
        {loading ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 0.85, ease: 'linear', repeat: Infinity }}
              className="h-4 w-4 rounded-full border-2 border-white/45 border-t-white"
            />
            Logging in...
          </>
        ) : (
          <>
            {children}
            {Icon ? <Icon className="h-4 w-4" /> : null}
          </>
        )}
      </span>
    </motion.button>
  )
}
