import { useState, useEffect } from 'react'

const DrinkCard = ({ drink }) => {
  const hasImage = drink.image_url && drink.image_url.trim() !== ''
  const imageUrl = hasImage ? `http://localhost:8888${drink.image_url}` : null
  
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={drink.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        
        {/* Fallback background */}
        <div 
          className={`${imageUrl ? 'hidden' : 'flex'} w-full h-full items-center justify-center`}
          style={{
            background: 'linear-gradient(135deg, #ea5a1a 0%, #f97316 100%)'
          }}
        >
          <div className="text-white text-4xl font-bold">
            {drink.name.charAt(0)}
          </div>
        </div>
        
        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-orange-600 text-white px-3 py-1 rounded-full font-bold text-sm">
          {drink.price} RSD
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {drink.name}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {drink.description}
        </p>
      </div>
    </div>
  )
}

const DrinksList = ({ categoryId, categoryName, onBack }) => {
  const [drinks, setDrinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (categoryId) {
      fetchDrinks()
    }
  }, [categoryId])

  const fetchDrinks = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log(`Fetching drinks for category ${categoryId}...`)
      
      const response = await fetch(`http://localhost:8888/TimeOut/backend/drinks/get.php?category_id=${categoryId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Received drinks data:', data)
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch drinks')
      }
      
      setDrinks(data.drinks || [])
      console.log('Drinks set:', data.drinks)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching drinks:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          {/* Header with back button */}
          <div className="flex items-center mb-8">
            <button 
              onClick={onBack}
              className="flex items-center text-orange-600 hover:text-orange-700 transition-colors mr-4"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Nazad na meni
            </button>
          </div>
          
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            {categoryName}
          </h2>
          
          {/* Loading skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse" />
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          {/* Header with back button */}
          <div className="flex items-center mb-8">
            <button 
              onClick={onBack}
              className="flex items-center text-orange-600 hover:text-orange-700 transition-colors mr-4"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Nazad na meni
            </button>
          </div>
          
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
              <p className="font-bold">Greška</p>
              <p>{error}</p>
            </div>
            <button 
              onClick={fetchDrinks}
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
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="container mx-auto px-4">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <button 
            onClick={onBack}
            className="flex items-center text-orange-600 hover:text-orange-700 transition-colors font-medium"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Nazad na meni
          </button>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {categoryName}
        </h2>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drinks.map((drink) => (
              <DrinkCard key={drink.id} drink={drink} />
            ))}
          </div>
        )}
        
    
      </div>
    </div>
  )
}

export default DrinksList
