import VIPCustomerCard from './VIPCustomerCard'

const vipCustomers = [
  { name: 'Sophie Brown', phone: '(555) 789-0123', totalSpent: 'PHP 3,200.00', visits: 18 },
  { name: 'Emily Davis', phone: '(555) 345-6789', totalSpent: 'PHP 2,100.00', visits: 15 },
]

export default function VIPCustomersSection() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
          <span className="text-sm font-semibold text-amber-700">₱</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900">VIP Customers</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vipCustomers.map((customer) => (
          <VIPCustomerCard key={customer.name} {...customer} />
        ))}
      </div>
    </div>
  )
}
