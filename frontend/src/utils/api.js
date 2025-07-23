// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8888/TimeOut/backend'

// Helper funkcije za različite tipove URL-ova
export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  // Ako je imagePath već pun URL, vrati ga
  if (imagePath.startsWith('http')) return imagePath
  // Inače, dodaj base URL
  return imagePath.startsWith('/') 
    ? `http://192.168.1.5:8888${imagePath}` 
    : `http://192.168.1.5:8888/${imagePath}`
}

export const getCategoryImageUrl = (imagePath) => {
  if (!imagePath) return null
  return `${API_BASE_URL}/uploads/categories/${imagePath.split('/').pop()}`
}

export const getDrinkImageUrl = (imagePath) => {
  if (!imagePath) return null
  return `http://192.168.1.5:8888${imagePath}`
}
