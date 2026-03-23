import { initializeApp } from 'firebase/app'
import { getDatabase, get, ref, update } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyBVAuC8XlF_76ILkyuKwSGNtYOT-6ujfaY',
  authDomain: 'el-venture-incorporated.firebaseapp.com',
  databaseURL: 'https://el-venture-incorporated-default-rtdb.firebaseio.com',
  projectId: 'el-venture-incorporated',
  storageBucket: 'el-venture-incorporated.firebasestorage.app',
  messagingSenderId: '327302567876',
  appId: '1:327302567876:web:62f1524a944f6d0faaf691',
  measurementId: 'G-JJL7C7F8E4',
}

const TARGET_BY_BRANCH = {
  'Mandaue Branch': {
    'Dela Torre, Imae Rose': 'Nail Technician',
    'Yekla, Sanny Grace': 'Facialist / Massage Therapist',
    'Davis, Rosegina': 'Hair and Nail Technician',
    'Momo, Ruthamie': 'Hair and Nail Technician',
  },
  'Pajac Branch': {
    'Arnado, Buenafe': 'Nail Technician',
    'Omac, Elvira': 'Nail Technician',
    'Belarmino, Mattlaine Clyrr': 'Facialist',
    'Entig, Jenalyn': 'Nail Technician',
    'Gloria, Francisco': 'Barber',
    'Demape, Keyn Joshua': 'Barber',
  },
  'Pusok Branch': {
    'Abadajos, Julie Ann': 'Facialist',
    'Pedor, Rowena': 'Nail Technician',
    'Dimco, Janeth': 'Hairdresser',
  },
  'Cebu City Branch': {
    'Macatanong, Jessica': 'Nail Technician',
    'Tallo, Lucille': 'Hairdresser',
    'Cañizares, Rubelyn': 'Facialist',
    'Cabreles, Jennifer': 'Nail Technician',
    'Dela Torre, Jeanny': 'Facialist',
  },
}

function normalizeName(value) {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ')
}

function resolveRole(branchName, stylistName) {
  const target = TARGET_BY_BRANCH[branchName]
  if (!target) return null
  const byNorm = new Map(
    Object.entries(target).map(([name, role]) => [normalizeName(name), role])
  )
  return byNorm.get(normalizeName(stylistName)) || null
}

function toEntries(stylistsNode) {
  if (!stylistsNode) return []
  if (Array.isArray(stylistsNode)) {
    return stylistsNode.map((value, index) => [String(index), value])
  }
  if (typeof stylistsNode === 'object') {
    return Object.entries(stylistsNode)
  }
  return []
}

async function run() {
  const app = initializeApp(firebaseConfig)
  const db = getDatabase(app)
  const updates = {}
  let matched = 0

  for (const branchName of Object.keys(TARGET_BY_BRANCH)) {
    const stylistsRef = ref(db, `branches/${branchName}/stylists`)
    const snap = await get(stylistsRef)
    if (!snap.exists()) continue

    const node = snap.val()
    for (const [id, row] of toEntries(node)) {
      if (!row || typeof row !== 'object') continue
      const name = row.fullName || row.name || row.stylistName
      if (!name) continue
      const role = resolveRole(branchName, name)
      if (!role) continue
      updates[`branches/${branchName}/stylists/${id}/role`] = role
      matched += 1
    }
  }

  if (Object.keys(updates).length === 0) {
    console.log('No matching stylist records found to update.')
    return
  }

  await update(ref(db), updates)
  console.log(`Updated ${matched} stylist role records.`)
}

run().catch((error) => {
  console.error('Failed to update stylist roles:', error?.message || error)
  process.exitCode = 1
})

