import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPartyCategories, createCategory, updateCategory, deleteCategory, getCategoryDrinksCount } from '../utils/categories'
import CategoryForm from './CategoryForm'
import CategoryCard from './CategoryCard'
import Modal from './Modal'

const PartyCategoriesManager = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categoryDrinksCount, setCategoryDrinksCount] = useState(0)

  // Scroll to top on component mount
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
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    setError('')
    
    const result = await getPartyCategories()
    
    if (result.success) {
      setCategories(result.categories)
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  const handleAddCategory = async (name, image) => {
    clearMessages()
    
    const result = await createCategory(name, image, true) // is_party = true
    
    if (result.success) {
      setSuccess(result.message)
      setShowAddModal(false)
      loadCategories()
    } else {
      setError(result.error)
    }
  }

  const handleEditCategory = async (id, name, image) => {
    clearMessages()
    
    const result = await updateCategory(id, name, image, true) // is_party = true
    
    if (result.success) {
      setSuccess(result.message)
      setShowEditModal(false)
      setSelectedCategory(null)
      loadCategories()
    } else {
      setError(result.error)
    }
  }

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return
    
    clearMessages()
    
    const result = await deleteCategory(selectedCategory.id)
    
    if (result.success) {
      setSuccess(result.message)
      setShowDeleteModal(false)
      setSelectedCategory(null)
      loadCategories()
    } else {
      setError(result.error)
    }
  }

  const openEditModal = (category) => {
    setSelectedCategory(category)
    setShowEditModal(true)
  }

  const openDeleteModal = async (category) => {
    setSelectedCategory(category)
    
    // Dobij broj pića u kategoriji
    const result = await getCategoryDrinksCount(category.id)
    if (result.success) {
      setCategoryDrinksCount(result.count)
    }
    
    setShowDeleteModal(true)
  }

  const handleViewDrinks = (category) => {
    navigate(`/admin/kategorije-zurke/${category.id}/pica`)
  }

  const clearMessages = () => {
    setError('')
    setSuccess('')
  }

  const closeModals = () => {
    setShowAddModal(false)
    setShowEditModal(false)
    setShowDeleteModal(false)
    setSelectedCategory(null)
    clearMessages()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Učitavanje kategorija za žurke...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kategorije za žurke</h1>
            <p className="text-gray-600 mt-1">
              Upravljajte kategorijama pića za žurke ({categories.length} kategorija)
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Dodaj kategoriju za žurke
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-700">{success}</p>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nema kategorija za žurke</h3>
          <p className="text-gray-500 mb-6">Počnite dodavanjem nove kategorije za žurke</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Dodaj prvu kategoriju za žurke
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
              onViewDrinks={handleViewDrinks}
            />
          ))}
        </div>
      )}

      {/* Add Category Modal */}
      <Modal 
        isOpen={showAddModal} 
        onClose={closeModals}
        title="Dodaj novu kategoriju za žurke"
      >
        <CategoryForm
          onSubmit={handleAddCategory}
          onCancel={closeModals}
          submitText="Dodaj kategoriju"
          isParty={true}
        />
      </Modal>

      {/* Edit Category Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={closeModals}
        title="Uredi kategoriju za žurke"
      >
        <CategoryForm
          initialData={selectedCategory}
          onSubmit={handleEditCategory}
          onCancel={closeModals}
          submitText="Sačuvaj izmene"
          isParty={true}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={showDeleteModal} 
        onClose={closeModals}
        title="Potvrdi brisanje"
      >
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Obriši kategoriju "{selectedCategory?.name}"?
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Ova akcija se ne može poništiti. 
                {categoryDrinksCount > 0 && (
                  <span className="text-red-600 font-medium">
                    {' '}Postoji {categoryDrinksCount} {categoryDrinksCount === 1 ? 'piće' : 'pića'} u ovoj kategoriji.
                  </span>
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors order-2 sm:order-1"
                >
                  Otkaži
                </button>
                <button
                  onClick={handleDeleteCategory}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors order-1 sm:order-2"
                >
                  Obriši kategoriju
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PartyCategoriesManager
