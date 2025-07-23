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
    
    // Jednostavno - proveri localStorage i to je to
    const localUser = getCurrentUser()
    if (localUser) {
      setUser(localUser)
      setIsAuthenticated(true)
    }
    
    setLoading(false)
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
