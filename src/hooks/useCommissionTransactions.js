import { useEffect, useMemo, useState } from 'react'
import {
  extractStylistsFromAppointment,
  listenToAppointments,
  listenToBranchAppointments,
  listenToServicesCatalog,
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
  if (!services) return []
  if (Array.isArray(services)) {
    return services.map((s, i) => {
      if (typeof s === 'string') return { name: s, price: 0, index: i }
      if (s && typeof s === 'object') {
        const rawPrice = s.price ?? s.amount ?? s.total ?? s.servicePrice
        return {
          name: s.name || s.serviceName || `Service ${i + 1}`,
          price: extractNumber(rawPrice) ?? 0,
          commissionRate: extractNumber(s.commissionRate),
          commissionAmount: extractNumber(s.commissionAmount),
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
        return {
          name: s.name || s.serviceName || `Service ${i + 1}`,
          price: extractNumber(rawPrice) ?? 0,
          commissionRate: extractNumber(s.commissionRate),
          commissionAmount: extractNumber(s.commissionAmount),
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

function inferServiceBucket(serviceName) {
  const s = normalizeText(serviceName)
  if (
    s.includes('manicure') ||
    s.includes('pedicure') ||
    s.includes('nail') ||
    s.includes('gel') ||
    s.includes('polish')
  ) {
    return 'nail'
  }
  if (
    s.includes('massage') ||
    s.includes('facial') ||
    s.includes('spa') ||
    s.includes('scrub')
  ) {
    return 'facial-massage'
  }
  if (
    s.includes('beard') ||
    s.includes('fade') ||
    s.includes('clipper')
  ) {
    return 'barber'
  }
  if (
    s.includes('hair') ||
    s.includes('color') ||
    s.includes('treatment') ||
    s.includes('rebond') ||
    s.includes('perm') ||
    s.includes('blow')
  ) {
    return 'hair'
  }
  return 'other'
}

function roleMatchesService(stylistRoles, serviceName) {
  if (!stylistRoles || stylistRoles.length === 0) return true
  const bucket = inferServiceBucket(serviceName)
  if (bucket === 'other') return true

  const roles = stylistRoles.map((r) => normalizeText(r))
  const has = (keyword) => roles.some((r) => r.includes(keyword))

  if (bucket === 'nail') return has('nail technician') || (has('hair') && has('nail'))
  if (bucket === 'facial-massage') return has('facialist') || has('massage therapist')
  if (bucket === 'barber') return has('barber')
  if (bucket === 'hair') {
    return has('hairdresser') || has('barber') || (has('hair') && has('nail')) || has('senior hairdresser')
  }
  return true
}

function findMatchingStylistForService(branch, serviceName) {
  const roster = Array.isArray(branch) ? branch : []
  for (const stylist of roster) {
    if (roleMatchesService(stylist.roles, serviceName)) {
      return stylist.name
    }
  }
  return ''
}

function parseStylists(stylists) {
  return extractStylistsFromAppointment(stylists)
    .map((x) => cleanStylistName(x.name))
    .filter(Boolean)
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
  const [catalogMap, setCatalogMap] = useState(new Map())

  useEffect(() => {
    const unsubscribe = listenToServicesCatalog(
      (services) => {
        const map = new Map()
        for (const item of services || []) {
          const name = item?.name || item?.serviceName || item?.title || item?.service
          if (!name) continue
          map.set(String(name).toLowerCase(), {
            price:
              extractNumber(item?.price ?? item?.amount ?? item?.total ?? item?.servicePrice) ?? null,
            commissionRate: extractNumber(item?.commissionRate ?? item?.rate),
          })
        }
        setCatalogMap(map)
      },
      () => {
        // Keep data flow alive even if services catalog is unavailable.
      }
    )

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [])

  useEffect(() => {
    const branchNamesKey = Array.isArray(branchNames) ? branchNames.join('|') : ''
    const byBranch = new Map()
    const branchStatus = new Map()

    const parseAndSet = (data) => {
      const rows = []
      for (const apt of data) {
        const status = String(apt.status || '').toLowerCase()
        const paymentStatus = String(apt.paymentStatus || '').toLowerCase()
        const stylistCandidates = parseStylists(apt.stylists)
        const stylistName = stylistCandidates[0] || toDisplayList(apt.stylists)
        const stylistId = apt.stylistId || apt.stylistUid || stylistName
        const branch = apt.branchName || 'Unknown Branch'
        const dateKey = getDateKey(apt.preferredDate, apt.createdAt)
        const serviceRows = toServiceRows(apt.services)
        const stylistRoleRows = extractStylistsFromAppointment(apt.stylists).map((row) => ({
          name: cleanStylistName(row.name),
          roles: String(row.role || '')
            .split('/')
            .map((r) => normalizeText(r))
            .filter(Boolean),
        }))
        const currentStylistRoles =
          stylistRoleRows.find((row) => normalizeText(row.name) === normalizeText(stylistName))
            ?.roles || []
        const defaultRate = extractNumber(apt.commissionRate) ?? 0
        const appointmentTotal = extractNumber(apt.price || apt.totalAmount) ?? 0

        if (serviceRows.length === 0) {
          const rate = defaultRate
          const amount = Number(
            apt.commissionAmount ??
              (appointmentTotal > 0 ? (appointmentTotal * rate) / 100 : 0)
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
            dateKey,
            dateTime: formatDate(dateKey, apt.preferredTime),
            paymentStatus:
              paymentStatus === 'paid' || status === 'completed' ? 'Paid' : 'Pending',
            status,
          })
          continue
        }

        for (const serviceRow of serviceRows) {
          let resolvedStylistName = stylistName
          let resolvedStylistId = stylistId
          if (!roleMatchesService(currentStylistRoles, serviceRow.name)) {
            const reassigned = findMatchingStylistForService(stylistRoleRows, serviceRow.name)
            if (reassigned) {
              resolvedStylistName = reassigned
              resolvedStylistId = reassigned
            }
          }

          const catalog = catalogMap.get(String(serviceRow.name || '').toLowerCase())
          const price = Number(serviceRow.price || catalog?.price || 0)
          const rate = Number(serviceRow.commissionRate ?? catalog?.commissionRate ?? defaultRate)
          const amount = Number(
            serviceRow.commissionAmount ?? (price > 0 ? (price * rate) / 100 : 0)
          )
          rows.push({
            id: `${apt.id}-${serviceRow.key ?? serviceRow.index}`,
            appointmentId: apt.id,
            serviceKey: serviceRow.key,
            serviceIndex: serviceRow.index,
            stylistId: resolvedStylistId,
            stylistName: resolvedStylistName,
            branch,
            service: serviceRow.name,
            price,
            commissionRate: rate,
            commissionAmount: amount,
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
          recompute()
        },
        (err) => {
          // Single-branch mode should surface the error.
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
    }
  }, [catalogMap, branchName, Array.isArray(branchNames) ? branchNames.join('|') : ''])

  const stylists = useMemo(() => {
    const set = new Set(transactions.map((t) => t.stylistName).filter(Boolean))
    return ['All Stylists', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
  }, [transactions])

  return { loading, error, transactions, stylists }
}

