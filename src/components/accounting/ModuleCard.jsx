import { useNavigate } from 'react-router-dom'
import { Package, DollarSign, Receipt, FileText } from 'lucide-react'

const modules = [
  {
    title: 'Inventory',
    description: 'Manage products and stock',
    icon: Package,
    color: 'bg-blue-500',
    path: '/accounting-inventory/inventory',
  },
  {
    title: 'Sales',
    description: 'Track revenue performance',
    icon: DollarSign,
    color: 'bg-green-500',
    path: '/accounting-inventory/sales',
  },
  {
    title: 'Expenses',
    description: 'Monitor business expenses',
    icon: Receipt,
    color: 'bg-red-500',
    path: '/accounting-inventory/expenses',
  },
  {
    title: 'Receipt',
    description: 'Generate and print receipts',
    icon: FileText,
    color: 'bg-purple-500',
    path: '/accounting-inventory/receipt',
  },
]

export default function ModuleCard() {
  const navigate = useNavigate()

  return (
    <section>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Management Modules</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.map((mod) => {
          const Icon = mod.icon
          return (
            <button
              key={mod.title}
              type="button"
              onClick={() => navigate(mod.path)}
              className="bg-white rounded-xl shadow-sm p-5 flex items-start gap-4 text-left hover:shadow-md hover:bg-gray-50/50 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <div className={`w-12 h-12 rounded-lg ${mod.color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">{mod.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{mod.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
