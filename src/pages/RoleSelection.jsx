import { useNavigate } from 'react-router-dom'
import '../css/pages/RoleSelection.css'

const ROLES = [
  {
    id: 'hr-manager',
    title: 'HR Manager',
    description: 'Access daily reports and employee management.',
    iconColor: 'purple',
    loginPath: '/login/hr-manager',
  },
  {
    id: 'receptionist',
    title: 'Receptionist',
    description: 'Manage appointments and customer database',
    iconColor: 'blue',
    loginPath: '/login/receptionist',
  },
  {
    id: 'accounting-inventory',
    title: 'Accounting & Inventory',
    description: 'Handle inventory, sales, expenses, and receipts',
    iconColor: 'green',
    loginPath: '/login/accounting-inventory',
  },
]

function RoleCard({ role }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(role.loginPath)
  }

  return (
    <button
      type="button"
      className="role-card"
      onClick={handleClick}
      aria-label={`Select ${role.title} role`}
    >
      <div className={`role-card__icon role-card__icon--${role.iconColor}`}>
        {role.iconColor === 'purple' && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
          </svg>
        )}
        {role.iconColor === 'blue' && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="9" cy="8" r="3" />
            <circle cx="15" cy="8" r="3" />
            <path d="M5 20c0-3 2-5 4-5s4 2 4 5M15 20c0-3 2-5 4-5s4 2 4 5" />
          </svg>
        )}
        {role.iconColor === 'green' && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <path d="M8 6h8M8 10h8M8 14h4" />
          </svg>
        )}
      </div>
      <h2 className="role-card__title">{role.title}</h2>
      <p className="role-card__description">{role.description}</p>
    </button>
  )
}

export default function RoleSelection() {
  return (
    <div className="role-selection">
      <header className="role-selection__header">
        <h1 className="role-selection__title">EL Ventures Incorporated</h1>
        <p className="role-selection__subtitle">Select Your Role to Continue.</p>
      </header>

      <div className="role-selection__cards" role="list">
        {ROLES.map((role) => (
          <div key={role.id} className="role-selection__card-wrapper" role="listitem">
            <RoleCard role={role} />
          </div>
        ))}
      </div>

      <p className="role-selection__instruction">
        Choose your role to access the appropriate management tools.
      </p>
    </div>
  )
}
