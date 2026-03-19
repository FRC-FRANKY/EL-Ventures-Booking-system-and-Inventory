import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
export const auth = getAuth(app)
export const db = getDatabase(app)



