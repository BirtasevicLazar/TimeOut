import { useState, useEffect } from 'react'
import { getImageUrl } from '../utils/api'

const CategoryCard = ({ category, onClick }) => {
  const hasImage = category.image_url && category.image_url.trim() !== ''
  const imageUrl = hasImage ? getImageUrl(category.image_url) : null
  
  return (
    <div 
      onClick={() => onClick(category)}
      className="relative h-32 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200 cursor-pointer mobile-optimized fast-tap"
      style={{
        backgroundImage: imageUrl 
          ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${imageUrl})`
          : 'linear-gradient(135deg, #ea5a1a 0%, #f97316 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h3 className="text-xl font-bold text-white text-center px-4">
          {category.name}
        </h3>
      </div>
      
      {/* Subtle hover overlay - optimized for mobile */}
      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200" />
    </div>
  )
}

const CategoryList = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/categories/get.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setCategories(data.categories || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = (category) => {
    if (onCategorySelect) {
      onCategorySelect(category)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4">
        <div className="container mx-auto px-2">
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-4">
        <div className="container mx-auto px-2">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-bold">Greška</p>
              <p>{error}</p>
            </div>
            <button 
              onClick={fetchCategories}
              className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Pokušaj ponovo
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-2">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          Naš meni
        </h2>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">Trenutno nema dostupnih kategorija</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                onClick={handleCategoryClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryList
