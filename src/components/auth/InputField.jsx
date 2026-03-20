import { motion } from 'framer-motion'

export default function InputField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  icon: Icon,
  placeholder,
  autoComplete,
  autoFocus = false,
  rightElement = null,
  onFocus,
  onBlur,
  focused = false,
  theme = {},
}) {
  const isFloating = focused || Boolean(value)

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="relative">
        {Icon ? (
          <motion.div
            animate={focused ? { scale: 1.08 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          >
            <Icon className="h-5 w-5" />
          </motion.div>
        ) : null}

        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          placeholder={focused ? placeholder : ''}
          className={[
            'peer w-full rounded-xl border bg-white/70 px-12 py-3 text-sm text-slate-900 outline-none backdrop-blur-md transition',
            'placeholder:text-slate-400',
            'focus:ring-4',
            theme?.inputBorder || 'border-white/35',
            theme?.inputFocusBorder || 'focus:border-indigo-400',
            theme?.inputFocusRing || 'focus:ring-indigo-300/30',
            rightElement ? 'pr-12' : '',
          ].join(' ')}
          aria-label={label}
        />

        <motion.span
          initial={false}
          animate={
            isFloating
              ? { top: '-0.55rem', left: '2.75rem', scale: 0.88, opacity: 1 }
              : { top: '0.88rem', left: '3rem', scale: 1, opacity: 0.7 }
          }
          transition={{ duration: 0.18 }}
          className="pointer-events-none absolute z-10 rounded-md bg-white/85 px-1 text-xs font-medium text-slate-600"
        >
          {label}
        </motion.span>

        {rightElement ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        ) : null}
      </div>
    </div>
  )
}
