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
  const branchQuery = query(
    appointmentsRef,
    orderByChild('branchName'),
    equalTo(branchName)
  )
  const branchAppointmentsRef = ref(db, `branches/${branchName}/appointments`)

  let rootList = []
  let branchList = []

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

  const unsubRoot = onValue(
    branchQuery,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        rootList = Object.entries(data).map(([id, val]) => ({ id, ...val }))
      } else {
        rootList = []
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
        branchList = Object.entries(data).map(([id, val]) => ({ id, ...val }))
      } else {
        branchList = []
      }
      emitMerged()
    },
    (error) => {
      console.error('Firebase branch read error:', error.message)
      if (onError) onError(error)
    }
  )

  return () => {
    unsubRoot()
    unsubBranch()
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
