import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function CountryDetail({ onBack, darkMode, favorites, onToggleFavorite }) {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
        if (!response.ok) throw new Error('Country not found');
        const data = await response.json();
        setCountry(Array.isArray(data) ? data[0] : data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching country details:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCountry();
  }, [code]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p>{error || 'Country not found'}</p>
      </div>
    );
  }

  const languages = country.languages ? Object.values(country.languages) : [];
  const currencies = country.currencies ? Object.values(country.currencies) : [];
  const isFavorite = favorites.some(fav => fav.cca3 === country.cca3);

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

      {/* Header with Back Button and Favorite Toggle */}
      <div className="relative z-10 p-6 flex justify-between items-start">
        <button
          onClick={onBack}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>Back</span>
        </button>

        <button
          onClick={() => onToggleFavorite(country)}
          className={`p-2 rounded-full transition-all ${
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
      </div>

      {/* Country Content */}
      <div className="relative z-10 p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Flag */}
          <div className="md:w-1/2">
            <img
              src={country.flags.png}
              alt={`${country.name.common} flag`}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Details */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-4">{country.name.common}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm opacity-75">Native Name</p>
                <p className="font-medium">{country.name.nativeName ? Object.values(country.name.nativeName)[0].common : country.name.common}</p>
              </div>
              <div>
                <p className="text-sm opacity-75">Population</p>
                <p className="font-medium">{country.population.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm opacity-75">Region</p>
                <p className="font-medium">{country.region}</p>
              </div>
              <div>
                <p className="text-sm opacity-75">Sub Region</p>
                <p className="font-medium">{country.subregion || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm opacity-75">Capital</p>
                <p className="font-medium">{country.capital?.[0] || 'N/A'}</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Languages</h2>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${
                      darkMode 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Currencies</h2>
              <div className="flex flex-wrap gap-2">
                {currencies.map((currency, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${
                      darkMode 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {currency.name} ({currency.symbol})
                  </span>
                ))}
              </div>
            </div>

            {country.borders && country.borders.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Border Countries</h2>
                <div className="flex flex-wrap gap-2">
                  {country.borders.map((border) => (
                    <span
                      key={border}
                      className={`px-3 py-1 rounded-full text-sm ${
                        darkMode 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {border}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CountryDetail; 