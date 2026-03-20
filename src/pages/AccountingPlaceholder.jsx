import ManagementShell from '../components/shell/ManagementShell'

export default function AccountingPlaceholder({ title }) {
  return (
    <ManagementShell module="accounting" portalSubtitle={title} userName="Finance team">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Content coming soon.</p>
      </div>
    </ManagementShell>
  )
}
