import { useState, useEffect } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../utils/categories'
import CategoryForm from './CategoryForm'
import CategoryCard from './CategoryCard'
import Modal from './Modal'

const CategoriesManager = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    setError('')
    
    const result = await getCategories()
    
    if (result.success) {
      setCategories(result.categories)
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  const handleCreateCategory = async (name, image) => {
    const result = await createCategory(name, image)
    
    if (result.success) {
      setSuccess('Kategorija je uspešno kreirana!')
      setShowAddModal(false)
      loadCategories() // Osvežiti listu
      
      // Očisti success poruku nakon 3 sekunde
      setTimeout(() => setSuccess(''), 3000)
    } else {
      setError(result.error)
    }
  }

  const handleUpdateCategory = async (name, image) => {
    if (!selectedCategory) return
    
    const result = await updateCategory(selectedCategory.id, name, image)
    
    if (result.success) {
      setSuccess('Kategorija je uspešno ažurirana!')
      setShowEditModal(false)
      setSelectedCategory(null)
      loadCategories() // Osvežiti listu
      
      // Očisti success poruku nakon 3 sekunde
      setTimeout(() => setSuccess(''), 3000)
    } else {
      setError(result.error)
    }
  }

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return
    
    const result = await deleteCategory(selectedCategory.id)
    
    if (result.success) {
      setSuccess('Kategorija je uspešno obrisana!')
      setShowDeleteModal(false)
      setSelectedCategory(null)
      loadCategories() // Osvežiti listu
      
      // Očisti success poruku nakon 3 sekunde
      setTimeout(() => setSuccess(''), 3000)
    } else {
      setError(result.error)
    }
  }

  const openEditModal = (category) => {
    setSelectedCategory(category)
    setShowEditModal(true)
  }

  const openDeleteModal = (category) => {
    setSelectedCategory(category)
    setShowDeleteModal(true)
  }

  const closeAllModals = () => {
    setShowAddModal(false)
    setShowEditModal(false)
    setShowDeleteModal(false)
    setSelectedCategory(null)
    setError('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Kategorije</h2>
          <p className="text-gray-600 mt-1">Upravljajte kategorijama pića</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 w-full sm:w-auto justify-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Dodaj kategoriju</span>
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-500 hover:text-red-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <span className="ml-2 text-gray-600">Učitavanje kategorija...</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg mb-2">Nema kategorija</p>
          <p className="text-gray-400 mb-6">Dodajte prvu kategoriju da biste počeli</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Dodaj kategoriju</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={() => openEditModal(category)}
              onDelete={() => openDeleteModal(category)}
            />
          ))}
        </div>
      )}

      {/* Add Category Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={closeAllModals}
        title="Dodaj novu kategoriju"
      >
        <CategoryForm
          onSubmit={handleCreateCategory}
          onCancel={closeAllModals}
          loading={loading}
        />
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={closeAllModals}
        title="Edituj kategoriju"
      >
        <CategoryForm
          category={selectedCategory}
          onSubmit={handleUpdateCategory}
          onCancel={closeAllModals}
          loading={loading}
          isEdit={true}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={closeAllModals}
        title="Potvrdi brisanje"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Da li ste sigurni da želite da obrišete kategoriju "{selectedCategory?.name}"?
          </p>
          <p className="text-sm text-red-600">
            Ova akcija se ne može poništiti. Sva pića u ovoj kategoriji će ostati bez kategorije.
          </p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              onClick={handleDeleteCategory}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Da, obriši
            </button>
            <button
              onClick={closeAllModals}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
            >
              Otkaži
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CategoriesManager
