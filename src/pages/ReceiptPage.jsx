import { useState, useMemo } from 'react'
import { Clock, MessageCircle, Settings, Info, X, ChevronDown } from 'lucide-react'
import ManagementShell from '../components/shell/ManagementShell'
import CustomerForm from '../components/receipt/CustomerForm'
import ShippingForm from '../components/receipt/ShippingForm'
import PaymentSection from '../components/receipt/PaymentSection'
import ReceiptTable from '../components/receipt/ReceiptTable'
import NotesSection from '../components/receipt/NotesSection'
import ReceiptSummary from '../components/receipt/ReceiptSummary'

const emptyLineItem = (serviceDate = '') => ({
  id: crypto.randomUUID(),
  serviceDate,
  productService: '',
  description: '',
  qty: 0,
  rate: 0,
  amount: 0,
})

const formatReceiptDate = (d) => {
  const x = new Date(d)
  const m = String(x.getMonth() + 1).padStart(2, '0')
  const day = String(x.getDate()).padStart(2, '0')
  const y = x.getFullYear()
  return `${m}/${day}/${y}`
}

export default function ReceiptPage() {
  const [receiptNo, setReceiptNo] = useState('1312')
  const [customer, setCustomer] = useState('')
  const [email, setEmail] = useState('')
  const [sendLater, setSendLater] = useState(false)
  const [billingAddress, setBillingAddress] = useState('')
  const [receiptDate, setReceiptDate] = useState(formatReceiptDate(new Date()))
  const [shippingTo, setShippingTo] = useState('')
  const [shipVia, setShipVia] = useState('')
  const [shippingDate, setShippingDate] = useState('')
  const [trackingNo, setTrackingNo] = useState('')
  const [tags, setTags] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [referenceNo, setReferenceNo] = useState('')
  const [depositTo, setDepositTo] = useState('cash')
  const [lineItems, setLineItems] = useState([emptyLineItem()])
  const [messageOnReceipt, setMessageOnReceipt] = useState('')
  const [memo, setMemo] = useState('')
  const [location, setLocation] = useState('')
  const [discountPercent, setDiscountPercent] = useState('0')
  const [shippingCost, setShippingCost] = useState('')
  const [amountReceived, setAmountReceived] = useState('')

  const subtotal = useMemo(
    () => lineItems.reduce((sum, row) => sum + Number(row.amount || 0), 0),
    [lineItems]
  )
  const discountAmount = useMemo(
    () => (subtotal * Number(discountPercent || 0)) / 100,
    [subtotal, discountPercent]
  )
  const shippingNum = useMemo(() => Number(shippingCost) || 0, [shippingCost])
  const total = useMemo(
    () => Math.max(0, subtotal - discountAmount + shippingNum),
    [subtotal, discountAmount, shippingNum]
  )
  const amountReceivedNum = useMemo(() => Number(amountReceived) || 0, [amountReceived])
  const balanceDue = useMemo(() => total - amountReceivedNum, [total, amountReceivedNum])

  const handleAddLine = () => {
    setLineItems((prev) => {
      const last = prev[prev.length - 1]
      const lastDate = last?.serviceDate || ''
      return [...prev, emptyLineItem(lastDate)]
    })
  }

  const handleClearAll = () => {
    setLineItems([emptyLineItem()])
  }

  const handleSave = () => {
    // Placeholder: persist receipt
  }

  const handleSaveAndClose = () => {
    handleSave()
    // Could navigate back to dashboard or list
  }

  return (
    <ManagementShell module="accounting" portalSubtitle="Receipt" userName="Finance team">
      <div className="space-y-6">
        {/* Receipt title bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Clock className="w-5 h-5 text-gray-500" aria-hidden />
            Sales Receipt #{receiptNo}
          </h2>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              title="Feedback"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              title="Info"
            >
              <Info className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel – form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <CustomerForm
                customer={customer}
                email={email}
                sendLater={sendLater}
                onCustomerChange={setCustomer}
                onEmailChange={setEmail}
                onSendLaterChange={setSendLater}
              />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <ShippingForm
                billingAddress={billingAddress}
                receiptDate={receiptDate}
                shippingTo={shippingTo}
                shipVia={shipVia}
                shippingDate={shippingDate}
                trackingNo={trackingNo}
                onBillingAddressChange={setBillingAddress}
                onReceiptDateChange={setReceiptDate}
                onShippingToChange={setShippingTo}
                onShipViaChange={setShipVia}
                onShippingDateChange={setShippingDate}
                onTrackingNoChange={setTrackingNo}
              />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <PaymentSection
                tags={tags}
                paymentMethod={paymentMethod}
                referenceNo={referenceNo}
                depositTo={depositTo}
                onTagsChange={setTags}
                onPaymentMethodChange={setPaymentMethod}
                onReferenceNoChange={setReferenceNo}
                onDepositToChange={setDepositTo}
              />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <ReceiptTable
                lineItems={lineItems}
                onItemsChange={setLineItems}
                onAddLine={handleAddLine}
                onClearAll={handleClearAll}
              />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <NotesSection
                messageOnReceipt={messageOnReceipt}
                memo={memo}
                onMessageChange={setMessageOnReceipt}
                onMemoChange={setMemo}
              />
            </div>
          </div>

          {/* Right panel – summary */}
          <div className="lg:col-span-1">
            <ReceiptSummary
              receiptNo={receiptNo}
              location={location}
              subtotal={subtotal}
              discountPercent={discountPercent}
              shipping={shippingCost}
              total={total}
              amountReceived={amountReceived}
              balanceDue={balanceDue}
              onReceiptNoChange={setReceiptNo}
              onLocationChange={setLocation}
              onDiscountPercentChange={setDiscountPercent}
              onShippingChange={setShippingCost}
              onAmountReceivedChange={setAmountReceived}
            />
          </div>
        </div>

        {/* Footer actions */}
        <footer className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 rounded"
            >
              Print or Preview
            </button>
            <button
              type="button"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 rounded"
            >
              Make recurring
            </button>
            <button
              type="button"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 rounded"
            >
              Customise
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleSaveAndClose}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Save and close
              <ChevronDown className="w-4 h-4 text-green-200" aria-hidden />
            </button>
          </div>
        </footer>
      </div>
    </ManagementShell>
  )
}
