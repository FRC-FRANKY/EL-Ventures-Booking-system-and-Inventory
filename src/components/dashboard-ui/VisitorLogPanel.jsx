import { useEffect, useMemo, useState } from 'react'
import { UserPlus, LogOut } from 'lucide-react'
import {
  checkoutVisitorEntry,
  listenToBranchVisitorLog,
  pushVisitorLogEntry,
} from '../../utils/firebaseHelpers'

function formatTime(entry) {
  const raw = entry.checkedInAt ?? entry.time
  if (typeof raw === 'number') {
    return new Date(raw).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  }
  if (typeof raw === 'string' && raw.trim()) return raw
  return '—'
}

export default function VisitorLogPanel({ branch }) {
  const [rows, setRows] = useState([])
  const [name, setName] = useState('')
  const [purpose, setPurpose] = useState('Appointment')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!branch) {
      setRows([])
      return undefined
    }
    return listenToBranchVisitorLog(branch, setRows)
  }, [branch])

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      const ta = Number(a.checkedInAt) || 0
      const tb = Number(b.checkedInAt) || 0
      return tb - ta
    })
  }, [rows])

  const latestInId = useMemo(() => {
    const ins = sorted.filter((r) => String(r.status || '').toLowerCase() === 'in')
    if (!ins.length) return null
    return ins[0].id
  }, [sorted])

  async function handleCheckIn(e) {
    e.preventDefault()
    if (!branch) return
    setError('')
    setBusy(true)
    try {
      await pushVisitorLogEntry(branch, { name, purpose })
      setName('')
      setPurpose('Appointment')
    } catch (err) {
      setError(err?.message || 'Could not check in visitor.')
    } finally {
      setBusy(false)
    }
  }

  async function handleCheckOut() {
    if (!branch || !latestInId) return
    setError('')
    setBusy(true)
    try {
      await checkoutVisitorEntry(branch, latestInId)
    } catch (err) {
      setError(err?.message || 'Could not check out.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleCheckIn} className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="flex min-w-[140px] flex-1 flex-col gap-1 text-xs font-medium text-slate-600 dark:text-slate-400">
          Name
          <input
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder="Guest name"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-[#C2185B] focus:outline-none focus:ring-2 focus:ring-[#C2185B]/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
        </label>
        <label className="flex min-w-[140px] flex-1 flex-col gap-1 text-xs font-medium text-slate-600 dark:text-slate-400">
          Purpose
          <input
            value={purpose}
            onChange={(ev) => setPurpose(ev.target.value)}
            placeholder="Walk-in, consultation…"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-[#C2185B] focus:outline-none focus:ring-2 focus:ring-[#C2185B]/30 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={busy || !branch}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C2185B] via-[#EC407A] to-[#F48FB1] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:scale-[1.03] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-offset-slate-900"
          >
            <UserPlus className="h-4 w-4" />
            Check-in visitor
          </button>
          <button
            type="button"
            onClick={handleCheckOut}
            disabled={busy || !latestInId || !branch}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#C2185B] focus:ring-offset-2 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:focus:ring-offset-slate-900"
          >
            <LogOut className="h-4 w-4" />
            Check-out latest
          </button>
        </div>
      </form>
      {error ? <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p> : null}
      {!branch ? (
        <p className="text-sm text-slate-500">Select a branch to use the visitor log.</p>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
        <table className="w-full min-w-[400px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
            <tr>
              <th className="px-3 py-2">Visitor</th>
              <th className="px-3 py-2">Time</th>
              <th className="px-3 py-2">Purpose</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-slate-500">
                  No visitors yet — check someone in to see them here.
                </td>
              </tr>
            ) : (
              sorted.map((v) => (
                <tr key={v.id} className="text-slate-700 dark:text-slate-200">
                  <td className="px-3 py-2 font-medium text-slate-900 dark:text-white">{v.name || 'Guest'}</td>
                  <td className="px-3 py-2">{formatTime(v)}</td>
                  <td className="px-3 py-2">{v.purpose || v.reason || '—'}</td>
                  <td className="px-3 py-2">
                    <span
                      className={
                        String(v.status || '').toLowerCase() === 'in'
                          ? 'rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : 'rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }
                    >
                      {v.status || '—'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
