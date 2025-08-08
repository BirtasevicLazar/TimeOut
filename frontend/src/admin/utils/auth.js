import { API_BASE_URL, getApiUrl } from '../../utils/api'

const SESSION_DURATION_MS = 2 * 60 * 60 * 1000 // 2 sata
const LOGIN_TIMESTAMP_KEY = 'admin_login_time'

function setLoginTimestamp() {
  localStorage.setItem(LOGIN_TIMESTAMP_KEY, Date.now().toString())
}

function clearLoginTimestamp() {
  localStorage.removeItem(LOGIN_TIMESTAMP_KEY)
}

function isSessionExpired() {
  const ts = localStorage.getItem(LOGIN_TIMESTAMP_KEY)
  if (!ts) return true
  const loginTime = parseInt(ts, 10)
  if (isNaN(loginTime)) return true
  return Date.now() - loginTime > SESSION_DURATION_MS
}

// Login funkcija
export const loginAdmin = async (username, password) => {
  try {
    const response = await fetch(getApiUrl('/auth/login.php'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Važno za session cookies
      body: JSON.stringify({
        username,
        password
      })
    })

    const data = await response.json()

    if (response.ok) {
      // Sačuvaj korisničke podatke u localStorage
      localStorage.setItem('admin_user', JSON.stringify(data.user))
      setLoginTimestamp()
      return { success: true, user: data.user }
    } else {
      return { success: false, error: data.error }
    }
  } catch (error) {
    return { success: false, error: 'Greška pri prijavljivanju' }
  }
}

// Logout funkcija
export const logoutAdmin = async () => {
  try {
    const response = await fetch(getApiUrl('/auth/logout.php'), {
      method: 'POST',
      credentials: 'include'
    })

    // Očisti localStorage bez obzira na odgovor servera
    localStorage.removeItem('admin_user')
    clearLoginTimestamp()
    
    if (response.ok) {
      return { success: true }
    } else {
      const data = await response.json()
      return { success: false, error: data.error }
    }
  } catch (error) {
    // Uvek očisti localStorage
    localStorage.removeItem('admin_user')
    clearLoginTimestamp()
    return { success: false, error: 'Greška pri odjavljivanju' }
  }
}

// Proveri da li je admin ulogovan (server + local)
export const checkAuthStatus = async () => {
  // Prvo proveri lokalni istekao session
  if (isSessionExpired()) {
    localStorage.removeItem('admin_user')
    clearLoginTimestamp()
    return { success: false, expired: true }
  }

  try {
    const response = await fetch(getApiUrl('/auth/me.php'), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })

    if (response.ok) {
      const data = await response.json()
      if (data.success) {
        // Ažuriraj localStorage i produži timestamp (rolling session)
        localStorage.setItem('admin_user', JSON.stringify(data.user))
        setLoginTimestamp()
        return { success: true, user: data.user }
      }
    } else if (response.status === 401) {
      // Server kaže da nije validno
      localStorage.removeItem('admin_user')
      clearLoginTimestamp()
      return { success: false, expired: true }
    }
    
    // Server session nije validna
    localStorage.removeItem('admin_user')
    clearLoginTimestamp()
    return { success: false }
  } catch (error) {
    // Network greška - ne uklanjaj localStorage
    return { success: false, networkError: true }
  }
}

// Dobij trenutnog korisnika iz localStorage
export const getCurrentUser = () => {
  try {
    if (isSessionExpired()) {
      localStorage.removeItem('admin_user')
      clearLoginTimestamp()
      return null
    }
    const user = localStorage.getItem('admin_user')
    return user ? JSON.parse(user) : null
  } catch (error) {
    localStorage.removeItem('admin_user')
    clearLoginTimestamp()
    return null
  }
}

// Proveri da li je korisnik ulogovan (samo localStorage)
export const isAuthenticated = () => {
  return getCurrentUser() !== null
}

// Utility za eksterno proveru isteka
export const hasSessionExpired = isSessionExpired
