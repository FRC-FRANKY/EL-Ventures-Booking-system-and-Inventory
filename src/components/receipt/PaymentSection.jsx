export default function PaymentSection({
  tags,
  paymentMethod,
  referenceNo,
  depositTo,
  onTagsChange,
  onPaymentMethodChange,
  onReferenceNoChange,
  onDepositToChange,
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">Tags & payment</h3>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Tags</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={tags}
            onChange={(e) => onTagsChange(e.target.value)}
            placeholder="Start typing to add a tag"
            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
          />
          <button type="button" className="text-xs text-green-600 hover:underline whitespace-nowrap">
            Manage tags
          </button>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Payment method</label>
        <select
          value={paymentMethod}
          onChange={(e) => onPaymentMethodChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">Choose payment method</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="gcash">GCash</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Reference no.</label>
        <input
          type="text"
          value={referenceNo}
          onChange={(e) => onReferenceNoChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Deposit To</label>
        <select
          value={depositTo}
          onChange={(e) => onDepositToChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="cash">Cash and cash equivalents</option>
          <option value="bank">Bank</option>
        </select>
      </div>
    </div>
  )
}
