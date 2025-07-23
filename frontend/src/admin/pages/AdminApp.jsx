import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from '../components/AdminLogin'
import AdminDashboard from '../components/AdminDashboard'
import CategoriesManager from '../components/CategoriesManager'
import DrinksManager from '../components/DrinksManager'
import ScrollToTop from '../../components/ScrollToTop'
import useScrollToTop from '../../hooks/useScrollToTop'
import { checkAuthStatus, getCurrentUser } from '../utils/auth'

const AdminApp = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Hook za automatsko skrolovanje na vrh pri promeni admin rute
  useScrollToTop()

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    setLoading(true)
    
    // Prvo proveri localStorage
    const localUser = getCurrentUser()
    if (localUser) {
      setUser(localUser)
      setIsAuthenticated(true)
      setLoading(false) // Završi loading odmah
      
      // Zatim u pozadini proveri sa serverom (bez blokiranja UI)
      // SAMO kada je korisnik već "ulogovan" lokalno
      setTimeout(async () => {
        const authStatus = await checkAuthStatus()
        if (authStatus.inProgress) {
          return // Preskoči ako je već u toku
        }
        if (!authStatus.success && !authStatus.networkError) {
          console.log('Background auth check failed - session expired')
          handleLogout()
        } else if (authStatus.success && authStatus.user) {
          // Ažuriraj korisničke podatke sa servera
          setUser(authStatus.user)
        }
      }, 500) // Sačekaj malo da se UI učita
    } else {
      // Nema korisnika u localStorage - samo završi loading, ne pozivaj server
      console.log('No user in localStorage, showing login form')
      setLoading(false)
    }
  }

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Učitavanje...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <ScrollToTop />
      {isAuthenticated ? (
        <Routes>
          <Route path="/" element={<AdminDashboard user={user} onLogout={handleLogout} />} />
          <Route path="/kategorije" element={<AdminDashboard user={user} onLogout={handleLogout}><CategoriesManager /></AdminDashboard>} />
          <Route path="/pica" element={<AdminDashboard user={user} onLogout={handleLogout}><DrinksManager /></AdminDashboard>} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      ) : (
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  )
}

export default AdminApp
