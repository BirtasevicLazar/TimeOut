import { useState, useEffect } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory, getCategoryDrinksCount } from '../utils/categories'
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
  const [categoryDrinksCount, setCategoryDrinksCount] = useState(0)

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
      
      // Scroll to top after successful creation - optimized for mobile
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        })
      })
      
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
      
      // Scroll to top after successful edit - optimized for mobile  
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        })
      })
      
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
      setCategoryDrinksCount(0)
      loadCategories() // Osvežiti listu
      
      // Očisti success poruku nakon 3 sekunde
      setTimeout(() => setSuccess(''), 3000)
    } else {
      // Prikaži grešku - kategorija ne može da se obriše jer sadrži pića
      setError(result.error)
    }
  }

  const openEditModal = (category) => {
    setSelectedCategory(category)
    setShowEditModal(true)
  }

  const openDeleteModal = async (category) => {
    setSelectedCategory(category)
    setCategoryDrinksCount(0) // Reset count
    
    // Proveri koliko pića ima u ovoj kategoriji
    const result = await getCategoryDrinksCount(category.id)
    if (result.success) {
      setCategoryDrinksCount(result.count)
    }
    
    setShowDeleteModal(true)
  }

  const closeAllModals = () => {
    setShowAddModal(false)
    setShowEditModal(false)
    setShowDeleteModal(false)
    setSelectedCategory(null)
    setCategoryDrinksCount(0)
    setError('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header - Full Width */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200 px-4 py-6">
        <div className="flex flex-col space-y-4">
          {/* Title and Add Button */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Kategorije</h1>
              <p className="text-sm text-gray-600">Upravljajte kategorijama pića</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Dodaj</span>
            </button>
          </div>

          {/* Messages */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center text-green-700">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{success}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-red-700">
                  <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">{error}</span>
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
        </div>
      </div>

      {/* Content Area - Full Width */}
      <div className="px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-orange-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Učitavanje kategorija...</p>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nema kategorija</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Dodajte prvu kategoriju da biste počeli organizovanje pića</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Dodaj prvu kategoriju</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </div>

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
          
          {categoryDrinksCount > 0 ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800">Ne možete obrisati kategoriju!</h3>
                  <p className="text-sm text-red-700 mt-1">
                    Ova kategorija sadrži <strong>{categoryDrinksCount}</strong> {categoryDrinksCount === 1 ? 'piće' : 'pića'}. 
                    Prvo morate obrisati sva pića iz ove kategorije ili ih premestiti u drugu kategoriju.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-green-700 font-medium">
                    Ova kategorija ne sadrži pića i može se bezbedno obrisati.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <p className="text-sm text-red-600">
            Ova akcija se ne može poništiti.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              onClick={handleDeleteCategory}
              disabled={categoryDrinksCount > 0}
              className={`px-4 py-2 text-white rounded-lg transition-colors duration-200 ${
                categoryDrinksCount > 0 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {categoryDrinksCount > 0 ? 'Ne može se obrisati' : 'Da, obriši'}
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
