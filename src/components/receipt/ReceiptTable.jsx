import { Trash2, Plus } from 'lucide-react'

const COLUMNS = ['SERVICE DATE', 'PRODUCT/SERVICE', 'DESCRIPTION', 'QTY', 'RATE', 'AMOUNT']

export default function ReceiptTable({ lineItems, onItemsChange, onAddLine, onClearAll }) {
  const updateItem = (index, field, value) => {
    const next = [...lineItems]
    const item = { ...next[index], [field]: value }
    if (field === 'qty' || field === 'rate') {
      const qty = field === 'qty' ? Number(value) || 0 : Number(next[index].qty) || 0
      const rate = field === 'rate' ? Number(value) || 0 : Number(next[index].rate) || 0
      item.amount = qty * rate
    }
    next[index] = item
    onItemsChange(next)
  }

  const emptyRow = () => ({ id: crypto.randomUUID(), serviceDate: '', productService: '', description: '', qty: 0, rate: 0, amount: 0 })

  const removeLine = (index) => {
    const next = lineItems.filter((_, i) => i !== index)
    onItemsChange(next.length ? next : [emptyRow()])
  }

  const rows = lineItems.length ? lineItems : [emptyRow()]

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Product / Service</h3>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {COLUMNS.map((col) => (
                  <th key={col} className="text-left py-2.5 px-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {col}
                  </th>
                ))}
                <th className="w-10" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                  <td className="py-2 px-3">
                    <input
                      type="date"
                      value={row.serviceDate}
                      onChange={(e) => updateItem(index, 'serviceDate', e.target.value)}
                      placeholder="dd/mm/yyyy"
                      className="w-full min-w-[140px] px-2 py-1.5 rounded border border-gray-200 bg-white text-gray-900 focus:ring-1 focus:ring-green-500 focus:border-transparent"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={row.productService}
                      onChange={(e) => updateItem(index, 'productService', e.target.value)}
                      placeholder="—"
                      className="w-full min-w-[120px] px-2 py-1.5 rounded border border-gray-200 bg-white text-gray-900 focus:ring-1 focus:ring-green-500 focus:border-transparent"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={row.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="—"
                      className="w-full min-w-[120px] px-2 py-1.5 rounded border border-gray-200 bg-white text-gray-900 focus:ring-1 focus:ring-green-500 focus:border-transparent"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={row.qty || ''}
                      onChange={(e) => updateItem(index, 'qty', e.target.value)}
                      placeholder="0"
                      className="w-16 px-2 py-1.5 rounded border border-gray-200 bg-white text-gray-900 focus:ring-1 focus:ring-green-500 focus:border-transparent"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={row.rate || ''}
                      onChange={(e) => updateItem(index, 'rate', e.target.value)}
                      placeholder="0.00"
                      className="w-20 px-2 py-1.5 rounded border border-gray-200 bg-white text-gray-900 focus:ring-1 focus:ring-green-500 focus:border-transparent"
                    />
                  </td>
                  <td className="py-2 px-3 text-gray-700 font-medium">
                    {Number(row.amount || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2 px-2">
                    <button
                      type="button"
                      onClick={() => removeLine(index)}
                      className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                      aria-label="Delete line"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border-t border-gray-200">
          <button
            type="button"
            onClick={onAddLine}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
          >
            <Plus className="w-4 h-4" />
            Add line
          </button>
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
          >
            Clear all lines
          </button>
        </div>
      </div>
    </div>
  )
}
