import { Users } from 'lucide-react'

export default function CustomerActivity() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
          <Users className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Customer Activity</h3>
      </div>
      <p className="text-gray-700">
        Customers: <span className="font-bold text-gray-900">13</span>
      </p>
    </div>
  )
}
