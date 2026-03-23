const tabs = ['Today', 'Upcoming', 'All Appointments']

export default function AppointmentTabs({ activeTab, onChange }) {

  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200/80 bg-white/70 p-2 backdrop-blur-sm">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange?.(tab)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
            activeTab === tab
              ? 'bg-gradient-to-r from-[#C2185B] via-[#EC407A] to-[#F48FB1] text-white shadow-[0_18px_38px_-20px_rgba(194,24,91,0.85)]'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
