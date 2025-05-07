import { useState, useEffect } from 'react';
import CountryList from './CountryList';

function Favorites({ darkMode, favorites, onToggleFavorite }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p>{error}</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className={`text-center py-12 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto mb-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
        <h2 className="text-2xl font-semibold mb-2">No Favorites Yet</h2>
        <p className="mb-4">Start adding countries to your favorites to see them here.</p>
        <p className="text-sm opacity-75">
          Click the star icon on any country card to add it to your favorites.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Favorite Countries
      </h1>
      <CountryList
        countries={favorites}
        onCountryClick={(country) => window.location.href = `/country/${country.cca3}`}
        darkMode={darkMode}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
      />
    </div>
  );
}

export default Favorites; 