import { useState, useEffect } from 'react'
import { getPartyCategories } from '../admin/utils/categories'
import { getImageUrl, getApiUrl } from '../utils/api'
import { getPartyCategoriesCache, setPartyCategoriesCache, isCacheValid, cacheKeys } from '../utils/cache'
import PartyNavbar from './PartyNavbar'
import DrinksList from './DrinksList'
import Footer from './Footer'
import { useCacheInvalidation } from '../hooks/useCacheInvalidation'

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

const Hero = () => {
  const scrollToCategories = () => {
    window.scrollTo({
      top: window.innerHeight * 0.4,
      behavior: 'smooth'
    })
  }

  return (
    <div className="relative h-[50vh] overflow-visible">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('/pzo2.jpg')`
        }}
      />
      
      {/* Curved bottom edge */}
      <div className="absolute -bottom-1 left-0 right-0 h-8 bg-gray-50 rounded-t-[4rem] z-20"></div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white px-6 max-w-lg">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Dobrodošli u
            <span className="block text-orange-400">TimeOut</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
            Tvoje omiljeno mesto u gradu
          </p>
          
          {/* Scroll indicator */}
          <div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer mb-4"
            onClick={scrollToCategories}
          >
            <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const PartyCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const { invalidateCategories } = useCacheInvalidation()

  useEffect(() => {
    fetchCategories()
  }, [])

  // Slušaj za admin promene
  useEffect(() => {
    const handleAdminChanges = () => {
      // Refetch kategorije kada admin napravi promene
      fetchCategories()
    }

    window.addEventListener('admin_categories_changed', handleAdminChanges)
    
    return () => {
      window.removeEventListener('admin_categories_changed', handleAdminChanges)
    }
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Prvo pokušaj da učitaš iz cache-a
      const cachedCategories = getPartyCategoriesCache()
      if (cachedCategories && isCacheValid(cacheKeys.PARTY_CATEGORIES)) {
        setCategories(cachedCategories)
        setLoading(false)
        return
      }
      
      // Ako nema cache-a ili je expired, učitaj sa servera
      const result = await getPartyCategories()
      
      if (result.success) {
        const categories = result.categories || []
        setCategories(categories)
        
        // Sačuvaj u cache za buduće korišćenje
        setPartyCategoriesCache(categories)
      } else {
        throw new Error(result.error || 'Greška pri učitavanju kategorija')
      }
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
  }

  const handleBackToCategories = () => {
    setSelectedCategory(null)
  }

  const PartyContent = () => (
    <>
      <Hero />
      {selectedCategory ? (
        <DrinksList 
          categoryId={selectedCategory.id}
          categoryName={selectedCategory.name}
          onBack={handleBackToCategories}
        />
      ) : (
        <div className="min-h-screen bg-gray-50 pb-8">
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
                    onClick={handleCategorySelect}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )

  if (loading) {
    return (
      <>
        <PartyNavbar />
        <PartyContent />
      </>
    )
  }

  if (error) {
    return (
      <>
        <PartyNavbar />
        <Hero />
        <div className="min-h-screen bg-gray-50 py-4 pb-8">
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
        <Footer />
      </>
    )
  }

  return (
    <>
      <PartyNavbar />
      <PartyContent />
      <Footer />
    </>
  )
}

export default PartyCategories
