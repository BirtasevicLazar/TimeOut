const API_BASE_URL = 'http://localhost:8888/TimeOut/backend'

// Login funkcija
export const loginAdmin = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
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
    console.error('Login error:', error)
    return { success: false, error: 'Greška pri povezivanju sa serverom' }
  }
}

// Logout funkcija
export const logoutAdmin = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout.php`, {
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
    console.error('Logout error:', error)
    return { success: false, error: 'Greška pri odjavljivanju' }
  }
}

// Proveri da li je admin ulogovan
export const checkAuthStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me.php`, {
      method: 'GET',
      credentials: 'include'
    })

    if (response.ok) {
      const data = await response.json()
      // Ažuriraj localStorage
      localStorage.setItem('admin_user', JSON.stringify(data.user))
      return { success: true, user: data.user }
    } else {
      // Očisti localStorage ako server kaže da nismo logovani
      localStorage.removeItem('admin_user')
      return { success: false }
    }
  } catch (error) {
    console.error('Auth check error:', error)
    localStorage.removeItem('admin_user')
    return { success: false }
  }
}

// Dobij trenutnog korisnika iz localStorage
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('admin_user')
    return user ? JSON.parse(user) : null
  } catch (error) {
    console.error('Error getting current user:', error)
    localStorage.removeItem('admin_user')
    return null
  }
}

// Proveri da li je korisnik ulogovan (samo localStorage)
export const isAuthenticated = () => {
  return getCurrentUser() !== null
}
