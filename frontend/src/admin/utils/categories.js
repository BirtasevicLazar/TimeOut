const API_BASE_URL = 'http://localhost:8888/TimeOut/backend'

// Dobij sve kategorije
export const getCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/get.php`, {
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
    console.error('Get categories error:', error)
    return { success: false, error: 'Greška pri dobijanju kategorija' }
  }
}

// Dobij jednu kategoriju po ID-u
export const getCategory = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/get.php?id=${id}`, {
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
    console.error('Get category error:', error)
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

    const response = await fetch(`${API_BASE_URL}/categories/create.php`, {
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
    console.error('Create category error:', error)
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

    const response = await fetch(`${API_BASE_URL}/categories/update.php`, {
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
    console.error('Update category error:', error)
    return { success: false, error: 'Greška pri ažuriranju kategorije' }
  }
}

// Obriši kategoriju
export const deleteCategory = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/delete.php?id=${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    const data = await response.json()

    if (response.ok) {
      return { success: true, message: data.message }
    } else {
      return { success: false, error: data.error }
    }
  } catch (error) {
    console.error('Delete category error:', error)
    return { success: false, error: 'Greška pri brisanju kategorije' }
  }
}
