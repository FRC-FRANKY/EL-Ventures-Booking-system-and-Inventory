import VIPCustomerCard from './VIPCustomerCard'

const vipCustomers = [
  { name: 'Sophie Brown', phone: '(555) 789-0123', totalSpent: 'PHP 3,200.00', visits: 18 },
  { name: 'Emily Davis', phone: '(555) 345-6789', totalSpent: 'PHP 2,100.00', visits: 15 },
]

export default function VIPCustomersSection() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-card backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-600/15 via-rose-400/20 to-sky-500/15">
          <span className="text-sm font-semibold text-fuchsia-800">₱</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900">VIP customers</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vipCustomers.map((customer) => (
          <VIPCustomerCard key={customer.name} {...customer} />
        ))}
      </div>
    </div>
  )
}
