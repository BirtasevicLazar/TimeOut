const DrinkCard = ({ drink, onEdit, onDelete }) => {
  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Cena nije definisana'
    return `${price.toLocaleString('sr-RS')} RSD`
  }

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
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

        {/* Placeholder prostor gde je bio opis da se ne poremeti razmak */}
        <div className="mb-3 h-0" />

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
