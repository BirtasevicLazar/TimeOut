import { API_BASE_URL, getApiUrl } from '../../utils/api'

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
    
    if (response.ok) {
      return { success: true }
    } else {
      const data = await response.json()
      return { success: false, error: data.error }
    }
  } catch (error) {
    // Uvek očisti localStorage
    localStorage.removeItem('admin_user')
    return { success: false, error: 'Greška pri odjavljivanju' }
  }
}

// Anti-spam varijabla za auth provere
let authCheckInProgress = false

// Proveri da li je admin ulogovan
export const checkAuthStatus = async () => {
  // Spreči simultane pozive
  if (authCheckInProgress) {
    console.log('Auth check already in progress, skipping...')
    return { success: false, inProgress: true }
  }

  try {
    authCheckInProgress = true
    console.log('Checking auth status...')
    
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
        console.log('Auth check successful')
        // Ažuriraj localStorage
        localStorage.setItem('admin_user', JSON.stringify(data.user))
        return { success: true, user: data.user }
      }
    }
    
    console.log('Auth check failed - server response:', response.status)
    // Samo očisti localStorage, ne vraćaj grešku odmah
    localStorage.removeItem('admin_user')
    return { success: false }
  } catch (error) {
    // Promeni sa console.error na console.warn za manje agresivan log
    console.warn('Auth check network error:', error.message)
    // Ne uklanjaj localStorage u slučaju network greške
    return { success: false, networkError: true }
  } finally {
    authCheckInProgress = false
  }
}

// Dobij trenutnog korisnika iz localStorage
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('admin_user')
    return user ? JSON.parse(user) : null
  } catch (error) {
    localStorage.removeItem('admin_user')
    return null
  }
}

// Proveri da li je korisnik ulogovan (samo localStorage)
export const isAuthenticated = () => {
  return getCurrentUser() !== null
}
