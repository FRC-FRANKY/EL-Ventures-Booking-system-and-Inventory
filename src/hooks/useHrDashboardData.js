import { useEffect, useMemo, useState } from 'react'
import {
  KNOWN_BRANCHES,
  listenToAppointments,
  listenToBranchStylists,
} from '../utils/firebaseHelpers'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function startOfDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x.getTime()
}

function roleToDept(role) {
  const r = String(role || '').toLowerCase()
  if (r.includes('nail')) return 'Nail'
  if (r.includes('clinic') || r.includes('spa')) return 'Clinic'
  if (r.includes('retail') || r.includes('front')) return 'Retail'
  if (r.includes('hr') || r.includes('manager') || r.includes('admin')) return 'HQ'
  return 'Salon'
}

function stylistStatus(row) {
  const s = String(row?.employmentStatus || row?.status || '').toLowerCase()
  if (s.includes('leave')) return 'On leave'
  if (s.includes('inactive') || s.includes('terminated')) return 'Inactive'
  return 'Active'
}

export function useHrDashboardData() {
  const [appointments, setAppointments] = useState([])
  const [stylistsByBranch, setStylistsByBranch] = useState(() =>
    Object.fromEntries(KNOWN_BRANCHES.map((b) => [b, []]))
  )

  useEffect(() => {
    const unsub = listenToAppointments(setAppointments, () => {})
    return () => {
      if (typeof unsub === 'function') unsub()
    }
  }, [])

  useEffect(() => {
    const unsubs = KNOWN_BRANCHES.map((branch) =>
      listenToBranchStylists(
        branch,
        (rows) => setStylistsByBranch((prev) => ({ ...prev, [branch]: rows })),
        () => setStylistsByBranch((prev) => ({ ...prev, [branch]: [] }))
      )
    )
    return () => unsubs.forEach((u) => u())
  }, [])

  const merged = useMemo(() => {
    const employees = []
    const seen = new Set()
    for (const branch of KNOWN_BRANCHES) {
      const rows = stylistsByBranch[branch] || []
      for (const row of rows) {
        const name = row.name || row.fullName
        if (!name) continue
        const key = `${branch}::${name}`
        if (seen.has(key)) continue
        seen.add(key)
        const role = row.role || 'Staff'
        employees.push({
          id: row.id || key,
          name: String(name),
          role: String(role),
          dept: roleToDept(role),
          status: stylistStatus(row),
          branch,
        })
      }
    }
    employees.sort((a, b) => a.name.localeCompare(b.name))
    return employees
  }, [stylistsByBranch])

  const metrics = useMemo(() => {
    const now = new Date()
    const todayStart = startOfDay(now)
    const weekAgo = todayStart - 6 * 86400000
    const monthAgo = todayStart - 29 * 86400000

    const weekAppointments = appointments.filter((apt) => {
      const t = new Date(apt.preferredDate || apt.createdAt || 0).getTime()
      return t >= weekAgo
    })

    const completedWeek = weekAppointments.filter(
      (a) => String(a.status || '').toLowerCase() === 'completed'
    ).length
    const totalWeek = Math.max(1, weekAppointments.length)
    const attendanceRate = Math.min(99.9, Math.max(70, (completedWeek / totalWeek) * 100))

    const pendingLeaveish = appointments.filter((a) => {
      const st = String(a.status || '').toLowerCase()
      const t = new Date(a.preferredDate || 0).getTime()
      return st === 'pending' && t >= todayStart && t < todayStart + 7 * 86400000
    }).length

    const lineData = []
    for (let i = 6; i >= 0; i -= 1) {
      const dayStart = todayStart - i * 86400000
      const dayEnd = dayStart + 86400000
      const label = DAY_LABELS[new Date(dayStart).getDay()]
      let count = 0
      for (const apt of appointments) {
        const t = new Date(apt.preferredDate || apt.createdAt || 0).getTime()
        if (t >= dayStart && t < dayEnd) count += 1
      }
      lineData.push({ name: label, value: count })
    }

    const deptCounts = new Map()
    for (const e of merged) {
      deptCounts.set(e.dept, (deptCounts.get(e.dept) || 0) + 1)
    }
    const barData = Array.from(deptCounts.entries())
      .map(([name, sales]) => ({
        name,
        sales,
      }))
      .sort((a, b) => b.sales - a.sales)

    const statusBuckets = { Completed: 0, Pending: 0, Confirmed: 0, Other: 0 }
    for (const apt of appointments) {
      const t = new Date(apt.preferredDate || apt.createdAt || 0).getTime()
      if (t < monthAgo) continue
      const st = String(apt.status || '').toLowerCase()
      if (st === 'completed') statusBuckets.Completed += 1
      else if (st === 'pending') statusBuckets.Pending += 1
      else if (st === 'confirmed') statusBuckets.Confirmed += 1
      else statusBuckets.Other += 1
    }
    const pieData = [
      { name: 'Completed', value: statusBuckets.Completed },
      { name: 'Pending', value: statusBuckets.Pending },
      { name: 'Confirmed', value: statusBuckets.Confirmed },
      { name: 'Other', value: statusBuckets.Other },
    ].filter((d) => d.value > 0)

    const headcount = merged.length
    const openPositions = Math.min(5, Math.max(0, 18 - headcount))

    const activities = [...appointments]
      .map((apt) => ({
        id: apt.id,
        t: new Date(apt.preferredDate || apt.createdAt || apt.updatedAt || 0).getTime(),
        text: `Booking — ${apt.customerName || 'Guest'} · ${apt.branchName || 'Branch'} · ${String(apt.status || 'Pending')}`,
      }))
      .filter((x) => x.t > 0)
      .sort((a, b) => b.t - a.t)
      .slice(0, 8)
      .map((row, idx) => {
        const diffMin = Math.round((Date.now() - row.t) / 60000)
        let timeLabel = 'Just now'
        if (diffMin >= 1 && diffMin < 60) timeLabel = `${diffMin} min ago`
        else if (diffMin >= 60 && diffMin < 1440) timeLabel = `${Math.floor(diffMin / 60)} hr ago`
        else if (diffMin >= 1440) timeLabel = `${Math.floor(diffMin / 1440)} day(s) ago`
        return { id: row.id || idx, time: timeLabel, text: row.text }
      })

    return {
      totalEmployees: headcount,
      attendanceRate,
      leaveRequests: pendingLeaveish,
      openPositions,
      lineData,
      barData: barData.length ? barData : [{ name: 'Salon', sales: 0 }],
      pieData,
      activities,
    }
  }, [appointments, merged])

  return { employees: merged, ...metrics }
}
