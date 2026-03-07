import { useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'

const items = [
  { id: '1', name: 'Hair Shampoo Premium', category: 'Hair Care', stock: 5, reorderAt: 20 },
  { id: '2', name: 'Conditioner', category: 'Hair Care', stock: 8, reorderAt: 15 },
  { id: '3', name: 'Nail Polish - Red', category: 'Nail Care', stock: 3, reorderAt: 10 },
  { id: '4', name: 'Hair Color - Brown', category: 'Hair Products', stock: 4, reorderAt: 12 },
]

export default function LowStockAlerts() {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-bold text-gray-900">Low Stock Alerts</h3>
      </div>
      <ul className="space-y-3 flex-1">
        {items.map((item) => (
          <li
            key={item.id}
            className="py-3 border-b border-gray-100 last:border-0"
          >
            <p className="font-medium text-gray-900">{item.name}</p>
            <p className="text-sm text-gray-500">Category: {item.category}</p>
            <p className="text-sm mt-0.5">
              <span className="text-red-600 font-medium">Stock: {item.stock}</span>
              {' · '}
              <span className="text-gray-600">Reorder at: {item.reorderAt}</span>
            </p>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => navigate('/accounting-inventory/inventory')}
        className="mt-4 w-full py-2.5 rounded-lg bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        View Full Inventory
      </button>
    </div>
  )
}
