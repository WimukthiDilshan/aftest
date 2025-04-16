function CountryDetail({ country, onBack, onBorderClick, darkMode, isFavorite, onToggleFavorite, onAddToCompare, compareMode }) {
  const languages = country.languages ? Object.values(country.languages) : []
  const currencies = country.currencies ? Object.values(country.currencies) : []

  return (
    <div className={`rounded-lg shadow-lg overflow-hidden relative responsive-container ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 text-white' 
        : 'bg-gradient-to-br from-white via-gray-50 to-white text-gray-900'
    }`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 opacity-10 ${
        darkMode 
          ? 'bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]' 
          : 'bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]'
      }`}></div>

      <div className="flex flex-wrap justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 relative z-10">
        <button
          onClick={onBack}
          className={`flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-colors touch-target touch-ripple ${
            darkMode 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>
        <div className="flex space-x-2 mt-2 sm:mt-0">
          {!compareMode && (
            <button
              onClick={onToggleFavorite}
              className={`p-2 rounded-full transition-all touch-target touch-ripple ${
                isFavorite 
                  ? 'bg-yellow-400 text-gray-900 shadow-md' 
                  : darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </button>
          )}
          {!compareMode && (
            <button
              onClick={onAddToCompare}
              className={`p-2 rounded-full transition-all touch-target touch-ripple ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-label="Add to compare"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex-responsive p-4 sm:p-6 relative z-10">
        <div className="h-48 sm:h-64 md:h-80 lg:h-96 relative overflow-hidden rounded-lg shadow-xl group">
          <img
            src={country.flags.png}
            alt={`${country.name.common} flag`}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 responsive-img ${
              darkMode ? 'brightness-90 contrast-110' : ''
            }`}
          />
        </div>

        <div className="mt-6 md:mt-0 md:ml-8 w-full md:w-1/2">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">{country.name.common}</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div>
              <p className="mb-2 sm:mb-3 text-sm sm:text-base">
                <span className="font-semibold">Native Name:</span>{' '}
                {country.name.official}
              </p>
              <p className="mb-2 sm:mb-3 text-sm sm:text-base">
                <span className="font-semibold">Population:</span>{' '}
                {country.population.toLocaleString()}
              </p>
              <p className="mb-2 sm:mb-3 text-sm sm:text-base">
                <span className="font-semibold">Region:</span> {country.region}
              </p>
              <p className="mb-2 sm:mb-3 text-sm sm:text-base">
                <span className="font-semibold">Sub Region:</span>{' '}
                {country.subregion || 'N/A'}
              </p>
              <p className="mb-2 sm:mb-3 text-sm sm:text-base">
                <span className="font-semibold">Capital:</span>{' '}
                {country.capital?.[0] || 'N/A'}
              </p>
            </div>

            <div>
              <p className="mb-2 sm:mb-3 text-sm sm:text-base">
                <span className="font-semibold">Top Level Domain:</span>{' '}
                {country.tld?.join(', ') || 'N/A'}
              </p>
              <p className="mb-2 sm:mb-3 text-sm sm:text-base">
                <span className="font-semibold">Currencies:</span>{' '}
                {currencies.map((currency) => currency.name).join(', ') || 'N/A'}
              </p>
              <p className="mb-2 sm:mb-3 text-sm sm:text-base">
                <span className="font-semibold">Languages:</span>{' '}
                {languages.join(', ') || 'N/A'}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Border Countries:</h2>
            <div className="flex flex-wrap gap-2">
              {country.borders ? (
                country.borders.map((border) => (
                  <button
                    key={border}
                    onClick={() => {
                      if (onBorderClick) onBorderClick(border);
                    }}
                    className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm transition-all touch-target touch-ripple ${
                      darkMode 
                        ? 'bg-gray-700 text-white hover:bg-gray-600 hover:shadow-md' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:shadow-md'
                    }`}
                  >
                    {border}
                  </button>
                ))
              ) : (
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No border countries
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CountryDetail 