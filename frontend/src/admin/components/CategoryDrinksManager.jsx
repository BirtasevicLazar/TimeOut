import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCategory } from '../utils/categories'
import { getDrinksByCategory, createDrink, updateDrink, deleteDrink } from '../utils/drinks'
import DrinkCard from './DrinkCard'
import DrinkForm from './DrinkForm'
import Modal from './Modal'

const CategoryDrinksManager = () => {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  
  const [category, setCategory] = useState(null)
  const [drinks, setDrinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedDrink, setSelectedDrink] = useState(null)

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
    if (categoryId) {
      loadCategoryAndDrinks()
    }
  }, [categoryId])

  const loadCategoryAndDrinks = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Load category details
      const categoryResult = await getCategory(categoryId)
      if (!categoryResult.success) {
        setError('Kategorija nije pronađena')
        setTimeout(() => navigate('/admin/kategorije'), 2000)
        return
      }
      
      setCategory(categoryResult.category)
      
      // Load drinks for this category
      const drinksResult = await getDrinksByCategory(categoryId)
      if (drinksResult.success) {
        setDrinks(drinksResult.drinks)
      } else {
        setError('Greška pri učitavanju pića')
      }
    } catch (err) {
      setError('Greška pri učitavanju podataka')
    }
    
    setLoading(false)
  }

  const handleAddDrink = async (drinkData) => {
    clearMessages()
    
    const result = await createDrink(drinkData.name, drinkData.description, drinkData.price, categoryId)
    
    if (result.success) {
      setSuccess(result.message)
      setShowAddModal(false)
      loadCategoryAndDrinks()
    } else {
      setError(result.error)
    }
  }

  const handleEditDrink = async (drinkData) => {
    clearMessages()
    
    const result = await updateDrink(editingDrink.id, drinkData.name, drinkData.description, drinkData.price, categoryId)
    
    if (result.success) {
      setSuccess(result.message)
      setShowEditModal(false)
      setSelectedDrink(null)
      loadCategoryAndDrinks()
    } else {
      setError(result.error)
    }
  }

  const handleDeleteDrink = async () => {
    if (!selectedDrink) return
    
    clearMessages()
    
    const result = await deleteDrink(selectedDrink.id)
    
    if (result.success) {
      setSuccess(result.message)
      setShowDeleteModal(false)
      setSelectedDrink(null)
      loadCategoryAndDrinks()
    } else {
      setError(result.error)
    }
  }

  const openEditModal = (drink) => {
    setSelectedDrink(drink)
    setShowEditModal(true)
  }

  const openDeleteModal = (drink) => {
    setSelectedDrink(drink)
    setShowDeleteModal(true)
  }

  const clearMessages = () => {
    setError('')
    setSuccess('')
  }

  const closeModals = () => {
    setShowAddModal(false)
    setShowEditModal(false)
    setShowDeleteModal(false)
    setSelectedDrink(null)
    clearMessages()
  }

  const goBack = () => {
    const isPartyCategory = category?.is_party
    navigate(isPartyCategory ? '/admin/kategorije-zurke' : '/admin/kategorije')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Učitavanje pića...</p>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Kategorija nije pronađena</div>
        <button
          onClick={() => navigate('/admin/kategorije')}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg"
        >
          Nazad na kategorije
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={goBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
              {category.is_party && (
                <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
                  Za žurke
                </span>
              )}
            </div>
            <p className="text-gray-600 mt-1">
              Upravljajte pićima u ovoj kategoriji
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Dodaj piće
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

      {/* Drinks Grid */}
      {drinks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nema pića u ovoj kategoriji</h3>
          <p className="text-gray-500 mb-6">Počnite dodavanjem novog pića</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Dodaj prvo piće
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {drinks.map((drink) => (
            <DrinkCard
              key={drink.id}
              drink={drink}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />
          ))}
        </div>
      )}

      {/* Add Drink Modal */}
      <Modal 
        isOpen={showAddModal} 
        onClose={closeModals}
        title="Dodaj novo piće"
      >
        <DrinkForm
          onSubmit={handleAddDrink}
          onCancel={closeModals}
          submitText="Dodaj piće"
        />
      </Modal>

      {/* Edit Drink Modal */}
      <Modal 
        isOpen={showEditModal} 
        onClose={closeModals}
        title="Uredi piće"
      >
        <DrinkForm
          initialData={selectedDrink}
          onSubmit={handleEditDrink}
          onCancel={closeModals}
          submitText="Sačuvaj izmene"
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
                Obriši piće "{selectedDrink?.name}"?
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Ova akcija se ne može poništiti.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors order-2 sm:order-1"
                >
                  Otkaži
                </button>
                <button
                  onClick={handleDeleteDrink}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors order-1 sm:order-2"
                >
                  Obriši piće
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CategoryDrinksManager
