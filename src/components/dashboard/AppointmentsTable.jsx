import { useEffect, useMemo, useState } from 'react'
import AppointmentRow from './AppointmentRow'
import {
  extractStylistsFromAppointment,
  listenToBranchAppointments,
  listenToServicesCatalog,
  updateAppointmentDetails,
  updateAppointmentStatus,
} from '../../utils/firebaseHelpers'

const tableDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

function classifyAppointment(apt) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const aptDate = new Date(apt.preferredDate)
  aptDate.setHours(0, 0, 0, 0)

  if (apt.status === 'completed') return 'All'
  if (aptDate.getTime() === today.getTime()) return 'Today'
  if (aptDate.getTime() > today.getTime()) return 'Upcoming'
  return 'All'
}

function formatDateTime(date, time) {
  try {
    const d = new Date(date)
    const formatted = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    return `${formatted} – ${time}`
  } catch {
    return `${date} – ${time}`
  }
}

function formatDateKey(date) {
  try {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    })
  } catch {
    return date
  }
}

function toDisplayList(value) {
  if (!value) return 'N/A'
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (Array.isArray(value)) {
    return value.map((item) => toDisplayList(item)).join(', ')
  }
  if (typeof value === 'object') {
    const entries = Object.values(value).map((item) => {
      if (typeof item === 'string' || typeof item === 'number') return String(item)
      if (item && typeof item === 'object') {
        return (
          item.name ||
          item.serviceName ||
          item.stylistName ||
          item.fullName ||
          Object.values(item).find(
            (v) => typeof v === 'string' || typeof v === 'number'
          ) ||
          ''
        )
      }
      return ''
    })
    const cleaned = entries.map(String).filter(Boolean)
    return cleaned.length ? cleaned.join(', ') : 'N/A'
  }
  return 'N/A'
}

function formatStatus(value) {
  if (!value) return 'Pending'
  const text = String(value).toLowerCase()
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function extractNumber(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^\d.\\-]/g, '')
    const n = Number(cleaned)
    return Number.isFinite(n) ? n : null
  }
  return null
}

function computeServicesTotalPrice(services) {
  if (!services) return null

  const addFromValue = (v, sumRef) => {
    if (v == null) return

    if (Array.isArray(v)) {
      v.forEach((item) => addFromValue(item, sumRef))
      return
    }

    if (typeof v === 'number' || typeof v === 'string') {
      const n = extractNumber(v)
      if (n != null) sumRef.value += n
      return
    }

    if (typeof v === 'object') {
      // Common numeric fields used by booking payloads.
      const candidateKeys = [
        'price',
        'unitPrice',
        'unit_price',
        'rate',
        'amount',
        'total',
        'totalPrice',
        'servicePrice',
      ]

      for (const k of candidateKeys) {
        if (Object.prototype.hasOwnProperty.call(v, k)) {
          const n = extractNumber(v[k])
          if (n != null) {
            sumRef.value += n
            return
          }
        }
      }

      // If object is a map (e.g., {id: {price: ...}}) or nested items,
      // walk its values.
      Object.values(v).forEach((child) => addFromValue(child, sumRef))
    }
  }

  const sumRef = { value: 0 }
  addFromValue(services, sumRef)

  // Treat 0 as missing to avoid showing PHP 0.00 when there is no price data.
  return sumRef.value > 0 ? sumRef.value : null
}

function getDefaultNote(appointment) {
  if (appointment.status === 'Completed') {
    return 'Stylist was available and the service has been completed.'
  }
  if (appointment.status === 'Confirmed') {
    return 'Stylist is scheduled and currently marked as available for this time.'
  }
  return 'Stylist availability for this time slot is not confirmed. Please verify before confirming.'
}

const STATUS_OPTIONS = ['Confirmed', 'Pending', 'Completed', 'Cancelled']

function getServicesArray(serviceText) {
  if (!serviceText || serviceText === 'N/A') return []
  return String(serviceText)
    .split(',')
    .map((s) => s.trim())
    .filter((s) => Boolean(s) && !/^PHP\s*\d|^₱\s*\d|^\d+(\.\d+)?$/.test(s))
}

function normalizeCatalogItem(item) {
  const name =
    item?.name ||
    item?.serviceName ||
    item?.title ||
    item?.service ||
    (typeof item?.id === 'string' ? item.id : '')
  const price = extractNumber(
    item?.price ?? item?.amount ?? item?.total ?? item?.servicePrice ?? item?.unitPrice
  )
  if (!name) return null
  return { name: String(name), price: price ?? null }
}

function flattenServiceItems(value) {
  if (!value) return []
  if (Array.isArray(value)) return value.flatMap((item) => flattenServiceItems(item))
  if (typeof value === 'object') {
    const looksLikeService =
      value.name != null ||
      value.serviceName != null ||
      value.title != null ||
      value.service != null
    if (looksLikeService) return [value]
    return Object.values(value).flatMap((item) => flattenServiceItems(item))
  }
  return []
}

function buildServicesPayload(selectedNames, catalog) {
  const byName = new Map(catalog.map((item) => [item.name.toLowerCase(), item]))
  return selectedNames.map((name) => {
    const match = byName.get(name.toLowerCase())
    return {
      name,
      ...(match?.price != null ? { price: match.price } : {}),
    }
  })
}

function sumServicesPrice(servicesPayload) {
  return servicesPayload.reduce((sum, srv) => {
    const n = extractNumber(srv.price)
    return sum + (n ?? 0)
  }, 0)
}

function resolveStylistForService(stylistRows, serviceRow, fallbackName) {
  if (!Array.isArray(stylistRows) || stylistRows.length === 0) {
    return String(fallbackName || 'Unknown Stylist')
  }

  const keyIndex =
    serviceRow?.key != null && String(serviceRow.key).trim() !== ''
      ? Number(serviceRow.key)
      : NaN
  if (Number.isInteger(keyIndex) && keyIndex >= 0 && stylistRows[keyIndex]?.name) {
    return String(stylistRows[keyIndex].name)
  }

  const rowIndex = Number(serviceRow?.index)
  if (Number.isInteger(rowIndex) && rowIndex >= 0 && stylistRows[rowIndex]?.name) {
    return String(stylistRows[rowIndex].name)
  }

  return String(fallbackName || stylistRows[0]?.name || 'Unknown Stylist')
}

export default function AppointmentsTable({
  branch,
  activeTab,
  search,
  status,
  date,
  stylist,
}) {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [notesById, setNotesById] = useState({})
  const [activeService, setActiveService] = useState('')
  const [draftStatus, setDraftStatus] = useState('Pending')
  const [draftServices, setDraftServices] = useState([])
  const [servicesCatalog, setServicesCatalog] = useState([])
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (!selectedAppointment) {
      setActiveService('')
      setDraftServices([])
      setSaveMessage('')
      setSaveError('')
      return
    }
    const services = getServicesArray(selectedAppointment.service)
    setActiveService(services[0] || '')
    setDraftServices(services)
    setDraftStatus(selectedAppointment.status || 'Pending')
  }, [selectedAppointment])

  useEffect(() => {
    const unsubscribe = listenToServicesCatalog((data) => {
      const mapped = data
        .map(normalizeCatalogItem)
        .filter(Boolean)
        .sort((a, b) => a.name.localeCompare(b.name))
      setServicesCatalog(mapped)
    })
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [])

  useEffect(() => {
    const unsubscribe = listenToBranchAppointments(branch, (data) => {
      const mapped = data.map((apt) => {
        const serviceRows = flattenServiceItems(apt.services).map(normalizeCatalogItem).filter(Boolean)
        const parsedServices = serviceRows.length
          ? serviceRows.map((srv, index) => ({ ...srv, index }))
          : getServicesArray(toDisplayList(apt.services)).map((name, index) => ({ name, index }))
        const stylistRows = extractStylistsFromAppointment(apt.stylists)
        const fallbackStylist = toDisplayList(apt.stylists)
        const pairedStylists = parsedServices.map((srv) =>
          resolveStylistForService(stylistRows, srv, fallbackStylist)
        )
        const services = parsedServices.map((s) => s.name).join(', ') || toDisplayList(apt.services)
        const stylistName = Array.from(new Set(pairedStylists)).join(', ') || fallbackStylist

        const group = classifyAppointment(apt)

        return {
          id: apt.id,
          branch: apt.branchName || branch,
          customer: apt.customerName || 'Unknown',
          contact: apt.phone || 'N/A',
          service: services,
          stylist: stylistName,
          dateTime: formatDateTime(apt.preferredDate, apt.preferredTime),
          price:
            apt.price != null
              ? `PHP ${Number(apt.price).toFixed(2)}`
              : (() => {
                  const total = computeServicesTotalPrice(apt.services)
                  return total != null ? `PHP ${total.toFixed(2)}` : '—'
                })(),
          status: formatStatus(apt.status),
          group,
          dateKey: formatDateKey(apt.preferredDate),
          notes: apt.notes || '',
          rawServices: apt.services || null,
          rawStylists: apt.stylists || null,
        }
      })
      setAppointments(mapped)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [branch])

  const filtered = useMemo(() => {
    return appointments.filter((apt) => {
      if (activeTab === 'Today' && apt.group !== 'Today') return false
      if (activeTab === 'Upcoming' && apt.group !== 'Upcoming') return false

      if (search?.trim()) {
        const term = search.trim().toLowerCase()
        if (
          !apt.customer.toLowerCase().includes(term) &&
          !apt.contact.toLowerCase().includes(term)
        ) {
          return false
        }
      }

      if (status && status !== 'All Statuses' && apt.status !== status) return false

      if (date?.trim() && apt.dateKey !== date.trim()) return false

      if (
        stylist &&
        stylist !== 'All Stylists' &&
        !apt.stylist.toLowerCase().includes(stylist.toLowerCase())
      ) {
        return false
      }

      return true
    })
  }, [appointments, activeTab, search, status, date, stylist])

  const availableServices = useMemo(() => {
    const fromRaw = selectedAppointment
      ? flattenServiceItems(selectedAppointment.rawServices)
          .map(normalizeCatalogItem)
          .filter(Boolean)
      : []
    const current = selectedAppointment
      ? getServicesArray(selectedAppointment.service).map((name) => ({ name, price: null }))
      : []
    const map = new Map()
    for (const srv of [...servicesCatalog, ...fromRaw, ...current]) {
      if (!srv?.name) continue
      const key = srv.name.toLowerCase()
      if (!map.has(key)) {
        map.set(key, srv)
        continue
      }
      const existing = map.get(key)
      if ((existing?.price == null || existing.price <= 0) && srv.price != null) {
        map.set(key, srv)
      }
    }
    return Array.from(map.values())
  }, [servicesCatalog, selectedAppointment, branch])

  const hasDraftChanges = useMemo(() => {
    if (!selectedAppointment) return false
    const originalServices = getServicesArray(selectedAppointment.service)
    const sameStatus = draftStatus === selectedAppointment.status
    const sameServices =
      originalServices.length === draftServices.length &&
      originalServices.every((srv) => draftServices.includes(srv))
    return !(sameStatus && sameServices)
  }, [selectedAppointment, draftStatus, draftServices])

  const toggleService = (serviceName) => {
    setDraftServices((prev) =>
      prev.includes(serviceName)
        ? prev.filter((name) => name !== serviceName)
        : [...prev, serviceName]
    )
    setActiveService(serviceName)
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-10 text-center text-slate-500 shadow-card backdrop-blur-sm">
        Loading appointments...
      </div>
    )
  }

  return (
    <>
      <div className="rounded-2xl border border-slate-200/80 bg-white/80 shadow-card backdrop-blur-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <p className="text-sm text-slate-600">{tableDate}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Stylist
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Date &amp; Time
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((appointment) => (
                <AppointmentRow
                  key={appointment.id}
                  appointment={appointment}
                  onViewDetails={setSelectedAppointment}
                />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-6 px-4 text-center text-sm text-gray-500"
                  >
                    No appointments match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAppointment && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedAppointment(null)}
        >
          <div
            className="relative bg-white/90 rounded-3xl border border-slate-200/80 shadow-card-hover max-w-md w-full p-6 space-y-4 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-900">Appointment Details</h3>
            <div className="space-y-1 text-sm text-slate-700">
              <p>
                <span className="font-medium">Customer:</span> {selectedAppointment.customer}
              </p>
              <p>
                <span className="font-medium">Service:</span> {selectedAppointment.service}
              </p>
              <div className="pt-1">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Services Available
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableServices.length === 0 ? (
                    <span className="text-xs text-slate-500">
                      No available services found.
                    </span>
                  ) : (
                    availableServices.map((srv) => {
                      const isSelected = draftServices.includes(srv.name)
                      return (
                        <button
                          key={srv.name}
                          type="button"
                          onClick={() => toggleService(srv.name)}
                          className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                            isSelected
                              ? 'border-fuchsia-300 bg-fuchsia-100 text-fuchsia-800'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {srv.name}
                          {srv.price != null ? ` (PHP ${Number(srv.price).toFixed(0)})` : ''}
                        </button>
                      )
                    })
                  )}
                </div>
                {activeService ? (
                  <p className="mt-1.5 text-xs text-slate-500">Selected: {activeService}</p>
                ) : null}
              </div>
              <p>
                <span className="font-medium">Stylist:</span> {selectedAppointment.stylist}
              </p>
              <p>
                <span className="font-medium">Date &amp; Time:</span> {selectedAppointment.dateTime}
              </p>
              <div className="pt-1">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={saving}
                      onClick={() => setDraftStatus(s)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                        draftStatus === s
                          ? 'border-fuchsia-300 bg-fuchsia-100 text-fuchsia-800'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      } ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Stylist availability note
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40 focus:border-fuchsia-300 resize-none"
                value={notesById[selectedAppointment.id] ?? getDefaultNote(selectedAppointment)}
                onChange={(e) =>
                  setNotesById((prev) => ({
                    ...prev,
                    [selectedAppointment.id]: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={saving || !hasDraftChanges || draftServices.length === 0}
                onClick={async () => {
                  if (!selectedAppointment) return
                  const previous = selectedAppointment
                  const servicesPayload = buildServicesPayload(
                    draftServices,
                    availableServices
                  )
                  const totalPrice = sumServicesPrice(servicesPayload)
                  const previousPrice = extractNumber(previous.price)
                  const finalPrice =
                    totalPrice > 0
                      ? totalPrice
                      : previousPrice != null && previousPrice > 0
                        ? previousPrice
                        : null
                  const payload = {
                    services: servicesPayload,
                    ...(finalPrice != null ? { price: finalPrice } : {}),
                  }

                  const nextServiceText = draftServices.join(', ')
                  setSaveMessage('')
                  setSaveError('')
                  setSelectedAppointment((prev) =>
                    prev
                      ? {
                          ...prev,
                          status: draftStatus,
                          service: nextServiceText || prev.service,
                          ...(finalPrice != null
                            ? { price: `PHP ${finalPrice.toFixed(2)}` }
                            : {}),
                        }
                      : prev
                  )
                  setAppointments((prev) =>
                    prev.map((apt) =>
                      apt.id === selectedAppointment.id
                        ? {
                            ...apt,
                            status: draftStatus,
                            service: nextServiceText || apt.service,
                            ...(finalPrice != null
                              ? { price: `PHP ${finalPrice.toFixed(2)}` }
                              : {}),
                          }
                        : apt
                    )
                  )

                  setSaving(true)
                  try {
                    await updateAppointmentStatus(
                      selectedAppointment.id,
                      draftStatus,
                      selectedAppointment.branch || branch
                    )

                    try {
                      await updateAppointmentDetails(
                        selectedAppointment.id,
                        payload,
                        selectedAppointment.branch || branch
                      )
                      setSaveMessage('Saved to Firebase.')
                    } catch {
                      setSaveMessage('Status saved. Service update was not accepted by rules.')
                    }
                  } catch {
                    setSelectedAppointment(previous)
                    setDraftStatus(previous.status)
                    setDraftServices(getServicesArray(previous.service))
                    setAppointments((prev) =>
                      prev.map((apt) => (apt.id === previous.id ? previous : apt))
                    )
                    setSaveError('Save failed. Check Firebase permissions/rules.')
                  } finally {
                    setSaving(false)
                  }
                }}
                className="px-4 py-2 rounded-xl border border-fuchsia-300 bg-fuchsia-100 text-sm font-semibold text-fuchsia-800 hover:bg-fuchsia-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
            {saveMessage ? (
              <p className="text-xs font-medium text-emerald-600">{saveMessage}</p>
            ) : null}
            {saveError ? <p className="text-xs font-medium text-rose-600">{saveError}</p> : null}
          </div>
        </div>
      )}
    </>
  )
}
