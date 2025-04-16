import { useState, useEffect } from 'react';
import CountryCard from './CountryCard'

function CountryList({ 
  countries, 
  onCountryClick, 
  darkMode, 
  favorites, 
  onToggleFavorite, 
  compareMode,
  countriesToCompare,
  onAddToCompare,
  onRemoveFromCompare
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [countriesPerPage, setCountriesPerPage] = useState(12);
  const [animation, setAnimation] = useState(false);
  const [visibleCountries, setVisibleCountries] = useState([]);
  
  // Calculate pagination values
  const totalPages = Math.ceil(countries.length / countriesPerPage);
  const indexOfLastCountry = currentPage * countriesPerPage;
  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
  
  // When countries change, update the visible countries with animation
  useEffect(() => {
    setAnimation(true);
    setVisibleCountries([]);
    
    // Short delay before showing new countries for smooth transition
    const timer = setTimeout(() => {
      setVisibleCountries(countries.slice(indexOfFirstCountry, indexOfLastCountry));
      setAnimation(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [countries, indexOfFirstCountry, indexOfLastCountry, currentPage]);

  const handleCardClick = (country) => {
    if (compareMode) {
      // In compare mode, clicking adds/removes from comparison
      if (countriesToCompare && countriesToCompare.some(c => c.cca3 === country.cca3)) {
        onRemoveFromCompare(country.cca3);
      } else if (countriesToCompare && countriesToCompare.length < 2) {
        onAddToCompare(country);
      }
    } else {
      // Normal mode, show country details
      onCountryClick(country);
    }
  };
  
  const goToPage = (pageNumber) => {
    // Don't do anything if clicked on current page or invalid page
    if (pageNumber === currentPage || pageNumber < 1 || pageNumber > totalPages) return;
    
    setAnimation(true);
    setVisibleCountries([]);
    
    // Short delay for smooth transition
    setTimeout(() => {
      setCurrentPage(pageNumber);
    }, 200);
  };
  
  // Calculate pages to show in pagination
  const getPaginationGroup = () => {
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + 4, totalPages);
    
    // Adjust start if we're near the end
    if (end === totalPages) {
      start = Math.max(end - 4, 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div 
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 responsive-grid responsive-container transition-opacity duration-300 ${animation ? 'opacity-0' : 'opacity-100'}`}
      >
        {visibleCountries.map((country, index) => (
          <CountryCard
            key={country.cca3}
            country={country}
            onClick={() => handleCardClick(country)}
            darkMode={darkMode}
            isFavorite={favorites?.some(fav => fav.cca3 === country.cca3)}
            onToggleFavorite={(e) => {
              e.stopPropagation();
              onToggleFavorite(country);
            }}
            compareMode={compareMode}
            isSelected={countriesToCompare?.some(c => c.cca3 === country.cca3)}
            index={index}
          />
        ))}
      </div>
      
      {/* Show counts and pagination only if we have multiple pages */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center space-y-4 pb-6">
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Showing {indexOfFirstCountry + 1}-{Math.min(indexOfLastCountry, countries.length)} of {countries.length} countries
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Previous Page Button */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`w-9 h-9 rounded-full flex items-center justify-center pagination-button ${
                currentPage === 1 
                  ? `opacity-50 cursor-not-allowed ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-400'}`
                  : `${darkMode ? 'bg-gray-700 text-white hover:bg-blue-600' : 'bg-white text-gray-700 hover:bg-blue-500 hover:text-white'} shadow-md`
              }`}
              aria-label="Previous page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Go to first page button (only show if not on first page and not near first page) */}
            {currentPage > 3 && (
              <>
                <button
                  onClick={() => goToPage(1)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center pagination-button ${
                    darkMode ? 'bg-gray-700 text-white hover:bg-blue-600' : 'bg-white text-gray-700 hover:bg-blue-500 hover:text-white'
                  } shadow-md`}
                  aria-label="Go to first page"
                >
                  1
                </button>
                
                {/* Ellipsis if we're skipping pages */}
                {currentPage > 4 && (
                  <span className={`flex items-center justify-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </span>
                )}
              </>
            )}
            
            {/* Page Numbers */}
            {getPaginationGroup().map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                className={`w-9 h-9 rounded-full flex items-center justify-center pagination-button ${
                  pageNumber === currentPage
                    ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'} shadow-lg`
                    : `${darkMode ? 'bg-gray-700 text-white hover:bg-blue-600' : 'bg-white text-gray-700 hover:bg-blue-500 hover:text-white'} shadow-md`
                }`}
                aria-label={`Go to page ${pageNumber}`}
                aria-current={pageNumber === currentPage ? "page" : null}
              >
                {pageNumber}
              </button>
            ))}
            
            {/* Go to last page button (only show if not on last page and not near last page) */}
            {totalPages > 3 && currentPage < totalPages - 2 && (
              <>
                {/* Ellipsis if we're skipping pages */}
                {currentPage < totalPages - 3 && (
                  <span className={`flex items-center justify-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </span>
                )}
                
                <button
                  onClick={() => goToPage(totalPages)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center pagination-button ${
                    darkMode ? 'bg-gray-700 text-white hover:bg-blue-600' : 'bg-white text-gray-700 hover:bg-blue-500 hover:text-white'
                  } shadow-md`}
                  aria-label="Go to last page"
                >
                  {totalPages}
                </button>
              </>
            )}
            
            {/* Next Page Button */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`w-9 h-9 rounded-full flex items-center justify-center pagination-button ${
                currentPage === totalPages
                  ? `opacity-50 cursor-not-allowed ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-400'}`
                  : `${darkMode ? 'bg-gray-700 text-white hover:bg-blue-600' : 'bg-white text-gray-700 hover:bg-blue-500 hover:text-white'} shadow-md`
              }`}
              aria-label="Next page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Per page selector */}
          <div className={`text-sm flex items-center justify-center space-x-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <span>Show per page:</span>
            <select 
              value={countriesPerPage} 
              onChange={(e) => {
                setCountriesPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to first page when changing items per page
              }}
              className={`ml-2 px-2 py-1 rounded border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={16}>16</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}

export default CountryList 