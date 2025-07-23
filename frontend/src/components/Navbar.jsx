import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

const MotionLink = motion.create(Link)

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handleInternalLinkClick = () => {
    closeMenu()
    scrollToTop()
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

  const menuItems = [
    { name: 'Početna', href: '/', internal: true },
    { name: 'Kontakt', href: '/contact', internal: true },
    { name: 'Instagram', href: 'https://www.instagram.com/timeoutloungebar/', external: true },
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
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Link
                to="/"
                className={`text-2xl font-bold transition-colors duration-300 ${
                  scrolled ? 'text-orange-600' : 'text-white'
                }`}
              >
                TimeOut
              </Link>
            </div>

            {/* Desktop Menu - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => (
                item.external ? (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`font-medium transition-colors duration-300 hover:text-orange-400 flex items-center space-x-1 ${
                      scrolled ? 'text-gray-700' : 'text-white'
                    }`}
                  >
                    <span>{item.name}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={handleInternalLinkClick}
                    className={`font-medium transition-colors duration-300 hover:text-orange-400 ${
                      scrolled ? 'text-gray-700' : 'text-white'
                    } ${location.pathname === item.href ? 'text-orange-400' : ''}`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>

            {/* Mobile Menu Button - Only visible on mobile */}
            <button 
              onClick={toggleMenu}
              className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
                scrolled 
                  ? 'text-gray-600 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/20'
              }`}
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
              className="absolute inset-0 bg-black/50"
              onClick={closeMenu}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.3 }}
            />
            
            {/* Menu Panel */}
            <motion.div 
              className="absolute top-0 right-0 h-full w-70 bg-white shadow-2xl z-10"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Meni</h2>
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
                {menuItems.map((item, i) => (
                  item.external ? (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeMenu}
                      className="flex items-center justify-between px-6 py-4 text-gray-800 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200 font-medium"
                      custom={i}
                      variants={menuItemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <span>{item.name}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </motion.a>
                  ) : (
                    <MotionLink
                      key={item.name}
                      to={item.href}
                      onClick={handleInternalLinkClick}
                      className={`flex items-center w-full px-6 py-4 text-left text-gray-800 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200 font-medium ${
                        location.pathname === item.href ? 'bg-orange-50 text-orange-600' : ''
                      }`}
                      custom={i}
                      variants={menuItemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <span>{item.name}</span>
                    </MotionLink>
                  )
                ))}
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
                  <p className="text-sm text-gray-600">Ukusi koji oduševljavaju</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
