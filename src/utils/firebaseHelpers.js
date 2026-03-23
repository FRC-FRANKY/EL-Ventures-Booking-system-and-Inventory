import { db } from '../firebase'
import {
  ref,
  push,
  set,
  update,
  get,
  onValue,
  query,
  orderByChild,
  equalTo,
} from 'firebase/database'

function getBranchAliases(branchName) {
  const value = String(branchName || '').trim()
  return value ? [value] : []
}

function logFirebaseError(prefix, error) {
  const code = String(error?.code || '')
  if (code === 'PERMISSION_DENIED') return
  console.error(prefix, error?.message || error)
}

const KNOWN_BRANCHES = ['Mandaue Branch', 'Pajac Branch', 'Pusok Branch', 'Cebu City Branch']

function normalizeStylistsNode(stylistsNode, branch) {
  if (!stylistsNode) return []

  const entries = Array.isArray(stylistsNode)
    ? stylistsNode.map((row, index) => [String(index), row])
    : Object.entries(stylistsNode)

  return entries
    .map(([id, row]) => {
      if (!row || typeof row !== 'object') return null
      const name = row.name || row.fullName || row.stylistName
      const role = row.role
      if (!name || !role) return null
      return { id, name: String(name), role: String(role), branch }
    })
    .filter(Boolean)
}

export function extractStylistsFromAppointment(stylistsNode) {
  if (!stylistsNode) return []

  const rows = []

  const pushRow = (name, role) => {
    const n = String(name || '').trim()
    const r = String(role || '').trim()
    if (!n) return
    rows.push({ name: n, role: r || '' })
  }

  if (Array.isArray(stylistsNode)) {
    for (const item of stylistsNode) {
      if (!item) continue
      if (typeof item === 'string') {
        pushRow(item, '')
        continue
      }
      if (typeof item === 'object') {
        pushRow(item.name || item.fullName || item.stylistName, item.role || item.position || '')
      }
    }
    return rows
  }

  if (typeof stylistsNode === 'object') {
    for (const [key, value] of Object.entries(stylistsNode)) {
      if (value === true) {
        pushRow(key, '')
        continue
      }
      if (typeof value === 'string' || typeof value === 'number') {
        pushRow(value, '')
        continue
      }
      if (value && typeof value === 'object') {
        pushRow(
          value.name || value.fullName || value.stylistName || key,
          value.role || value.position || ''
        )
      }
    }
    return rows
  }

  if (typeof stylistsNode === 'string' || typeof stylistsNode === 'number') {
    pushRow(stylistsNode, '')
  }
  return rows
}

// ─── REAL-TIME LISTENERS ─────────────────────────────────────────────

export function listenToAppointments(callback, onError) {
  const appointmentsRef = ref(db, 'appointments')

  return onValue(
    appointmentsRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const list = Object.entries(data).map(([id, val]) => ({ id, ...val }))
        callback(list)
      } else {
        callback([])
      }
    },
    (error) => {
      logFirebaseError('Firebase read error:', error)
      if (onError) onError(error)
    }
  )
}

export function listenToBranchAppointments(branchName, callback, onError) {
  const appointmentsRef = ref(db, 'appointments')
  const value = String(branchName || '').trim()
  if (!value) {
    callback([])
    return () => {}
  }

  const branchQuery = query(appointmentsRef, orderByChild('branchName'), equalTo(value))
  return onValue(
    branchQuery,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        callback(Object.entries(data).map(([id, val]) => ({ id, ...val })))
      } else {
        callback([])
      }
    },
    (error) => {
      logFirebaseError('Firebase read error:', error)
      if (onError) onError(error)
    }
  )
}

export function listenToBranchCustomers(branchId, callback, onError) {
  const customersRef = ref(db, `branches/${branchId}/customers`)

  return onValue(
    customersRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const list = Object.entries(data).map(([id, val]) => ({ id, ...val }))
        callback(list)
      } else {
        callback([])
      }
    },
    (error) => {
      logFirebaseError('Firebase read error:', error)
      if (onError) onError(error)
    }
  )
}

// ─── ONE-TIME FETCH ──────────────────────────────────────────────────

export async function fetchAppointmentsOnce() {
  const appointmentsRef = ref(db, 'appointments')
  const snapshot = await get(appointmentsRef)

  if (snapshot.exists()) {
    const data = snapshot.val()
    return Object.entries(data).map(([id, val]) => ({ id, ...val }))
  }
  return []
}

export async function fetchBranchCustomersOnce(branchId) {
  const customersRef = ref(db, `branches/${branchId}/customers`)
  const snapshot = await get(customersRef)

  if (snapshot.exists()) {
    const data = snapshot.val()
    return Object.entries(data).map(([id, val]) => ({ id, ...val }))
  }
  return []
}

export async function fetchStylists(branchName) {
  const byKey = new Map()

  const pushRows = (rows) => {
    for (const row of rows) {
      const key = `${row.branch || ''}::${row.name}`
      if (!byKey.has(key)) byKey.set(key, row)
    }
  }

  if (branchName) {
    const branchRef = ref(db, `branches/${branchName}/stylists`)
    const snap = await get(branchRef)
    if (!snap.exists()) return []
    return normalizeStylistsNode(snap.val(), branchName).map(({ name, role, branch }) => ({
      name,
      role,
      branch,
    }))
  }

  // Try root "stylists" node first (if your DB stores stylists globally).
  try {
    const rootRef = ref(db, 'stylists')
    const rootSnap = await get(rootRef)
    if (rootSnap.exists()) {
      pushRows(normalizeStylistsNode(rootSnap.val(), 'Global'))
    }
  } catch (error) {
    logFirebaseError('Firebase stylists root read error:', error)
  }

  // Also collect from known branch paths when available/allowed.
  for (const branch of KNOWN_BRANCHES) {
    try {
      const branchRef = ref(db, `branches/${branch}/stylists`)
      const snap = await get(branchRef)
      if (!snap.exists()) continue
      pushRows(normalizeStylistsNode(snap.val(), branch))
    } catch (error) {
      // Permission may differ per branch; skip inaccessible branches.
      if (String(error?.code || '') !== 'PERMISSION_DENIED') {
        logFirebaseError(`Firebase stylists read error (${branch}):`, error)
      }
    }
  }

  return Array.from(byKey.values()).map(({ name, role, branch }) => ({ name, role, branch }))
}

// ─── WRITE OPERATIONS ────────────────────────────────────────────────

export async function addCustomer(branchId, customerData) {
  const customersRef = ref(db, `branches/${branchId}/customers`)
  const newRef = push(customersRef)
  await set(newRef, customerData)
  return newRef.key
}

export async function acceptAppointment(branchId, appointmentId, appointmentData) {
  const branchApptRef = ref(db, `branches/${branchId}/appointments/${appointmentId}`)
  await set(branchApptRef, {
    ...appointmentData,
    status: 'accepted',
    acceptedAt: Date.now(),
  })
}

export async function updateAppointmentStatus(appointmentId, status, branchId) {
  const payload = { status: String(status).toLowerCase() }
  const rootPath = ref(db, `appointments/${appointmentId}`)
  await update(rootPath, payload)
}

export async function updateAppointmentDetails(appointmentId, payload, branchId) {
  const rootPath = ref(db, `appointments/${appointmentId}`)
  await update(rootPath, payload)
}

export async function updateAppointmentCommissionRate(
  appointmentId,
  commissionRate,
  branchId,
  serviceKey,
  serviceIndex
) {
  const rate = Number(commissionRate) || 0

  const resolveSnapshot = async () => {
    const rootRef = ref(db, `appointments/${appointmentId}`)
    const rootSnap = await get(rootRef)
    if (rootSnap.exists()) return { refPath: `appointments/${appointmentId}`, data: rootSnap.val() }
    return null
  }

  const resolved = await resolveSnapshot()
  if (!resolved) throw new Error('Appointment not found for commission update.')

  const payload = { commissionRate: rate }
  const amountFromPrice = (price) => Number(price || 0) * rate / 100

  if (serviceKey != null || serviceIndex != null) {
    const services = resolved.data?.services
    if (Array.isArray(services) && serviceIndex != null && services[serviceIndex]) {
      const s = services[serviceIndex]
      const price = Number(s?.price || s?.amount || s?.total || s?.servicePrice || 0)
      payload[`services/${serviceIndex}/commissionRate`] = rate
      payload[`services/${serviceIndex}/commissionAmount`] = amountFromPrice(price)
    } else if (
      services &&
      typeof services === 'object' &&
      serviceKey != null &&
      Object.prototype.hasOwnProperty.call(services, serviceKey)
    ) {
      const s = services[serviceKey]
      const price = Number(s?.price || s?.amount || s?.total || s?.servicePrice || 0)
      payload[`services/${serviceKey}/commissionRate`] = rate
      payload[`services/${serviceKey}/commissionAmount`] = amountFromPrice(price)
    }
  }

  const totalPrice = Number(resolved.data?.price || resolved.data?.totalAmount || 0)
  payload.commissionAmount = amountFromPrice(totalPrice)

  const targetRef = ref(db, resolved.refPath)
  await update(targetRef, payload)
}

function getLoginHistoryPaths(uid, branchId) {
  const paths = [`loginHistory/${uid}`, `receptionists/${uid}/loginHistory`]
  if (branchId) paths.push(`branches/${branchId}/loginHistory/${uid}`)
  return Array.from(new Set(paths))
}

export async function createLoginHistorySession(uid, payload, branchId) {
  const paths = getLoginHistoryPaths(uid, branchId)
  let lastError = null

  for (const path of paths) {
    try {
      const parentRef = ref(db, path)
      const newEntryRef = push(parentRef)
      await set(newEntryRef, payload)
      return { sessionId: newEntryRef.key, basePath: path }
    } catch (error) {
      lastError = error
    }
  }

  throw lastError || new Error('Failed to create login history session.')
}

export async function updateLoginHistorySession(
  uid,
  sessionId,
  patch,
  branchId,
  preferredBasePath
) {
  const paths = preferredBasePath
    ? [preferredBasePath, ...getLoginHistoryPaths(uid, branchId)]
    : getLoginHistoryPaths(uid, branchId)
  let lastError = null

  for (const basePath of Array.from(new Set(paths))) {
    try {
      const sessionRef = ref(db, `${basePath}/${sessionId}`)
      const snap = await get(sessionRef)
      if (!snap.exists()) continue
      await update(sessionRef, patch)
      return true
    } catch (error) {
      lastError = error
    }
  }

  if (lastError) throw lastError
  return false
}

export function listenToLoginHistory(uid, branchId, callback, onError) {
  const paths = getLoginHistoryPaths(uid, branchId)
  const byPath = new Map()
  const statusByPath = new Map(paths.map((p) => [p, 'pending']))
  const unsubs = []

  const emit = () => {
    const merged = new Map()
    for (const list of byPath.values()) {
      for (const row of list) {
        const key = row.id || `${row.startedAtMs || 0}-${row.loginAt || ''}-${row.fullName || ''}`
        if (!merged.has(key)) {
          merged.set(key, row)
        }
      }
    }
    callback(Array.from(merged.values()))
  }

  for (const path of paths) {
    const historyRef = ref(db, path)
    const unsub = onValue(
      historyRef,
      (snap) => {
        const val = snap.val() || {}
        const list = Object.entries(val).map(([id, data]) => ({ id, ...data }))
        byPath.set(path, list)
        statusByPath.set(path, 'ok')
        emit()
      },
      (error) => {
        statusByPath.set(path, error?.code === 'PERMISSION_DENIED' ? 'denied' : 'error')
        const statuses = Array.from(statusByPath.values())
        const allResolved = statuses.every((s) => s !== 'pending')
        const anyReadable = statuses.includes('ok')
        if (allResolved && !anyReadable && onError) {
          onError(error)
        }
      }
    )
    unsubs.push(unsub)
  }

  return () => {
    unsubs.forEach((u) => u())
  }
}

export function listenToAllLoginHistory(callback, onError) {
  const historyRef = ref(db, 'loginHistory')
  return onValue(
    historyRef,
    (snap) => {
      const root = snap.val() || {}
      const list = []
      for (const [uid, sessions] of Object.entries(root)) {
        if (!sessions || typeof sessions !== 'object') continue
        for (const [id, data] of Object.entries(sessions)) {
          list.push({ id, uid, ...data })
        }
      }
      callback(list)
    },
    (error) => {
      if (onError) onError(error)
    }
  )
}

export function listenToServicesCatalog(callback, onError) {
  const servicesRef = ref(db, 'services')

  return onValue(
    servicesRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback([])
        return
      }

      const raw = snapshot.val()
      const list = Object.entries(raw).map(([id, value]) => ({ id, ...value }))
      callback(list)
    },
    (error) => {
      logFirebaseError('Firebase services read error:', error)
      if (onError) onError(error)
    }
  )
}

// ─── SAFE LISTENER (with permission error handling) ──────────────────

export function safeListener(path, callback, onError) {
  const dbRef = ref(db, path)

  return onValue(
    dbRef,
    (snapshot) => {
      callback(snapshot.exists() ? snapshot.val() : null)
    },
    (error) => {
      if (error.code === 'PERMISSION_DENIED') {
        console.error(
          `Access denied to ${path}. User may not be authenticated or lacks permission.`
        )
      }
      if (onError) onError(error)
    }
  )
}
