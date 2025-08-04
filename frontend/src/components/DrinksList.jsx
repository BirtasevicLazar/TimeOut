import { useState, useEffect } from 'react'
import { getApiUrl } from '../utils/api'

const DrinkCard = ({ drink }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-lg p-6 hover:shadow-lg hover:bg-white transition-all duration-200 mobile-optimized fast-tap group">
      {/* Header with name and price */}
      <div className="flex justify-between items-baseline mb-4">
        <h3 className="text-xl font-bold text-gray-900 leading-tight flex-1 pr-6 group-hover:text-orange-800 transition-colors">
          {drink.name}
        </h3>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-orange-600 whitespace-nowrap">
            {drink.price}
          </span>
          <span className="text-sm text-orange-500 ml-1 font-medium">
            RSD
          </span>
        </div>
      </div>
      
      {/* Description */}
      {drink.description && (
        <p className="text-gray-600 text-sm leading-relaxed italic mb-4">
          {drink.description}
        </p>
      )}
      
      {/* Decorative elements */}
      <div className="flex items-center justify-between">
        <div className="flex-1 border-b border-dotted border-gray-300 group-hover:border-orange-300 transition-colors"></div>
        <div className="mx-3 text-orange-400 opacity-50 group-hover:opacity-70 transition-opacity">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <div className="flex-1 border-b border-dotted border-gray-300 group-hover:border-orange-300 transition-colors"></div>
      </div>
    </div>
  )
}

const DrinksList = ({ categoryId, categoryName, onBack }) => {
  const [drinks, setDrinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleBackToCategories = () => {
    onBack()
    // Optimized scroll for mobile devices
    setTimeout(() => {
      // Check if user prefers reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      })
    }, 50) // Reduced timeout for better responsiveness
  }

  useEffect(() => {
    if (categoryId) {
      fetchDrinks()
      // Optimized scroll for mobile - check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      })
    }
  }, [categoryId])

  const fetchDrinks = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(getApiUrl('/drinks/get.php') + `?category_id=${categoryId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch drinks')
      }
      
      setDrinks(data.drinks || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 pb-8">
        <div className="container mx-auto px-4">
          {/* Header with back button */}
          <div className="flex items-center mb-8">
            <button 
              onClick={handleBackToCategories}
              className="flex items-center text-orange-600 hover:text-orange-700 transition-colors mr-4"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Nazad na meni
            </button>
          </div>
          
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 relative">
              {categoryName}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></div>
            </h2>
            <p className="text-gray-600 italic">Učitavam pića...</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            {/* Loading skeleton - optimized for mobile */}
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-white/90 backdrop-blur-sm border rounded-lg p-6 mobile-optimized">
                  <div className="flex justify-between items-start mb-3">
                    <div className="h-6 bg-gray-200 rounded animate-pulse flex-1 mr-4" style={{ animationDuration: '1.5s' }} />
                    <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" style={{ animationDuration: '1.5s' }} />
                  </div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" style={{ animationDuration: '1.5s' }} />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" style={{ animationDuration: '1.5s' }} />
                  <div className="mt-4 border-b border-dotted border-gray-300"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 pb-8">
        <div className="container mx-auto px-4">
          {/* Header with back button */}
          <div className="flex items-center mb-8">
            <button 
              onClick={handleBackToCategories}
              className="flex items-center text-orange-600 hover:text-orange-700 transition-colors mr-4"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Nazad na meni
            </button>
          </div>
          
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md mx-auto shadow-sm">
              <p className="font-bold mb-2">Ups! Dogodila se greška</p>
              <p className="text-sm">{error}</p>
            </div>
            <button 
              onClick={fetchDrinks}
              className="mt-6 bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors shadow-sm font-medium"
            >
              Pokušaj ponovo
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 pb-8">
      <div className="container mx-auto px-4">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <button 
            onClick={handleBackToCategories}
            className="flex items-center text-orange-600 hover:text-orange-700 transition-colors font-medium"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Nazad na meni
          </button>
        </div>
        
        {/* Category title with elegant styling */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 relative">
            {categoryName}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></div>
          </h2>
          <p className="text-gray-600 italic">Izaberite svoje omiljeno piće</p>
        </div>

        {drinks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">Nema dostupnih pića u ovoj kategoriji</p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {/* Menu header decorative line */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex-1 border-t border-gray-300"></div>
              <div className="mx-4 text-orange-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
            
            {/* Menu items */}
            <div className="space-y-3">
              {drinks.map((drink, index) => (
                <div key={drink.id}>
                  <DrinkCard drink={drink} />
                  {index < drinks.length - 1 && <div className="h-2"></div>}
                </div>
              ))}
            </div>
            
            {/* Footer decorative line */}
            <div className="flex items-center justify-center mt-8">
              <div className="flex-1 border-t border-gray-300"></div>
              <div className="mx-4 text-orange-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
          </div>
        )}
        
    
      </div>
    </div>
  )
}

export default DrinksList
