const DrinkCard = ({ drink, onEdit, onDelete }) => {
  const imageUrl = drink.image_url 
    ? `http://localhost:8888${drink.image_url}`
    : null

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Cena nije definisana'
    return `${price.toLocaleString('sr-RS')} RSD`
  }

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      {/* Slika */}
      <div className="aspect-video bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={drink.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18z" />
            </svg>
          </div>
        )}
      </div>

      {/* Sadržaj */}
      <div className="p-4">
        {/* Naslov i kategorija */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{drink.name}</h3>
          {drink.category_name && (
            <span className="inline-block px-2 py-1 text-xs font-medium bg-orange-100 text-orange-600 rounded-full">
              {drink.category_name}
            </span>
          )}
        </div>

        {/* Opis */}
        {drink.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {drink.description}
          </p>
        )}

        {/* Cena */}
        <div className="mb-4">
          <p className="text-lg font-bold text-orange-600">
            {formatPrice(drink.price)}
          </p>
        </div>

        {/* Dugmad */}
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(drink)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Izmeni
          </button>
          <button
            onClick={() => onDelete(drink)}
            className="flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Obriši
          </button>
        </div>
      </div>
    </div>
  )
}

export default DrinkCard
