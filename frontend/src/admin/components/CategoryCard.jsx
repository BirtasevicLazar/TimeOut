const CategoryCard = ({ category, onEdit, onDelete }) => {
  const imageUrl = category.image_url 
    ? `http://localhost:8888/TimeOut/backend/uploads/categories/${category.image_url.split('/').pop()}`
    : null

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Image */}
      <div className="aspect-square bg-gray-200 relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={category.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        
        {/* Fallback when no image or image fails to load */}
        <div 
          className={`w-full h-full flex items-center justify-center ${imageUrl ? 'hidden' : 'flex'}`}
          style={{ display: imageUrl ? 'none' : 'flex' }}
        >
          <div className="text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-gray-500">Nema slike</p>
          </div>
        </div>

        {/* Action buttons overlay */}
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(category)}
            className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-200 shadow-lg"
            title="Edituj kategoriju"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(category)}
            className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-200 shadow-lg"
            title="Obriši kategoriju"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-2 truncate" title={category.name}>
          {category.name}
        </h3>
        
        <div className="flex items-center justify-end text-sm text-gray-500">
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(category)}
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              Edituj
            </button>
            <button
              onClick={() => onDelete(category)}
              className="text-red-600 hover:text-red-800 transition-colors duration-200"
            >
              Obriši
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryCard
