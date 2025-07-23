import { useState, useEffect } from 'react'
import { getDrinks, createDrink, updateDrink, deleteDrink } from '../utils/drinks'
import { getCategories } from '../utils/categories'
import DrinkCard from './DrinkCard'
import DrinkForm from './DrinkForm'
import Modal from './Modal'

const DrinksManager = () => {
  const [drinks, setDrinks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDrink, setEditingDrink] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [filterCategory, setFilterCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name') // name, price, category
  const [sortOrder, setSortOrder] = useState('asc') // asc, desc

  // Scroll to top on component mount - optimized for mobile
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      })
    })
  }, [])

  useEffect(() => {
    loadDrinks()
    loadCategories()
  }, [])

  const loadDrinks = async () => {
    setLoading(true)
    try {
      const result = await getDrinks()
      if (result.success) {
        setDrinks(result.drinks)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const result = await getCategories()
      if (result.success) {
        setCategories(result.categories)
      }
    } catch (error) {
    }
  }

  const handleCreate = () => {
    setEditingDrink(null)
    setIsModalOpen(true)
  }

  const handleEdit = (drink) => {
    setEditingDrink(drink)
    setIsModalOpen(true)
  }

  const handleDelete = (drink) => {
    setDeleteConfirm(drink)
  }

  const confirmDelete = async () => {
    if (!deleteConfirm) return

    setIsSubmitting(true)
    try {
      const result = await deleteDrink(deleteConfirm.id)
      if (result.success) {
        setDrinks(prev => prev.filter(d => d.id !== deleteConfirm.id))
        setDeleteConfirm(null)
      } else {
        alert('Greška pri brisanju pića: ' + result.error)
      }
    } catch (error) {
      alert('Greška pri brisanju pića')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)
    try {
      let result
      if (editingDrink) {
        result = await updateDrink(
          editingDrink.id,
          formData.name,
          formData.description,
          formData.price,
          formData.category_id,
          formData.image
        )
      } else {
        result = await createDrink(
          formData.name,
          formData.description,
          formData.price,
          formData.category_id,
          formData.image
        )
      }

      if (result.success) {
        if (editingDrink) {
          setDrinks(prev => prev.map(d => d.id === editingDrink.id ? result.drink : d))
        } else {
          setDrinks(prev => [...prev, result.drink])
        }
        setIsModalOpen(false)
        setEditingDrink(null)
        
        // Scroll to top after successful action
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      } else {
        alert('Greška: ' + result.error)
      }
    } catch (error) {
      alert('Greška pri čuvanju pića')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingDrink(null)
  }

  // Filtriraj i sortiraj pića
  const filteredAndSortedDrinks = drinks
    .filter(drink => {
      const matchesSearch = drink.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (drink.description && drink.description.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = !filterCategory || drink.category_id?.toString() === filterCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      let aVal, bVal
      
      switch (sortBy) {
        case 'price':
          aVal = a.price || 0
          bVal = b.price || 0
          break
        case 'category':
          aVal = a.category_name || ''
          bVal = b.category_name || ''
          break
        default: // name
          aVal = a.name
          bVal = b.name
      }

      if (sortOrder === 'desc') {
        return aVal < bVal ? 1 : -1
      }
      return aVal > bVal ? 1 : -1
    })

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        <span className="ml-2 text-gray-600">Učitavanje pića...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Upravljanje Pićima</h2>
              <p className="text-sm text-gray-600 mt-1">Dodajte i upravljajte pićima u vašem restoranu</p>
            </div>
            <button
              onClick={handleCreate}
              className="w-full sm:w-auto px-4 py-2.5 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Dodaj Piće
            </button>
          </div>
        </div>
      </div>

      {/* Filteri i pretraga */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="space-y-4">
            {/* Pretraga */}
            <div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pretraži pića..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Filteri u redu */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Filter po kategoriji */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              >
                <option value="">Sve kategorije</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Sortiranje */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              >
                <option value="name">Sortiraj po imenu</option>
                <option value="price">Sortiraj po ceni</option>
                <option value="category">Sortiraj po kategoriji</option>
              </select>

              {/* Smer sortiranja */}
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                {sortOrder === 'asc' ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    A-Z
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                    Z-A
                  </>
                )}
              </button>
            </div>

            {/* Rezultati */}
            {(searchTerm || filterCategory) && (
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  Pronađeno {filteredAndSortedDrinks.length} od {drinks.length} pića
                </span>
                {(searchTerm || filterCategory) && (
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setFilterCategory('')
                    }}
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Očisti filtere
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lista pića */}
      <div className="px-4 py-6">
        {filteredAndSortedDrinks.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-sm mx-auto">
              <svg className="w-20 h-20 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || filterCategory ? 'Nema rezultata' : 'Nema pića'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterCategory 
                  ? 'Pokušajte sa drugačijim kriterijumima pretrage.' 
                  : 'Dodajte vaše prvo piće da počnete.'
                }
              </p>
              {!searchTerm && !filterCategory && (
                <button
                  onClick={handleCreate}
                  className="px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors duration-200"
                >
                  Dodaj Prvo Piće
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedDrinks.map(drink => (
              <DrinkCard
                key={drink.id}
                drink={drink}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal za kreiranje/editovanje */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingDrink ? 'Izmeni Piće' : 'Dodaj Novo Piće'}
      >
        <DrinkForm
          drink={editingDrink}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Modal za potvrdu brisanja */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Potvrdi Brisanje"
      >
        {deleteConfirm && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Da li ste sigurni da želite da obrišete piće <strong>"{deleteConfirm.name}"</strong>?
            </p>
            <p className="text-sm text-red-600">
              Ova akcija se ne može poništiti.
            </p>
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                disabled={isSubmitting}
              >
                Otkaži
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Brisanje...' : 'Obriši'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default DrinksManager
