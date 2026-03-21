const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function toIsoDate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Semi-monthly payroll cutoffs:
 * - 1st-15th => paid on 20th of same month
 * - 26th-last day => paid on 15th of next month
 */
export function getCutoffForPeriod(year, monthIndex, period) {
  const m0 = monthIndex - 1
  const monthName = MONTH_NAMES[m0]

  if (period === 'first') {
    const start = new Date(year, m0, 1)
    const end = new Date(year, m0, 15, 23, 59, 59, 999)
    const payDate = new Date(year, m0, 20)
    return {
      period: 'first',
      workStartIso: toIsoDate(start),
      workEndIso: toIsoDate(new Date(year, m0, 15)),
      payDateIso: toIsoDate(payDate),
      label: `1st-15th ${monthName} ${year}`,
      payLabel: `Payday: ${MONTH_NAMES[payDate.getMonth()]} ${payDate.getDate()}, ${payDate.getFullYear()}`,
    }
  }

  const lastDay = new Date(year, m0 + 1, 0).getDate()
  const startDay = Math.min(26, lastDay)
  const start = new Date(year, m0, startDay)
  const payDate = new Date(year, m0 + 1, 15)
  return {
    period: 'second',
    workStartIso: toIsoDate(start),
    workEndIso: toIsoDate(new Date(year, m0, lastDay)),
    payDateIso: toIsoDate(payDate),
    label: `${startDay}th-${lastDay} ${monthName} ${year}`,
    payLabel: `Payday: ${MONTH_NAMES[payDate.getMonth()]} ${payDate.getDate()}, ${payDate.getFullYear()}`,
  }
}

export function isDateInCutoff(isoDate, startIso, endIso) {
  const d = String(isoDate).slice(0, 10)
  return d >= startIso && d <= endIso
}
