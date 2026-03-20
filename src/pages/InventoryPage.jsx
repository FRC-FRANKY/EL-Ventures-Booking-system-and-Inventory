import { useState, useMemo } from 'react'
import {
  Package,
  AlertTriangle,
  PhilippinePeso,
  Search,
  Plus,
  ChevronDown,
  Minus,
  Pencil,
  Trash2,
  X,
} from 'lucide-react'
import ManagementShell from '../components/shell/ManagementShell'

const CATEGORIES = ['All Categories', 'Clinic', 'Nail', 'Salon']
const UNITS = ['All Units', 'Gram', 'Boxes', 'Pieces', 'Bottle']

const CATEGORY_COLORS = {
  'Hair Care': 'bg-blue-100 text-blue-800',
  Styling: 'bg-purple-100 text-purple-800',
  Color: 'bg-pink-100 text-pink-800',
  Tools: 'bg-gray-100 text-gray-800',
  Retail: 'bg-green-100 text-green-800',
  Clinic: 'bg-blue-100 text-blue-800',
  Nail: 'bg-pink-100 text-pink-800',
  Salon: 'bg-purple-100 text-purple-800',
}

const initialInventory = [
  { id: '1', itemName: 'Professional Shampoo', category: 'Salon', quantity: 24, unit: 'Bottle', unitPrice: 28.99, supplier: 'Beauty Supplies Co.', lastRestocked: '3/1/2026', minStock: 10 },
  { id: '2', itemName: 'Hair Conditioner', category: 'Salon', quantity: 18, unit: 'Bottle', unitPrice: 16.5, supplier: 'Beauty Supplies Co.', lastRestocked: '3/1/2026', minStock: 8 },
  { id: '3', itemName: 'Styling Mousse', category: 'Salon', quantity: 5, unit: 'Bottle', unitPrice: 12.0, supplier: 'Style Pro', lastRestocked: '2/28/2026', minStock: 10 },
  { id: '4', itemName: 'Hair Color - Brown', category: 'Salon', quantity: 12, unit: 'Boxes', unitPrice: 8.5, supplier: 'Color Master Inc.', lastRestocked: '2/25/2026', minStock: 5 },
  { id: '5', itemName: 'Nail Polish Set', category: 'Nail', quantity: 30, unit: 'Pieces', unitPrice: 15.0, supplier: 'Nail Pro', lastRestocked: '3/2/2026', minStock: 10 },
  { id: '6', itemName: 'Acrylic Powder', category: 'Nail', quantity: 8, unit: 'Gram', unitPrice: 2.5, supplier: 'Nail Pro', lastRestocked: '2/20/2026', minStock: 5 },
  { id: '7', itemName: 'Scalp Treatment', category: 'Clinic', quantity: 15, unit: 'Bottle', unitPrice: 35.0, supplier: 'Clinic Supply', lastRestocked: '3/3/2026', minStock: 5 },
  { id: '8', itemName: 'Disposable Gloves', category: 'Clinic', quantity: 100, unit: 'Pieces', unitPrice: 0.5, supplier: 'Clinic Supply', lastRestocked: '3/1/2026', minStock: 50 },
  { id: '9', itemName: 'Hair Brushes', category: 'Salon', quantity: 20, unit: 'Pieces', unitPrice: 12.0, supplier: 'Tool Masters', lastRestocked: '2/15/2026', minStock: 5 },
  { id: '10', itemName: 'Nail Files', category: 'Nail', quantity: 50, unit: 'Pieces', unitPrice: 1.2, supplier: 'Nail Pro', lastRestocked: '2/28/2026', minStock: 20 },
  { id: '11', itemName: 'Styling Gel', category: 'Salon', quantity: 14, unit: 'Bottle', unitPrice: 18.0, supplier: 'Style Pro', lastRestocked: '3/2/2026', minStock: 8 },
  { id: '12', itemName: 'Treatment Serum', category: 'Clinic', quantity: 10, unit: 'Bottle', unitPrice: 42.0, supplier: 'Beauty Supplies Co.', lastRestocked: '2/28/2026', minStock: 5 },
]

function AddItemModal({ onClose, onAdd }) {
  const [item, setItem] = useState({
    itemName: '',
    category: 'Salon',
    quantity: 0,
    unit: 'Bottle',
    unitPrice: 0,
    supplier: '',
    minStock: 0,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!item.itemName.trim()) return
    onAdd({
      ...item,
      id: String(Date.now()),
      lastRestocked: new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Add Item</h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <input
              type="text"
              value={item.itemName}
              onChange={(e) => setItem((p) => ({ ...p, itemName: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g. Professional Shampoo"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={item.category}
              onChange={(e) => setItem((p) => ({ ...p, category: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
            >
              {CATEGORIES.filter((c) => c !== 'All Categories').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                min="0"
                value={item.quantity || ''}
                onChange={(e) => setItem((p) => ({ ...p, quantity: Number(e.target.value) || 0 }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select
                value={item.unit}
                onChange={(e) => setItem((p) => ({ ...p, unit: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
              >
                {UNITS.filter((u) => u !== 'All Units').map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price (PHP)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={item.unitPrice || ''}
              onChange={(e) => setItem((p) => ({ ...p, unitPrice: Number(e.target.value) || 0 }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock</label>
            <input
              type="number"
              min="0"
              value={item.minStock || ''}
              onChange={(e) => setItem((p) => ({ ...p, minStock: Number(e.target.value) || 0 }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
            <input
              type="text"
              value={item.supplier}
              onChange={(e) => setItem((p) => ({ ...p, supplier: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
              placeholder="Supplier name"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700">
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DeductModal({ item, onClose, onConfirm }) {
  const [amount, setAmount] = useState(1)
  if (!item) return null
  const maxDeduct = item.quantity

  const handleSubmit = (e) => {
    e.preventDefault()
    const num = Math.min(Math.max(1, Number(amount) || 0), maxDeduct)
    if (num > 0) onConfirm(num)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Deduct Quantity</h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-2">{item.itemName}</p>
        <p className="text-sm text-gray-500 mb-4">Current quantity: {item.quantity} {item.unit}(s). Max to deduct: {maxDeduct}</p>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Units to remove</label>
          <input
            type="number"
            min="1"
            max={maxDeduct}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 mb-4"
          />
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700">Confirm</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EditItemModal({ item, onClose, onSave }) {
  const [form, setForm] = useState(item ? { ...item } : null)
  if (!item || !form) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Edit Item</h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <input type="text" value={form.itemName} onChange={(e) => setForm((p) => ({ ...p, itemName: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500">
              {CATEGORIES.filter((c) => c !== 'All Categories').map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input type="number" min="0" value={form.quantity} onChange={(e) => setForm((p) => ({ ...p, quantity: Number(e.target.value) || 0 }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select value={form.unit} onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500">
                {UNITS.filter((u) => u !== 'All Units').map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price (PHP)</label>
            <input type="number" min="0" step="0.01" value={form.unitPrice} onChange={(e) => setForm((p) => ({ ...p, unitPrice: Number(e.target.value) || 0 }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock</label>
            <input type="number" min="0" value={form.minStock} onChange={(e) => setForm((p) => ({ ...p, minStock: Number(e.target.value) || 0 }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
            <input type="text" value={form.supplier} onChange={(e) => setForm((p) => ({ ...p, supplier: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500" />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState(initialInventory)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [unitFilter, setUnitFilter] = useState('All Units')
  const [showAddModal, setShowAddModal] = useState(false)
  const [deductItem, setDeductItem] = useState(null)
  const [editItem, setEditItem] = useState(null)

  const filteredInventory = useMemo(() => {
    const q = search.trim().toLowerCase()
    return inventory.filter((item) => {
      const matchSearch = !q || item.itemName.toLowerCase().includes(q) || (item.supplier && item.supplier.toLowerCase().includes(q))
      const matchCategory = categoryFilter === 'All Categories' || item.category === categoryFilter
      const matchUnit = unitFilter === 'All Units' || item.unit === unitFilter
      return matchSearch && matchCategory && matchUnit
    })
  }, [inventory, search, categoryFilter, unitFilter])

  const stats = useMemo(() => {
    const totalItems = inventory.length
    const lowStockCount = inventory.filter((i) => i.quantity < i.minStock).length
    const totalValue = inventory.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
    return { totalItems, lowStockCount, totalValue }
  }, [inventory])

  const lowStockItems = useMemo(() => inventory.filter((i) => i.quantity < i.minStock), [inventory])

  const handleAddItem = (newItem) => {
    setInventory((prev) => [...prev, newItem])
  }

  const handleDeduct = (item, amount) => {
    setInventory((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, quantity: Math.max(0, i.quantity - amount) } : i
      )
    )
    setDeductItem(null)
  }

  const handleSaveEdit = (updated) => {
    setInventory((prev) => prev.map((i) => (i.id === updated.id ? { ...updated } : i)))
    setEditItem(null)
  }

  const handleDelete = (item) => {
    if (window.confirm(`Delete "${item.itemName}"?`)) setInventory((prev) => prev.filter((i) => i.id !== item.id))
  }

  return (
    <ManagementShell module="accounting" portalSubtitle="Inventory" userName="Finance team">
      <div className="space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-l-gray-400">
            <p className="text-sm font-medium text-gray-500">Total Items</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalItems}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-l-orange-500">
            <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
              Low Stock Items
              <AlertTriangle className="w-4 h-4 text-orange-500" />
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.lowStockCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-l-green-500">
            <p className="text-sm font-medium text-gray-500">Total Value (PHP)</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">PHP {stats.totalValue.toFixed(2)}</p>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or supplier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="relative flex-shrink-0">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-3 pr-9 py-2.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 appearance-none min-w-[160px]"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative flex-shrink-0">
            <select
              value={unitFilter}
              onChange={(e) => setUnitFilter(e.target.value)}
              className="pl-3 pr-9 py-2.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-purple-500 appearance-none min-w-[140px]"
            >
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        {/* Low stock alert */}
        {lowStockItems.length > 0 && (
          <div className="rounded-xl border border-orange-200 bg-amber-50 p-4 flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-orange-800">Low Stock Alert</p>
              <ul className="mt-1 text-sm text-orange-700 space-y-0.5">
                {lowStockItems.map((i) => (
                  <li key={i.id}>
                    {i.itemName} – Only {i.quantity} left (Min: {i.minStock})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">Inventory Items ({filteredInventory.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {['Item Name', 'Category', 'Quantity', 'Unit', 'Unit Price', 'Total Value', 'Supplier', 'Last Restocked', 'Actions'].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => {
                  const totalValue = item.quantity * item.unitPrice
                  const isLow = item.quantity < item.minStock
                  const badgeClass = CATEGORY_COLORS[item.category] || 'bg-gray-100 text-gray-800'
                  return (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.itemName}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${badgeClass}`}>{item.category}</span>
                      </td>
                      <td className={`py-3 px-4 text-sm ${isLow ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                        {item.quantity} {isLow && '(Low)'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{item.unit}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">PHP {item.unitPrice.toFixed(2)}</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">PHP {totalValue.toFixed(2)}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{item.supplier}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{item.lastRestocked}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 flex-wrap">
                          <button type="button" onClick={() => setDeductItem(item)} className="p-1.5 rounded text-gray-500 hover:bg-gray-100" title="Deduct"><Minus className="w-4 h-4" /></button>
                          <button type="button" onClick={() => setEditItem(item)} className="p-1.5 rounded text-gray-500 hover:bg-gray-100" title="Edit"><Pencil className="w-4 h-4" /></button>
                          <button type="button" onClick={() => handleDelete(item)} className="p-1.5 rounded text-red-500 hover:bg-red-50" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddModal && <AddItemModal onClose={() => setShowAddModal(false)} onAdd={handleAddItem} />}
      {deductItem && <DeductModal item={deductItem} onClose={() => setDeductItem(null)} onConfirm={(amount) => handleDeduct(deductItem, amount)} />}
      {editItem && <EditItemModal item={editItem} onClose={() => setEditItem(null)} onSave={handleSaveEdit} />}
    </ManagementShell>
  )
}
