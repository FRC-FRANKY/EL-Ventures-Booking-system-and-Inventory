export default function NotesSection({ messageOnReceipt, memo, onMessageChange, onMemoChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">Notes</h3>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Message displayed on sales receipt</label>
        <textarea
          value={messageOnReceipt}
          onChange={(e) => onMessageChange(e.target.value)}
          rows={3}
          placeholder="Optional message shown on the printed receipt"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none placeholder-gray-400"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Memo</label>
        <textarea
          value={memo}
          onChange={(e) => onMemoChange(e.target.value)}
          rows={3}
          placeholder="Memo for internal notes"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none placeholder-gray-400"
        />
      </div>
    </div>
  )
}
