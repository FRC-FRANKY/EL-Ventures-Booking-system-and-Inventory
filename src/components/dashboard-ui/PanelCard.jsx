export default function PanelCard({ title, description, action, children, className = '', id }) {
  return (
    <section
      id={id}
      className={[
        'rounded-2xl border border-slate-200/80 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900',
        className,
      ].join(' ')}
    >
      {(title || description || action) && (
        <div className="flex flex-col gap-2 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <div>
            {title ? (
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
            ) : null}
            {description ? (
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      )}
      <div className="p-4">{children}</div>
    </section>
  )
}
