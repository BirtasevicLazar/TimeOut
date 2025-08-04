import { useState, useRef } from 'react'

const CategoryForm = ({ category = null, onSubmit, onCancel, loading = false, isEdit = false, isParty = false }) => {
  const [formData, setFormData] = useState({
    name: category?.name || ''
  })
  const [selectedImage, setSelectedImage] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const fileInputRef = useRef(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Očisti grešku kada korisnik počne da kuca
    if (error) setError('')
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validacija fajla
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        setError('Dozvoljeni su samo JPG, PNG, GIF i WebP fajlovi')
        return
      }

      // Validacija veličine (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        setError('Slika ne može biti veća od 5MB')
        return
      }

      setSelectedImage(file)
      setError('')
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validacija
    if (!formData.name.trim()) {
      setError('Ime kategorije je obavezno')
      return
    }

    if (formData.name.length > 100) {
      setError('Ime kategorije ne može biti duže od 100 karaktera')
      return
    }

    setSubmitting(true)

    try {
      await onSubmit(formData.name.trim(), selectedImage)
    } catch (err) {
      setError('Greška pri čuvanju kategorije')
    }

    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Naziv kategorije *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
          placeholder="Unesite naziv kategorije"
          disabled={submitting || loading}
          maxLength={100}
        />
        <p className="text-sm text-gray-500 mt-1">
          {formData.name.length}/100 karaktera
        </p>
      </div>

      {/* Category Type Indicator */}
      {isParty && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="text-orange-800 font-medium">Kategorija za žurke</span>
          </div>
        </div>
      )}

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Slika kategorije (opcionalno)
        </label>
        
        {/* Upload Button */}
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={submitting || loading}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{selectedImage ? 'Slika odabrana' : (isEdit && category?.image_url ? 'Promeni sliku' : 'Dodaj sliku')}</span>
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleImageChange}
            className="hidden"
            disabled={submitting || loading}
          />
        </div>
        
        <p className="text-sm text-gray-500 mt-2">
          Podržani formati: JPG, PNG, GIF, WebP (max 5MB)
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-6">
        <button
          type="submit"
          disabled={submitting || loading || !formData.name.trim()}
          className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            submitting || loading || !formData.name.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-orange-600 hover:bg-orange-700 transform hover:scale-[1.02] active:scale-[0.98]'
          } text-white`}
        >
          {submitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {isEdit ? 'Ažuriranje...' : 'Kreiranje...'}
            </>
          ) : (
            isEdit ? 'Ažuriraj kategoriju' : 'Kreiraj kategoriju'
          )}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 disabled:opacity-50"
        >
          Otkaži
        </button>
      </div>
    </form>
  )
}

export default CategoryForm
