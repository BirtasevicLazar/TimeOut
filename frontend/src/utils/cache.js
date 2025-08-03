// Cache utility for frontend data
const CACHE_DURATION = 5 * 60 * 1000; // 5 minuta u milisekundama

export const cacheKeys = {
  CATEGORIES: 'categories_cache'
};

// Generička funkcija za čuvanje u cache
export const setCache = (key, data) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + CACHE_DURATION
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Cache write failed:', error);
  }
};

// Generička funkcija za čitanje iz cache
export const getCache = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const cacheData = JSON.parse(cached);
    
    // Proveri da li je cache expired
    if (Date.now() > cacheData.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }

    return cacheData.data;
  } catch (error) {
    console.warn('Cache read failed:', error);
    localStorage.removeItem(key);
    return null;
  }
};

// Očisti cache za specifičan ključ
export const clearCache = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Cache clear failed:', error);
  }
};

// Očisti sav cache
export const clearAllCache = () => {
  try {
    Object.values(cacheKeys).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.warn('Cache clear all failed:', error);
  }
};

// Specifične funkcije za kategorije
export const setCategoriesCache = (categories) => {
  setCache(cacheKeys.CATEGORIES, categories);
};

export const getCategoriesCache = () => {
  return getCache(cacheKeys.CATEGORIES);
};

export const clearCategoriesCache = () => {
  clearCache(cacheKeys.CATEGORIES);
};

// Proveri da li je cache još uvek valjan
export const isCacheValid = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return false;

    const cacheData = JSON.parse(cached);
    return Date.now() <= cacheData.expiresAt;
  } catch (error) {
    return false;
  }
};
