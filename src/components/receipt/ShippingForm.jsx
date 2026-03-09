import { Calendar } from 'lucide-react'

export default function ShippingForm({
  billingAddress,
  receiptDate,
  shippingTo,
  shipVia,
  shippingDate,
  trackingNo,
  onBillingAddressChange,
  onReceiptDateChange,
  onShippingToChange,
  onShipViaChange,
  onShippingDateChange,
  onTrackingNoChange,
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">Address & date</h3>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Billing Address</label>
        <textarea
          value={billingAddress}
          onChange={(e) => onBillingAddressChange(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Sales Receipt Date</label>
        <div className="relative">
          <input
            type="text"
            value={receiptDate}
            onChange={(e) => onReceiptDateChange(e.target.value)}
            placeholder="MM/DD/YYYY"
            className="w-full pl-3 pr-9 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Shipping To</label>
        <textarea
          value={shippingTo}
          onChange={(e) => onShippingToChange(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
        />
      </div>
      <h3 className="text-sm font-semibold text-gray-700 pt-2">Shipping details</h3>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Ship via</label>
        <input
          type="text"
          value={shipVia}
          onChange={(e) => onShipViaChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Shipping date</label>
        <div className="relative">
          <input
            type="text"
            value={shippingDate}
            onChange={(e) => onShippingDateChange(e.target.value)}
            placeholder="MM/DD/YYYY"
            className="w-full pl-3 pr-9 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Tracking no.</label>
        <input
          type="text"
          value={trackingNo}
          onChange={(e) => onTrackingNoChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
    </div>
  )
}
