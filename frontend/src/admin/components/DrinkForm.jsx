import { useState, useEffect } from 'react'
import { getCategories } from '../utils/categories'

const DrinkForm = ({ drink = null, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category_id: ''
  })
  const [categories, setCategories] = useState([])
  const [errors, setErrors] = useState({})
  const [loadingCategories, setLoadingCategories] = useState(false)

  // Učitaj kategorije pri inicijalizaciji
  useEffect(() => {
    loadCategories()
  }, [])

  // Popuni formu ako uređujemo postojeće piće
  useEffect(() => {
    if (drink) {
      setFormData({
        name: drink.name || '',
        price: drink.price ? drink.price.toString() : '',
        category_id: drink.category_id ? drink.category_id.toString() : ''
      })
    }
  }, [drink])

  const loadCategories = async () => {
    setLoadingCategories(true)
    try {
      const result = await getCategories()
      if (result.success) {
        setCategories(result.categories)
      }
    } catch (error) {
    } finally {
      setLoadingCategories(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Ukloni grešku kad korisnik počne da kuca
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Ime pića je obavezno'
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Kategorija je obavezna'
    }

    if (formData.price && isNaN(formData.price)) {
      newErrors.price = 'Cena mora biti broj'
    }

    if (formData.price && parseFloat(formData.price) < 0) {
      newErrors.price = 'Cena ne može biti negativna'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const submitData = {
      name: formData.name.trim(),
      price: formData.price ? parseFloat(formData.price) : null,
      category_id: parseInt(formData.category_id)
    }

    onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Ime pića */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ime pića *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Unesite ime pića"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Cena */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cena (RSD)
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          step="0.01"
          min="0"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            errors.price ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Unesite cenu (opcionalno)"
        />
        {errors.price && (
          <p className="mt-1 text-sm text-red-600">{errors.price}</p>
        )}
      </div>

      {/* Kategorija */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kategorija *
        </label>
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
            errors.category_id ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={loadingCategories}
        >
          <option value="">Izaberite kategoriju</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.category_id && (
          <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
        )}
        {loadingCategories && (
          <p className="mt-1 text-sm text-gray-500">Učitavanje kategorija...</p>
        )}
      </div>

      {/* Dugmad */}
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
          disabled={isLoading}
        >
          Otkaži
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors duration-200 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Čuvanje...' : (drink ? 'Ažuriraj' : 'Kreiraj')}
        </button>
      </div>
    </form>
  )
}

export default DrinkForm
