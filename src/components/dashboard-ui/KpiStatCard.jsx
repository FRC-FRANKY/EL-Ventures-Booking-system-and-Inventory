import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'

const toneMap = {
  positive: { icon: TrendingUp, text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
  negative: { icon: TrendingDown, text: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/40' },
  neutral: { icon: Minus, text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' },
}

export default function KpiStatCard({
  title,
  value,
  subtitle,
  trend,
  trendTone = 'neutral',
  icon: Icon,
  delay = 0,
}) {
  const tone = toneMap[trendTone] || toneMap.neutral
  const TrendIcon = tone.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-violet-500/10 via-fuchsia-500/10 to-[#F48FB1]/10 blur-2xl transition-opacity group-hover:opacity-100" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {value}
          </p>
          {subtitle ? (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
          ) : null}
        </div>
        {Icon ? (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#C2185B]/15 via-[#EC407A]/15 to-[#F48FB1]/15 text-[#C2185B] dark:text-fuchsia-200">
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
      </div>
      {trend ? (
        <div
          className={`relative mt-3 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium ${tone.text} ${tone.bg}`}
        >
          <TrendIcon className="h-3.5 w-3.5" />
          {trend}
        </div>
      ) : null}
    </motion.div>
  )
}
