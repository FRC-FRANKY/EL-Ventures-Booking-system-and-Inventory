import { useState } from 'react'

const tabs = ['Today', 'Upcoming', 'All Appointments']

export default function AppointmentTabs() {
  const [activeTab, setActiveTab] = useState('Today')

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === tab
              ? 'bg-gray-200 text-gray-900'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
