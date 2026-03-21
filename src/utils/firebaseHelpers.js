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
  if (!value) return []

  const aliases = new Set([value])
  // Handle common naming mismatch: "Mandaue City Branch" vs "Mandaue Branch"
  if (value.includes(' City Branch')) aliases.add(value.replace(' City Branch', ' Branch'))
  if (value.endsWith(' Branch') && !value.includes(' City Branch')) {
    aliases.add(value.replace(' Branch', ' City Branch'))
  }
  return Array.from(aliases)
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
      console.error('Firebase read error:', error.message)
      if (onError) onError(error)
    }
  )
}

export function listenToBranchAppointments(branchName, callback, onError) {
  const appointmentsRef = ref(db, 'appointments')
  const aliases = getBranchAliases(branchName)

  const rootByAlias = new Map()
  const branchByAlias = new Map()

  const hasAnyNumericPrice = (services) => {
    if (!services) return false
    if (Array.isArray(services)) return services.some((item) => hasAnyNumericPrice(item))
    if (typeof services === 'object') {
      const direct = services.price ?? services.amount ?? services.total ?? services.servicePrice
      if (direct != null) {
        const n = Number(String(direct).replace(/[^\d.\-]/g, ''))
        if (Number.isFinite(n) && n > 0) return true
      }
      return Object.values(services).some((value) => hasAnyNumericPrice(value))
    }
    const n = Number(String(services).replace(/[^\d.\-]/g, ''))
    return Number.isFinite(n) && n > 0
  }

  const emitMerged = () => {
    const merged = new Map()
    const rootList = Array.from(rootByAlias.values()).flat()
    const branchList = Array.from(branchByAlias.values()).flat()

    // Start from root appointments.
    for (const item of rootList) {
      merged.set(item.id, item)
    }

    // Branch appointments should override root fields (especially status/services).
    for (const item of branchList) {
      const current = merged.get(item.id) || {}
      const mergedItem = { ...current, ...item, id: item.id }

      // If branch mirror has services but without prices, preserve priced root services.
      if (
        current?.services != null &&
        item?.services != null &&
        !hasAnyNumericPrice(item.services)
      ) {
        mergedItem.services = current.services
      }

      merged.set(item.id, mergedItem)
    }

    callback(Array.from(merged.values()))
  }

  const unsubs = []
  for (const alias of aliases) {
    const branchQuery = query(appointmentsRef, orderByChild('branchName'), equalTo(alias))
    const branchAppointmentsRef = ref(db, `branches/${alias}/appointments`)

    const unsubRoot = onValue(
      branchQuery,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val()
          rootByAlias.set(
            alias,
            Object.entries(data).map(([id, val]) => ({ id, ...val }))
          )
        } else {
          rootByAlias.set(alias, [])
        }
        emitMerged()
      },
      (error) => {
        console.error('Firebase read error:', error.message)
        if (onError) onError(error)
      }
    )

    const unsubBranch = onValue(
      branchAppointmentsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val()
          branchByAlias.set(
            alias,
            Object.entries(data).map(([id, val]) => ({ id, ...val }))
          )
        } else {
          branchByAlias.set(alias, [])
        }
        emitMerged()
      },
      (error) => {
        console.error('Firebase branch read error:', error.message)
        if (onError) onError(error)
      }
    )

    unsubs.push(unsubRoot, unsubBranch)
  }

  return () => {
    unsubs.forEach((u) => u())
  }
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
      console.error('Firebase read error:', error.message)
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

  try {
    await update(rootPath, payload)
    return
  } catch (error) {
    if (!branchId) throw error
    const branchPath = ref(db, `branches/${branchId}/appointments/${appointmentId}`)
    await update(branchPath, payload)
  }
}

export async function updateAppointmentDetails(appointmentId, payload, branchId) {
  const rootPath = ref(db, `appointments/${appointmentId}`)
  try {
    await update(rootPath, payload)
    return
  } catch (error) {
    if (!branchId) throw error
    const branchPath = ref(db, `branches/${branchId}/appointments/${appointmentId}`)
    await update(branchPath, payload)
  }
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
      console.error('Firebase services read error:', error.message)
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
