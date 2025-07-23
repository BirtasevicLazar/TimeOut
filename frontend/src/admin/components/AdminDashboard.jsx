import { useState, useEffect } from 'react'
import { logoutAdmin } from '../utils/auth'
import CategoriesManager from './CategoriesManager'
import AdminNavbar from './AdminNavbar'

const AdminDashboard = ({ user, onLogout, children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <AdminNavbar user={user} onLogout={onLogout} />

      {/* Main Content - dodat pt-20 da se izbegne preklapanje sa navbar-om */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-20 sm:pt-24">
        {children || <CategoriesManager />}
      </div>
    </div>
  )
}

export default AdminDashboard
