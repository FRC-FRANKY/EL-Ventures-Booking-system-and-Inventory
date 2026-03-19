import { db } from '../firebase'
import {
  ref,
  push,
  set,
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

  return onValue(
    branchQuery,
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
