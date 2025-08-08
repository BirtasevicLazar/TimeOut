import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from '../components/AdminLogin'
import AdminDashboard from '../components/AdminDashboard'
import CategoriesManager from '../components/CategoriesManager'
import PartyCategoriesManager from '../components/PartyCategoriesManager'
import CategoryDrinksManager from '../components/CategoryDrinksManager'
import DrinksManager from '../components/DrinksManager'
import ScrollToTop from '../../components/ScrollToTop'
import useScrollToTop from '../../hooks/useScrollToTop'
import { checkAuthStatus, getCurrentUser, hasSessionExpired, logoutAdmin } from '../utils/auth'

const AdminApp = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const sessionCheckIntervalRef = useRef(null)
  
  // Hook za automatsko skrolovanje na vrh pri promeni admin rute
  useScrollToTop()

  useEffect(() => {
    initializeAuth()
    // Periodična provera svakih 60 sekundi
    sessionCheckIntervalRef.current = setInterval(handleSessionCheck, 60000)
    return () => {
      if (sessionCheckIntervalRef.current) clearInterval(sessionCheckIntervalRef.current)
    }
  }, [])

  const handleSessionCheck = async () => {
    // Lokalna provera
    if (hasSessionExpired && hasSessionExpired()) {
      await logoutAdmin()
      handleLogout()
      return
    }
    // Server provera (tihi refresh)
    const result = await checkAuthStatus()
    if (!result.success) {
      if (result.expired) {
        await logoutAdmin()
      }
      handleLogout()
    }
  }

  const initializeAuth = async () => {
    setLoading(true)
    const localUser = getCurrentUser()
    if (localUser) {
      setUser(localUser)
      setIsAuthenticated(true)
    }

    // Uvek proveri server (me.php) da bi uhvatio validnu sesiju i produžio je
    const result = await checkAuthStatus()
    if (result.success) {
      setUser(result.user)
      setIsAuthenticated(true)
    } else if (localUser) {
      // Lokalno je postojalo ali server kaže da je isteklo
      handleLogout()
    }

    setLoading(false)
  }

  const handleLoginSuccess = async (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    // Odmah potvrdi i osveži server sesiju
    const result = await checkAuthStatus()
    if (!result.success) {
      handleLogout()
    }
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
          <Route path="/kategorije-zurke" element={<AdminDashboard user={user} onLogout={handleLogout}><PartyCategoriesManager /></AdminDashboard>} />
          <Route path="/kategorije/:categoryId/pica" element={<AdminDashboard user={user} onLogout={handleLogout}><CategoryDrinksManager /></AdminDashboard>} />
          <Route path="/kategorije-zurke/:categoryId/pica" element={<AdminDashboard user={user} onLogout={handleLogout}><CategoryDrinksManager /></AdminDashboard>} />
          <Route path="/pica" element={<AdminDashboard user={user} onLogout={handleLogout}><DrinksManager /></AdminDashboard>} />
          <Route path="*" element={<Navigate to="/admin/" replace />} />
        </Routes>
      ) : (
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  )
}

export default AdminApp
