export const SERVICE_COMMISSION_PHP = {
  'Haircut & Styling': 150,
  'Hair Coloring': 400,
  Haircut: 120,
  Balayage: 500,
  'Keratin Treatment': 600,
  'Manicure & Pedicure': 200,
  'Beard Trim': 80,
  'Haircut & Beard Trim': 180,
  'Hair Extensions': 350,
  'Signature Facial': 250,
  'Facial with Diamond Peel': 280,
}

export const STYLISTS = [
  { id: 's1', name: 'Emma Williams', baseSalaryPerCutoff: 12500 },
  { id: 's2', name: 'James Taylor', baseSalaryPerCutoff: 11000 },
  { id: 's3', name: 'Rachel Adams', baseSalaryPerCutoff: 13000 },
  { id: 's4', name: 'Sophia Martinez', baseSalaryPerCutoff: 11500 },
  { id: 's5', name: 'Michael Ross', baseSalaryPerCutoff: 12000 },
  { id: 's6', name: 'Dimco, Janeth', baseSalaryPerCutoff: 11800 },
]

export const COMPLETED_SERVICES_LOG = [
  { id: 'c1', stylistId: 's1', serviceName: 'Haircut & Styling', serviceDate: '2026-03-03' },
  { id: 'c2', stylistId: 's1', serviceName: 'Hair Coloring', serviceDate: '2026-03-05' },
  { id: 'c3', stylistId: 's1', serviceName: 'Balayage', serviceDate: '2026-03-14' },
  { id: 'c4', stylistId: 's2', serviceName: 'Haircut', serviceDate: '2026-03-02' },
  { id: 'c5', stylistId: 's2', serviceName: 'Beard Trim', serviceDate: '2026-03-12' },
  { id: 'c6', stylistId: 's3', serviceName: 'Keratin Treatment', serviceDate: '2026-03-08' },
  { id: 'c7', stylistId: 's3', serviceName: 'Hair Extensions', serviceDate: '2026-03-15' },
  { id: 'c8', stylistId: 's4', serviceName: 'Manicure & Pedicure', serviceDate: '2026-03-07' },
  { id: 'c9', stylistId: 's5', serviceName: 'Haircut & Beard Trim', serviceDate: '2026-03-11' },
  { id: 'c10', stylistId: 's6', serviceName: 'Signature Facial', serviceDate: '2026-03-26' },
  { id: 'c11', stylistId: 's6', serviceName: 'Facial with Diamond Peel', serviceDate: '2026-03-27' },
  { id: 'c12', stylistId: 's1', serviceName: 'Haircut & Styling', serviceDate: '2026-03-28' },
  { id: 'c13', stylistId: 's2', serviceName: 'Hair Coloring', serviceDate: '2026-03-29' },
  { id: 'c14', stylistId: 's4', serviceName: 'Manicure & Pedicure', serviceDate: '2026-03-30' },
]

export function commissionForService(serviceName) {
  return SERVICE_COMMISSION_PHP[serviceName] ?? 0
}
