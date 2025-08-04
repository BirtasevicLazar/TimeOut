// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://timeout035.com/backend'

// Helper funkcije za različite tipove URL-ova
export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  // Ako je imagePath već pun URL, vrati ga
  if (imagePath.startsWith('http')) return imagePath
  
  // Normalizuj putanje - ukloni leading slash ako postoji
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath
  
  return `https://timeout035.com/${cleanPath}`
}

export const getCategoryImageUrl = (imagePath) => {
  if (!imagePath) return null
  
  // Ako je imagePath samo ime fajla
  if (!imagePath.includes('/')) {
    return `https://timeout035.com/backend/uploads/categories/${imagePath}`
  }
  
  // Ako je puna putanja
  return getImageUrl(imagePath)
}
