const API_BASE_URL = 'http://localhost:8888/TimeOut/backend'

// Dobij sva pića
export const getDrinks = async (categoryId = null) => {
  try {
    let url = `${API_BASE_URL}/drinks/get.php`
    if (categoryId) {
      url += `?category_id=${categoryId}`
    }

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include'
    })

    const data = await response.json()

    if (response.ok) {
      return { success: true, drinks: data.drinks, count: data.count }
    } else {
      return { success: false, error: data.error }
    }
  } catch (error) {
    return { success: false, error: 'Greška pri dobijanju pića' }
  }
}

// Dobij jedno piće po ID-u
export const getDrink = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/drinks/get.php?id=${id}`, {
      method: 'GET',
      credentials: 'include'
    })

    const data = await response.json()

    if (response.ok) {
      return { success: true, drink: data.drink }
    } else {
      return { success: false, error: data.error }
    }
  } catch (error) {
    return { success: false, error: 'Greška pri dobijanju pića' }
  }
}

// Kreiraj novo piće
export const createDrink = async (name, description = '', price = null, categoryId = null, image = null) => {
  try {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    
    if (price !== null && price !== '') {
      formData.append('price', price)
    }
    
    if (categoryId !== null && categoryId !== '') {
      formData.append('category_id', categoryId)
    }
    
    if (image) {
      formData.append('image', image)
    }

    const response = await fetch(`${API_BASE_URL}/drinks/create.php`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    })

    const data = await response.json()

    if (response.ok) {
      return { success: true, drink: data.drink, message: data.message }
    } else {
      return { success: false, error: data.error }
    }
  } catch (error) {
    return { success: false, error: 'Greška pri kreiranju pića' }
  }
}

// Ažuriraj piće
export const updateDrink = async (id, name, description = '', price = null, categoryId = null, image = null) => {
  try {
    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('id', id)
    formData.append('name', name)
    formData.append('description', description)
    
    if (price !== null && price !== '') {
      formData.append('price', price)
    }
    
    if (categoryId !== null && categoryId !== '') {
      formData.append('category_id', categoryId)
    }
    
    if (image) {
      formData.append('image', image)
    }

    const response = await fetch(`${API_BASE_URL}/drinks/update.php`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    })

    const data = await response.json()

    if (response.ok) {
      return { success: true, drink: data.drink, message: data.message }
    } else {
      return { success: false, error: data.error }
    }
  } catch (error) {
    return { success: false, error: 'Greška pri ažuriranju pića' }
  }
}

// Obriši piće
export const deleteDrink = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/drinks/delete.php?id=${id}`, {
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
    return { success: false, error: 'Greška pri brisanju pića' }
  }
}
