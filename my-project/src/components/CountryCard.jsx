function CountryCard({ country, onClick, darkMode, isFavorite, onToggleFavorite, compareMode, isSelected, index }) {
  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    onToggleFavorite(country)
  }

  // Calculate animation delay based on card index for staggered effect
  const animationDelay = index * 0.05; // 50ms delay between each card

  return (
    <div 
      data-testid="country-card"
      onClick={() => onClick(country)}
      className={`group relative overflow-hidden rounded-lg shadow-md card-hover-effect transform transition-all duration-500 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 hover:from-gray-700 hover:via-gray-800 hover:to-gray-700 text-white' 
          : 'bg-gradient-to-br from-white via-gray-50 to-white hover:from-gray-50 hover:via-white hover:to-gray-50'
      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        opacity: 0,
        transform: 'translateY(20px)',
        animation: `fadeIn 0.5s ease-out ${animationDelay}s forwards`,
      }}
    >
      {/* Background Pattern */}
      <div className={`absolute inset-0 opacity-10 ${
        darkMode 
          ? 'bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]' 
          : 'bg-[url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]'
      }`}></div>

      {/* Flag Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={country.flags.png}
          alt={`${country.name.common} flag`}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
            darkMode ? 'brightness-90 contrast-110' : ''
          }`}
          style={{
            animation: `zoomIn 0.6s ease-out ${animationDelay + 0.2}s forwards`
          }}
        />
        
        {/* Top Right Controls */}
        <div className="absolute top-2 right-2 flex space-x-2">
          {/* Favorite Button */}
          {!compareMode && (
            <button
              onClick={handleFavoriteClick}
              className={`p-1.5 rounded-full transition-all ${
                isFavorite 
                  ? 'bg-yellow-400 text-gray-900 shadow-md' 
                  : darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              style={{
                animation: `fadeIn 0.3s ease-out ${animationDelay + 0.4}s forwards`,
                opacity: 0,
              }}
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
          
          {/* Compare Mode Indicator */}
          {compareMode && (
            <div className={`p-1.5 rounded-full transition-all ${
              isSelected 
                ? 'bg-blue-500 text-white' 
                : darkMode 
                  ? 'bg-gray-700 text-gray-300 border border-gray-600' 
                  : 'bg-white text-gray-700 border border-gray-300'
            }`}
            style={{
              animation: `fadeIn 0.3s ease-out ${animationDelay + 0.4}s forwards`,
              opacity: 0,
            }}>
              {isSelected ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Country Info */}
      <div className="p-4 relative">
        <h2 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}
          style={{
            animation: `slideUp 0.5s ease-out ${animationDelay + 0.3}s forwards`,
            opacity: 0,
            transform: 'translateY(10px)',
          }}>
          {country.name.common}
        </h2>
        <div className={`space-y-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
          style={{
            animation: `slideUp 0.5s ease-out ${animationDelay + 0.4}s forwards`,
            opacity: 0,
            transform: 'translateY(10px)',
          }}>
          <p>
            <span className="font-semibold">Population:</span>{' '}
            {country.population.toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">Region:</span> {country.region}
          </p>
          <p>
            <span className="font-semibold">Capital:</span>{' '}
            {country.capital?.[0] || 'N/A'}
          </p>
        </div>
        
        {/* Compare Button - Visible in normal mode */}
        {!compareMode && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClick(country);
            }}
            className={`mt-3 w-full py-1.5 px-2 text-sm rounded-md transition-colors ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
            style={{
              animation: `slideUp 0.5s ease-out ${animationDelay + 0.5}s forwards`,
              opacity: 0,
              transform: 'translateY(10px)',
            }}
          >
            <div className="flex items-center justify-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>View Details</span>
            </div>
          </button>
        )}
        
        {/* Compare Selection Button - Visible in compare mode */}
        {compareMode && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClick(country);
            }}
            className={`mt-3 w-full py-1.5 px-2 text-sm font-medium rounded-md transition-colors ${
              isSelected
                ? darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                : darkMode 
                  ? 'bg-gray-700 hover:bg-blue-600 text-white border border-gray-600' 
                  : 'bg-white hover:bg-blue-50 text-gray-800 border border-gray-300 hover:border-blue-300'
            }`}
            style={{
              animation: `slideUp 0.5s ease-out ${animationDelay + 0.5}s forwards`,
              opacity: 0,
              transform: 'translateY(10px)',
            }}
          >
            {isSelected ? (
              <div className="flex items-center justify-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Selected for Comparison</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add to Comparison</span>
              </div>
            )}
          </button>
        )}
      </div>

      {/* Hover Effect Border */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
    </div>
  )
}

export default CountryCard 