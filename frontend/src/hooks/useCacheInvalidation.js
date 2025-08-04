import { useEffect } from 'react'
import { clearCategoriesCache, clearPartyCategoriesCache } from '../utils/cache'

// Hook za čišćenje cache-a kada se admin promeni kategorije
export const useCacheInvalidation = () => {
  
  // Funkcija za invalidiranje kategorija cache-a
  const invalidateCategories = () => {
    clearCategoriesCache()
    clearPartyCategoriesCache()
  }

  // Postavi event listener za storage event (ako je admin u drugom tab-u)
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Ako je admin napravio promene, invalidiraj cache
      if (e.key === 'admin_categories_changed') {
        invalidateCategories()
        localStorage.removeItem('admin_categories_changed')
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return {
    invalidateCategories
  }
}

// Funkcija koju admin koristi da signalizira promene
export const notifyAdminChanges = () => {
  try {
    // Postavi flag da su kategorije promenjene
    localStorage.setItem('admin_categories_changed', Date.now().toString())
    
    // Takođe očisti cache direktno
    clearCategoriesCache()
    clearPartyCategoriesCache()
    
    // Triggeruj custom event za trenutnu stranicu
    window.dispatchEvent(new CustomEvent('admin_categories_changed'))
  } catch (error) {
    console.warn('Failed to notify admin changes:', error)
  }
}
