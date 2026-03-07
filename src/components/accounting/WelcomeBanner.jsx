import { DollarSign } from 'lucide-react'

const formatDate = (date) =>
  date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

export default function WelcomeBanner() {
  return (
    <div className="rounded-xl bg-gradient-to-r from-green-500 to-teal-500 p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Welcome, Accounting & Inventory
        </h2>
        <p className="text-white/90 text-sm sm:text-base mt-1">
          {formatDate(new Date())}
        </p>
      </div>
      <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 flex items-center justify-center">
        <DollarSign className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={1.5} />
      </div>
    </div>
  )
}
