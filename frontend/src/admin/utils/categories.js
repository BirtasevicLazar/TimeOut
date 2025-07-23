import { API_BASE_URL, getApiUrl } from '../../utils/api'

// Dobij sve kategorije
export const getCategories = async () => {
  try {
    const response = await fetch(getApiUrl('/categories/get.php'), {
      method: 'GET',
      credentials: 'include'
    })

    const data = await response.json()

    if (response.ok) {
      return { success: true, categories: data.categories, count: data.count }
    } else {
      return { success: false, error: data.error }
    }
  } catch (error) {
    return { success: false, error: 'Greška pri dobijanju kategorija' }
  }
}

// Dobij jednu kategoriju po ID-u
export const getCategory = async (id) => {
  try {
    const response = await fetch(getApiUrl(`/categories/get.php?id=${id}`), {
      method: 'GET',
      credentials: 'include'
    })

    const data = await response.json()

    if (response.ok) {
      return { success: true, category: data.category }
    } else {
      return { success: false, error: data.error }
    }
  } catch (error) {
    return { success: false, error: 'Greška pri dobijanju kategorije' }
  }
}

// Kreiraj novu kategoriju
export const createCategory = async (name, image = null) => {
  try {
    const formData = new FormData()
    formData.append('name', name)
    
    if (image) {
      formData.append('image', image)
    }

    const response = await fetch(getApiUrl('/categories/create.php'), {
      method: 'POST',
      credentials: 'include',
      body: formData
    })

    const data = await response.json()

    if (response.ok) {
      return { success: true, category: data.category, message: data.message }
    } else {
      return { success: false, error: data.error }
    }
  } catch (error) {
    return { success: false, error: 'Greška pri kreiranju kategorije' }
  }
}

// Ažuriraj kategoriju
export const updateCategory = async (id, name, image = null) => {
  try {
    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('id', id)
    formData.append('name', name)
    
    if (image) {
      formData.append('image', image)
    }

    const response = await fetch(getApiUrl('/categories/update.php'), {
      method: 'POST',
      credentials: 'include',
      body: formData
    })

    const data = await response.json()

    if (response.ok) {
      return { success: true, category: data.category, message: data.message }
    } else {
      return { success: false, error: data.error }
    }
  } catch (error) {
    return { success: false, error: 'Greška pri ažuriranju kategorije' }
  }
}

// Obriši kategoriju
export const deleteCategory = async (id) => {
  try {
    const response = await fetch(getApiUrl(`/categories/delete.php?id=${id}`), {
      method: 'DELETE',
      credentials: 'include'
    })

    const data = await response.json()

    if (response.ok) {
      return { success: true, message: data.message }
    } else {
      return { success: false, error: data.error, drinks_count: data.drinks_count }
    }
  } catch (error) {
    return { success: false, error: 'Greška pri brisanju kategorije' }
  }
}

// Proveri koliko pića ima u kategoriji
export const getCategoryDrinksCount = async (categoryId) => {
  try {
    const response = await fetch(getApiUrl(`/drinks/get.php?category_id=${categoryId}`), {
      method: 'GET',
      credentials: 'include'
    })

    const data = await response.json()

    if (response.ok) {
      return { success: true, count: data.count || 0 }
    } else {
      return { success: false, error: data.error }
    }
  } catch (error) {
    return { success: false, error: 'Greška pri dobijanju broja pića' }
  }
}
