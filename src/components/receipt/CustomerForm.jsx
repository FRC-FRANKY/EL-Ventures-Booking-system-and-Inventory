export default function CustomerForm({ customer, email, sendLater, onCustomerChange, onEmailChange, onSendLaterChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">Customer & communication</h3>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Customer</label>
        <select
          value={customer}
          onChange={(e) => onCustomerChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">Choose a customer</option>
          <option value="customer1">Customer 1</option>
          <option value="customer2">Customer 2</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Email (Separate emails with a comma)"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
        />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={sendLater}
          onChange={(e) => onSendLaterChange(e.target.checked)}
          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <span className="text-sm text-gray-700">Send later</span>
      </label>
    </div>
  )
}
