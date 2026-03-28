import { isDateInCutoff } from './payrollCutoffs'
import { normalizeStylistPayrollKey } from './firebaseHelpers'

function toStylistKey(name, fallbackId) {
  if (fallbackId) return String(fallbackId)
  return String(name || 'Unknown Stylist')
}

function resolveContractBase(branch, stylistName, payrollMapsByBranch, demoStylists) {
  const key = normalizeStylistPayrollKey(stylistName)
  const branchMap = payrollMapsByBranch[String(branch || '').trim()] || new Map()
  const fromFb = Number(branchMap.get(key)?.baseSalaryPerCutoff ?? 0) || 0
  if (fromFb > 0) return fromFb
  const fromDemo = demoStylists.find((s) => normalizeStylistPayrollKey(s.name) === key)
  return Number(fromDemo?.baseSalaryPerCutoff ?? 0) || 0
}

/**
 * @param {ReturnType<typeof import('./payrollCutoffs').getCutoffForPeriod>} cutoff
 * @param {Array<Record<string, unknown>>} transactions
 * @param {{ allBranches: boolean; payrollMapsByBranch: Record<string, Map<string, { baseSalaryPerCutoff: number }>>; demoStylists: Array<{ name: string; baseSalaryPerCutoff: number }> }} options
 */
export function groupPayrollByStylist(cutoff, transactions, options) {
  const { allBranches, payrollMapsByBranch, demoStylists = [] } = options

  const inPeriod = transactions.filter(
    (row) =>
      isDateInCutoff(row.dateKey, cutoff.workStartIso, cutoff.workEndIso) &&
      String(row.status || '').toLowerCase() === 'completed'
  )

  const grouped = inPeriod.reduce((acc, row) => {
    const stylistKey = toStylistKey(row.stylistName, row.stylistId)
    const key = allBranches ? `${String(row.branch || '').trim()}::${stylistKey}` : stylistKey

    const price = Number(row.price || 0) || 0

    if (!acc[key]) {
      acc[key] = {
        stylist: {
          id: key,
          name: row.stylistName || 'Unknown Stylist',
          branch: row.branch || '',
        },
        /** Sum of service line prices for this stylist in the period (shown in Base column). */
        serviceSalesTotal: 0,
        /** Fixed base from stylist profile / demo (added to commission for Gross pay). */
        contractBaseSalary: resolveContractBase(
          row.branch,
          row.stylistName,
          payrollMapsByBranch,
          demoStylists
        ),
        completedCount: 0,
        totalCommission: 0,
        details: [],
      }
    }

    acc[key].completedCount += 1
    acc[key].serviceSalesTotal += price
    acc[key].totalCommission += Number(row.commissionAmount || 0)

    const txnBase = Number(row.baseSalary || 0) || 0
    if (txnBase > 0) {
      acc[key].contractBaseSalary = Math.max(acc[key].contractBaseSalary, txnBase)
    }

    acc[key].details.push({
      id: row.id,
      appointmentId: row.appointmentId,
      service: row.service,
      price,
      rate: Number(row.commissionRate || 0),
      amount: Number(row.commissionAmount || 0),
      dateTime: row.dateTime,
      branch: row.branch,
    })
    return acc
  }, {})

  const rows = Object.values(grouped).map((entry) => {
    const baseSalary = entry.serviceSalesTotal
    const totalPay = Number(entry.contractBaseSalary || 0) + Number(entry.totalCommission || 0)
    return {
      ...entry,
      baseSalary,
      totalPay,
    }
  })

  rows.sort((a, b) => b.totalCommission - a.totalCommission)
  return rows
}

export function payrollSummary(rows) {
  return {
    stylistCount: rows.length,
    base: rows.reduce((s, r) => s + r.baseSalary, 0),
    commission: rows.reduce((s, r) => s + r.totalCommission, 0),
    gross: rows.reduce((s, r) => s + r.totalPay, 0),
  }
}
