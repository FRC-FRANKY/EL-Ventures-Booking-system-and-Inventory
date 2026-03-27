import { useEffect, useMemo, useState } from 'react'
import { auth } from '../firebase'
import {
  extractStylistsFromAppointment,
  listenToAppointments,
  listenToBranchAppointments,
} from '../utils/firebaseHelpers'

function extractNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const n = Number(value.replace(/[^\d.\-]/g, ''))
    return Number.isFinite(n) ? n : null
  }
  return null
}

function toDisplayList(value) {
  if (!value) return 'N/A'
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (Array.isArray(value)) return value.map((v) => toDisplayList(v)).join(', ')
  if (typeof value === 'object') {
    const vals = Object.values(value)
      .map((item) => {
        if (typeof item === 'string' || typeof item === 'number') return String(item)
        if (item && typeof item === 'object') {
          return (
            item.name ||
            item.serviceName ||
            item.stylistName ||
            item.fullName ||
            Object.values(item).find((v) => typeof v === 'string' || typeof v === 'number') ||
            ''
          )
        }
        return ''
      })
      .filter(Boolean)
    return vals.length ? vals.join(', ') : 'N/A'
  }
  return 'N/A'
}

function toServiceRows(services) {
  const readAssignedSummary = (assignedStylists) => {
    if (!assignedStylists || typeof assignedStylists !== 'object') return { rate: null, amount: null }
    const rows = Array.isArray(assignedStylists)
      ? assignedStylists.filter((x) => x && typeof x === 'object')
      : Object.values(assignedStylists).filter((x) => x && typeof x === 'object')
    if (!rows.length) return { rate: null, amount: null }
    const firstRate = extractNumber(rows[0]?.commissionRate)
    const totalAmount = rows.reduce((sum, row) => sum + (extractNumber(row?.commissionAmount) ?? 0), 0)
    return { rate: firstRate, amount: totalAmount }
  }

  if (!services) return []
  if (Array.isArray(services)) {
    return services.map((s, i) => {
      if (typeof s === 'string') return { name: s, price: 0, index: i }
      if (s && typeof s === 'object') {
        const rawPrice = s.price ?? s.amount ?? s.total ?? s.servicePrice
        const assigned = readAssignedSummary(s.assignedStylists)
        return {
          name: s.name || s.serviceName || `Service ${i + 1}`,
          price: extractNumber(rawPrice) ?? 0,
          commissionRate: extractNumber(s.commissionRate) ?? assigned.rate,
          commissionAmount:
            extractNumber(s.totalServiceCommission) ??
            extractNumber(s.commissionAmount) ??
            assigned.amount,
          index: i,
        }
      }
      return { name: `Service ${i + 1}`, price: 0, index: i }
    })
  }
  if (typeof services === 'object') {
    return Object.entries(services).map(([k, s], i) => {
      if (typeof s === 'string') return { name: s, price: 0, key: k, index: i }
      if (s && typeof s === 'object') {
        const rawPrice = s.price ?? s.amount ?? s.total ?? s.servicePrice
        const assigned = readAssignedSummary(s.assignedStylists)
        return {
          name: s.name || s.serviceName || `Service ${i + 1}`,
          price: extractNumber(rawPrice) ?? 0,
          commissionRate: extractNumber(s.commissionRate) ?? assigned.rate,
          commissionAmount:
            extractNumber(s.totalServiceCommission) ??
            extractNumber(s.commissionAmount) ??
            assigned.amount,
          key: k,
          index: i,
        }
      }
      return { name: `Service ${i + 1}`, price: 0, key: k, index: i }
    })
  }
  return [{ name: String(services), price: 0, index: 0 }]
}

function getDateKey(preferredDate, createdAt) {
  if (preferredDate) {
    const d = new Date(preferredDate)
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  }
  if (createdAt) {
    const d = new Date(createdAt)
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  }
  return ''
}

function formatDate(dateKey, preferredTime) {
  if (!dateKey) return 'N/A'
  const d = new Date(dateKey)
  if (Number.isNaN(d.getTime())) return dateKey
  const dateText = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${dateText}${preferredTime ? ` - ${preferredTime}` : ''}`
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function cleanStylistName(label) {
  return String(label || '').trim()
}

function parseStylists(stylists) {
  return extractStylistsFromAppointment(stylists)
    .map((x) => cleanStylistName(x.name))
    .filter(Boolean)
}

function normalizeRate(value) {
  const raw = extractNumber(value) ?? 0
  if (raw <= 0) return 0
  // Rules expect decimal rate (0..1). Accept legacy percent values too.
  return raw > 1 ? raw / 100 : raw
}

function resolveStylistForService(stylistRows, serviceRow, fallbackName) {
  if (!Array.isArray(stylistRows) || stylistRows.length === 0) {
    return cleanStylistName(fallbackName) || 'Unknown Stylist'
  }

  // Prefer explicit key when services come from object maps (e.g. {"0": {...}, "1": {...}).
  const keyIndex =
    serviceRow?.key != null && String(serviceRow.key).trim() !== ''
      ? Number(serviceRow.key)
      : NaN
  if (Number.isInteger(keyIndex) && keyIndex >= 0 && stylistRows[keyIndex]?.name) {
    return cleanStylistName(stylistRows[keyIndex].name)
  }

  const rowIndex = Number(serviceRow?.index)
  if (Number.isInteger(rowIndex) && rowIndex >= 0 && stylistRows[rowIndex]?.name) {
    return cleanStylistName(stylistRows[rowIndex].name)
  }

  return cleanStylistName(fallbackName) || 'Unknown Stylist'
}

function uniqueById(list) {
  const m = new Map()
  for (const item of list || []) {
    if (!item || item.id == null) continue
    m.set(item.id, item)
  }
  return Array.from(m.values())
}

export function useCommissionTransactions({ branchName, branchNames } = {}) {
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const branchNamesKey = Array.isArray(branchNames) ? branchNames.join('|') : ''
    const byBranch = new Map()
    const branchStatus = new Map()
    let fallbackUnsub = null

    const parseAndSet = (data) => {
      const rows = []
      for (const apt of data) {
        const status = String(apt.status || '').toLowerCase()
        const paymentStatus = String(apt.paymentStatus || '').toLowerCase()
        const stylistRows = extractStylistsFromAppointment(apt.stylists)
        const stylistCandidates = parseStylists(apt.stylists)
        const stylistName = stylistCandidates[0] || toDisplayList(apt.stylists)
        const stylistId = apt.stylistId || apt.stylistUid || stylistName
        const branch = apt.branchName || 'Unknown Branch'
        const dateKey = getDateKey(apt.preferredDate, apt.createdAt)
        const serviceRows = toServiceRows(apt.services)
        const baseSalary = extractNumber(apt.baseSalary ?? apt.base ?? 0) ?? 0
        const defaultRate = normalizeRate(apt.commissionRate)
        const appointmentTotal = extractNumber(apt.price || apt.totalAmount) ?? 0

        if (serviceRows.length === 0) {
          const rate = defaultRate
          const amount = Number(
            apt.commissionAmount ??
              (appointmentTotal > 0 ? appointmentTotal * rate : 0)
          )
          rows.push({
            id: `${apt.id}-0`,
            appointmentId: apt.id,
            stylistId,
            stylistName,
            branch,
            service: toDisplayList(apt.services),
            price: appointmentTotal,
            commissionRate: rate,
            commissionAmount: amount,
            baseSalary,
            dateKey,
            dateTime: formatDate(dateKey, apt.preferredTime),
            paymentStatus:
              paymentStatus === 'paid' || status === 'completed' ? 'Paid' : 'Pending',
            status,
          })
          continue
        }

        for (const serviceRow of serviceRows) {
          const mappedStylistName = resolveStylistForService(stylistRows, serviceRow, stylistName)
          const price = Number(serviceRow.price || appointmentTotal || 0)
          const rate = normalizeRate(serviceRow.commissionRate ?? defaultRate)
          const amount = Number(
            serviceRow.commissionAmount ?? (price > 0 ? price * rate : 0)
          )
          rows.push({
            id: `${apt.id}-${serviceRow.key ?? serviceRow.index}`,
            appointmentId: apt.id,
            serviceKey: serviceRow.key,
            serviceIndex: serviceRow.index,
            stylistId: mappedStylistName,
            stylistName: mappedStylistName,
            branch,
            service: serviceRow.name,
            price,
            commissionRate: rate,
            commissionAmount: amount,
            baseSalary,
            dateKey,
            dateTime: formatDate(dateKey, apt.preferredTime),
            paymentStatus:
              paymentStatus === 'paid' || status === 'completed' ? 'Paid' : 'Pending',
            status,
          })
        }
      }

      rows.sort((a, b) => (b.dateKey || '').localeCompare(a.dateKey || ''))
      setTransactions(rows)
      setLoading(false)
    }

    const recompute = () => {
      const merged = uniqueById(Array.from(byBranch.values()).flat())
      parseAndSet(merged)
    }

    const onError = (err) => {
      if (String(err?.code || '') === 'PERMISSION_DENIED') {
        setTransactions([])
        if (!auth.currentUser) {
          setError('You are not signed in to Firebase. Please login again.')
        } else {
          setError('You do not have permission to read appointments for this branch.')
        }
        setLoading(false)
        return
      }
      setError(err?.message || 'Failed to fetch booking data.')
      setLoading(false)
    }

    setLoading(true)
    setError('')
    byBranch.clear()

    const unsubs = []

    if (branchName) {
      const unsub = listenToBranchAppointments(
        branchName,
        (data) => {
          byBranch.set(branchName, data || [])
          branchStatus.set(branchName, 'ok')
          setError('')
          recompute()
        },
        (err) => {
          if (err?.code === 'PERMISSION_DENIED' && !fallbackUnsub) {
            // Fallback path: read root appointments and filter by exact branchName locally.
            fallbackUnsub = listenToAppointments(
              (all) => {
                const filtered = (all || []).filter(
                  (row) => String(row?.branchName || '').trim() === String(branchName || '').trim()
                )
                byBranch.set(branchName, filtered)
                branchStatus.set(branchName, 'ok')
                setError('')
                recompute()
              },
              onError
            )
            return
          }
          // Single-branch mode should surface non-fallback errors.
          onError(err)
        }
      )
      unsubs.push(unsub)
    } else if (branchNamesKey) {
      for (const bn of branchNames) {
        const unsub = listenToBranchAppointments(
          bn,
          (data) => {
            byBranch.set(bn, data || [])
            branchStatus.set(bn, 'ok')
            recompute()
          },
          (err) => {
            if (err?.code === 'PERMISSION_DENIED') {
              // In all-branches mode, skip unauthorized branches.
              byBranch.set(bn, [])
              branchStatus.set(bn, 'denied')
              recompute()
              const hasReadable = Array.from(branchStatus.values()).includes('ok')
              if (!hasReadable) {
                setError('No readable branches for this account.')
                setLoading(false)
              }
              return
            }
            branchStatus.set(bn, 'error')
            onError(err)
          }
        )
        unsubs.push(unsub)
      }
    } else {
      const unsub = listenToAppointments(
        (data) => {
          byBranch.set('root', data || [])
          recompute()
        },
        onError
      )
      unsubs.push(unsub)
    }

    return () => {
      unsubs.forEach((u) => {
        if (typeof u === 'function') u()
      })
      if (typeof fallbackUnsub === 'function') fallbackUnsub()
    }
  }, [branchName, Array.isArray(branchNames) ? branchNames.join('|') : ''])

  const stylists = useMemo(() => {
    const set = new Set(transactions.map((t) => t.stylistName).filter(Boolean))
    return ['All Stylists', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
  }, [transactions])

  return { loading, error, transactions, stylists }
}

