const formatPHP = (n) => `PHP ${Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function ReceiptSummary({
  receiptNo,
  location,
  subtotal,
  discountPercent,
  shipping,
  total,
  amountReceived,
  balanceDue,
  onReceiptNoChange,
  onLocationChange,
  onDiscountPercentChange,
  onShippingChange,
  onAmountReceivedChange,
}) {
  const discountAmount = (subtotal * Number(discountPercent)) / 100
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-5 sticky top-4">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{formatPHP(total)}</p>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Sales Receipt no.</label>
        <input
          type="text"
          value={receiptNo}
          placeholder="Receipt no."
          onChange={(e) => onReceiptNoChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
        <select
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">Select location</option>
          <option value="main">Mandaue City Branch</option>
          <option value="branch2">Pusok Branch</option>
          <option value="branch3">Pajac Branch</option>
          <option value="branch4">Cebu City Branch</option>
        </select>
      </div>
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">{formatPHP(subtotal)}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">Discount</span>
          <select
            value={discountPercent}
            onChange={(e) => onDiscountPercentChange(e.target.value)}
            className="px-2 py-1 rounded border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-green-500"
          >
            <option value="0">0%</option>
            <option value="5">5%</option>
            <option value="10">10%</option>
            <option value="15">15%</option>
            <option value="20">20%</option>
            <option value="25">25%</option>
            <option value="30">30%</option>
            <option value="35">35%</option>
            <option value="40">40%</option>
            <option value="45">45%</option>
            <option value="50">50%</option>
            <option value="55">55%</option>
            <option value="60">60%</option>
            <option value="65">65%</option>
            <option value="70">70%</option>
            <option value="75">75%</option>
            <option value="80">80%</option>
            <option value="85">85%</option>
            <option value="90">90%</option>
            <option value="95">95%</option>
            <option value="100">100%</option>
          </select>
          <input
            type="number"
            min="0"
            max="100"
            step="0.5"
            value={discountPercent}
            onChange={(e) => onDiscountPercentChange(e.target.value)}
            className="w-14 px-2 py-1 rounded border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-green-500"
            aria-label="Discount percent"
          />
          <span className="text-sm font-medium text-gray-900">{formatPHP(discountAmount)}</span>
        </div>
        <div className="flex justify-between items-center gap-2 text-sm">
          <span className="text-gray-600">Shipping</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={shipping}
            onChange={(e) => onShippingChange(e.target.value)}
            className="w-24 px-2 py-1 rounded border border-gray-200 bg-white text-right text-sm focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-100">
          <span className="text-gray-700">Total</span>
          <span className="text-gray-900">{formatPHP(total)}</span>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Amount received</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amountReceived}
            onChange={(e) => onAmountReceivedChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="flex justify-between text-sm pt-2">
          <span className="text-gray-600">Balance due</span>
          <span className={`font-semibold ${Number(balanceDue) > 0 ? 'text-amber-600' : 'text-green-600'}`}>
            {formatPHP(balanceDue)}
          </span>
        </div>
      </div>
    </div>
  )
}
