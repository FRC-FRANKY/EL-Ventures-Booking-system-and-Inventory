import { useEffect, useMemo, useState } from 'react'
import { extractStylistsFromAppointment, listenToBranchAppointments } from '../../utils/firebaseHelpers'

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

function serviceNames(apt) {
  const flat = flattenServiceItems(apt.services)
  const names = flat
    .map((item) => item?.name || item?.serviceName || item?.title || item?.service)
    .filter(Boolean)
  if (names.length) return names.join(', ')
  if (typeof apt.services === 'string') return apt.services
  return 'Service'
}

function parseTimeSort(preferredTime) {
  if (!preferredTime) return 0
  const d = new Date(`1970-01-01 ${preferredTime}`)
  const t = d.getTime()
  return Number.isFinite(t) ? t : 0
}

function startOfDay(ts) {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export default function AppointmentsList({ branch }) {
  const [list, setList] = useState([])

  useEffect(() => {
    if (!branch) {
      setList([])
      return undefined
    }
    return listenToBranchAppointments(branch, setList)
  }, [branch])

  const todayRows = useMemo(() => {
    const todayStart = startOfDay(Date.now())
    const rows = []
    for (const apt of list) {
      const aptDay = startOfDay(new Date(apt.preferredDate).getTime())
      if (aptDay !== todayStart) continue
      const stylists = extractStylistsFromAppointment(apt.stylists)
      const stylistLabel = stylists.map((s) => s.name).filter(Boolean).join(', ')
      const svc = serviceNames(apt)
      const line = stylistLabel ? `${svc} · ${stylistLabel}` : svc
      rows.push({
        key: apt.id,
        time: apt.preferredTime || '—',
        sort: parseTimeSort(apt.preferredTime),
        customer: apt.customerName || 'Guest',
        service: line,
      })
    }
    rows.sort((a, b) => a.sort - b.sort)
    return rows
  }, [list])

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
        Today&apos;s upcoming appointments
      </h3>
      <ul className="flex-1 space-y-4">
        {todayRows.length === 0 ? (
          <li className="text-sm text-slate-500 dark:text-slate-400">No appointments scheduled for today.</li>
        ) : (
          todayRows.map((apt) => (
            <li
              key={apt.key}
              className="flex gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0 dark:border-slate-800"
            >
              <span className="w-20 flex-shrink-0 text-sm font-semibold text-[#C2185B] dark:text-[#EC407A]">
                {apt.time}
              </span>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{apt.customer}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{apt.service}</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
