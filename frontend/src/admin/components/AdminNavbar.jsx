import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { logoutAdmin } from '../utils/auth'

const AdminNavbar = ({ user, onLogout }) => {
  const [scrolled, setScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  // Close menu when clicking outside
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const handleLogout = async () => {
    closeMenu()
    await logoutAdmin()
    onLogout()
  }

  const menuItems = [
    { 
      name: 'Kategorije', 
      path: '/admin/kategorije',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      action: () => {
        closeMenu()
        navigate('/admin/kategorije')
      }
    },
    { 
      name: 'Pića', 
      path: '/admin/pica',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18z" />
        </svg>
      ),
      action: () => {
        closeMenu()
        navigate('/admin/pica')
      }
    },
    { 
      name: 'Odjavi se', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
      action: handleLogout,
      isLogout: true
    }
  ]

  // Framer Motion variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const menuVariants = {
    hidden: { 
      x: '100%',
      transition: {
        type: 'tween',
        duration: 0.3
      }
    },
    visible: { 
      x: 0,
      transition: {
        type: 'tween',
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  }

  const menuItemVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1 + 0.3,
        duration: 0.3,
        ease: 'easeOut'
      }
    })
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-lg' 
          : 'bg-white shadow-sm'
      }`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-orange-600">TimeOut Admin</h1>
                <p className="text-xs text-gray-600 hidden sm:block">Dobrodošli, {user?.username}</p>
              </div>
            </div>

            {/* Desktop Menu - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-6">
              {menuItems.map((item) => {
                const isActive = item.path && location.pathname === item.path
                return (
                  <button
                    key={item.name}
                    onClick={item.action}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors duration-300 ${
                      item.isLogout 
                        ? 'text-red-600 hover:bg-red-50' 
                        : isActive
                          ? 'text-orange-600 bg-orange-50'
                          : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </button>
                )
              })}
            </div>

            {/* Mobile Menu Button - Only visible on mobile */}
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay with Framer Motion */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-60 md:hidden">
            {/* Background overlay */}
            <motion.div 
              className="absolute inset-0 bg-white/60 backdrop-blur-sm"
              onClick={closeMenu}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.3 }}
            />
            
            {/* Menu Panel */}
            <motion.div 
              className="absolute top-0 right-0 h-full w-80 bg-white shadow-2xl"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">Admin Meni</h2>
                    <p className="text-sm text-gray-600">{user?.username}</p>
                  </div>
                </div>
                <button 
                  onClick={closeMenu}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Menu Items */}
              <div className="py-6">
                {menuItems.map((item, i) => {
                  const isActive = item.path && location.pathname === item.path
                  return (
                    <motion.button
                      key={item.name}
                      onClick={item.action}
                      className={`flex items-center w-full px-6 py-4 text-left transition-colors duration-200 font-medium ${
                        item.isLogout 
                          ? 'text-red-600 hover:bg-red-50' 
                          : isActive
                            ? 'text-orange-600 bg-orange-50'
                            : 'text-gray-800 hover:bg-orange-50 hover:text-orange-600'
                      }`}
                      custom={i}
                      variants={menuItemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <div className="flex items-center space-x-3">
                        {item.icon}
                        <span>{item.name}</span>
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {/* Menu Footer */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.3 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-2">TimeOut</div>
                  <p className="text-sm text-gray-600">Admin panel</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AdminNavbar
