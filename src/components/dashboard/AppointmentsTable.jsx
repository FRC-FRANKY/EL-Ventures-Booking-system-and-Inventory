import { useEffect, useMemo, useState } from 'react'
import AppointmentRow from './AppointmentRow'
import { listenToBranchAppointments } from '../../utils/firebaseHelpers'

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

function getDefaultNote(appointment) {
  if (appointment.status === 'Completed') {
    return 'Stylist was available and the service has been completed.'
  }
  if (appointment.status === 'Confirmed') {
    return 'Stylist is scheduled and currently marked as available for this time.'
  }
  return 'Stylist availability for this time slot is not confirmed. Please verify before confirming.'
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

  useEffect(() => {
    const unsubscribe = listenToBranchAppointments(branch, (data) => {
      const mapped = data.map((apt) => {
        const services = apt.services
          ? typeof apt.services === 'object'
            ? Object.values(apt.services).join(', ')
            : String(apt.services)
          : 'N/A'

        const stylistName = apt.stylists
          ? typeof apt.stylists === 'object'
            ? Object.values(apt.stylists).join(', ')
            : String(apt.stylists)
          : 'N/A'

        const group = classifyAppointment(apt)

        return {
          id: apt.id,
          branch: apt.branchName || branch,
          customer: apt.customerName || 'Unknown',
          contact: apt.phone || 'N/A',
          service: services,
          stylist: stylistName,
          dateTime: formatDateTime(apt.preferredDate, apt.preferredTime),
          duration: apt.duration || '—',
          price: apt.price || '—',
          status: apt.status || 'pending',
          group,
          dateKey: formatDateKey(apt.preferredDate),
          notes: apt.notes || '',
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

      if (stylist && stylist !== 'All Stylists' && apt.stylist !== stylist) return false

      return true
    })
  }, [appointments, activeTab, search, status, date, stylist])

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
        Loading appointments...
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-sm text-gray-600">{tableDate}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Stylist
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
                    colSpan={9}
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
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900">Appointment Details</h3>
            <div className="space-y-1 text-sm text-gray-700">
              <p>
                <span className="font-medium">Customer:</span> {selectedAppointment.customer}
              </p>
              <p>
                <span className="font-medium">Service:</span> {selectedAppointment.service}
              </p>
              <p>
                <span className="font-medium">Stylist:</span> {selectedAppointment.stylist}
              </p>
              <p>
                <span className="font-medium">Date &amp; Time:</span> {selectedAppointment.dateTime}
              </p>
              <p>
                <span className="font-medium">Status:</span> {selectedAppointment.status}
              </p>
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stylist availability note
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
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
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
