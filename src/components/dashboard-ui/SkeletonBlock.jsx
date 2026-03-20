export function SkeletonLine({ className = '' }) {
  return (
    <div
      className={['animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-700/80', className].join(' ')}
    />
  )
}

export default function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      <SkeletonLine className="h-32 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonLine key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SkeletonLine className="h-72 rounded-2xl" />
        <SkeletonLine className="h-72 rounded-2xl" />
      </div>
    </div>
  )
}
