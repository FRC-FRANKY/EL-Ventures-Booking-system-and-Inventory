const rows = [
  { name: 'Recel Orcales', role: 'HR Manager', dept: 'HQ', status: 'Active', attendance: '98%' },
  { name: 'Maria Santos', role: 'Stylist', dept: 'Salon', status: 'Active', attendance: '96%' },
  { name: 'James Taylor', role: 'Stylist', dept: 'Salon', status: 'On leave', attendance: '—' },
  { name: 'Ana Reyes', role: 'Nail Tech', dept: 'Nail', status: 'Active', attendance: '99%' },
]

export default function EmployeeTablePanel() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
            <th className="pb-3 pr-4">Employee</th>
            <th className="pb-3 pr-4">Role</th>
            <th className="pb-3 pr-4">Department</th>
            <th className="pb-3 pr-4">Status</th>
            <th className="pb-3">Attendance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((r) => (
            <tr key={r.name} className="text-slate-700 transition hover:bg-slate-50/80 dark:text-slate-200 dark:hover:bg-slate-800/50">
              <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">{r.name}</td>
              <td className="py-3 pr-4">{r.role}</td>
              <td className="py-3 pr-4">{r.dept}</td>
              <td className="py-3 pr-4">
                <span
                  className={[
                    'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                    r.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200',
                  ].join(' ')}
                >
                  {r.status}
                </span>
              </td>
              <td className="py-3 font-medium text-slate-900 dark:text-white">{r.attendance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
