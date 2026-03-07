import { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'

export default function EditCommissionRateModal({ entry, onClose, onSave }) {
  const [rate, setRate] = useState(entry?.rate ?? 0)

  useEffect(() => {
    if (entry) setRate(entry.rate)
  }, [entry])

  if (!entry) return null

  const newAmount = (entry.price * rate) / 100

  const handleSave = () => {
    onSave({ ...entry, rate, amount: newAmount })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-gray-900 pr-8">Edit Commission Rate</h3>
        <p className="text-sm text-gray-500 mt-1">
          Update the commission rate for {entry.stylist}
        </p>

        <div className="mt-4 space-y-1 text-sm text-gray-700">
          <p>Service: {entry.service}</p>
          <p>Price: PHP {entry.price.toFixed(2)}</p>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Commission Rate (%)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-green-50">
          <p className="text-sm text-gray-700">New Commission Amount:</p>
          <p className="text-lg font-bold text-green-600 mt-0.5">
            PHP {newAmount.toFixed(2)}
          </p>
        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-700 text-white text-sm font-medium hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
