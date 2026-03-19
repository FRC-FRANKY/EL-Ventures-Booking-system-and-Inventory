import { Calendar } from 'lucide-react'

const formatDate = (date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function WelcomeBanner({ fullName = 'Receptionist', date = new Date() }) {
  return (
    <div className="rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Welcome, {fullName}
        </h2>
        <p className="text-white/90 text-sm sm:text-base mt-1">
          {formatDate(date)}
        </p>
      </div>
      <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 flex items-center justify-center">
        <Calendar className="w-8 h-8 sm:w-9 sm:h-9 text-white" strokeWidth={2} />
      </div>
    </div>
  )
}
