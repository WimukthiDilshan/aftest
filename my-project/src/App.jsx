import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import CountryList from './components/CountryList'
import SearchBar from './components/SearchBar'
import Filter from './components/Filter'
import CountryDetail from './components/CountryDetail'
import ThemeToggle from './components/ThemeToggle'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import WorldMap from './components/WorldMap'
import { AuthProvider, useAuth } from './context/AuthContext'

function AppContent() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [filteredCompareCountries, setFilteredCompareCountries] = useState([[], []])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [populationRange, setPopulationRange] = useState({ min: 0, max: 1500000000 })
  const [sortBy, setSortBy] = useState('name')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [compareMode, setCompareMode] = useState(false)
  const [countriesToCompare, setCountriesToCompare] = useState([])

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      const isDarkMode = JSON.parse(savedDarkMode);
      setDarkMode(isDarkMode);
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Check for user's system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
      localStorage.setItem('darkMode', JSON.stringify(prefersDark));
    }
  }, []);

  // Remove the previous useEffect that was setting darkMode
  useEffect(() => {
    fetchAllCountries()
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  // GET /all - Fetch all countries
  const fetchAllCountries = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('https://restcountries.com/v3.1/all')
      if (!response.ok) throw new Error('Failed to fetch countries')
      const data = await response.json()
      setCountries(data)
      setFilteredCountries(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching countries:', error)
      setError(error.message)
      setLoading(false)
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    if (!term.trim()) {
      setFilteredCountries(countries)
      return
    }
    const filtered = countries.filter(country => 
      country.name.common.toLowerCase().includes(term.toLowerCase()) ||
      country.name.official.toLowerCase().includes(term.toLowerCase())
    )
    setFilteredCountries(filtered)
  }

  // GET /region/{region} - Filter by region
  const filterByRegion = async (region) => {
    if (!region) {
      setFilteredCountries(countries)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`https://restcountries.com/v3.1/region/${region}`)
      if (!response.ok) throw new Error('Region not found')
      const data = await response.json()
      setFilteredCountries(data)
      setLoading(false)
    } catch (error) {
      console.error('Error filtering by region:', error)
      setError(error.message)
      setFilteredCountries([])
      setLoading(false)
    }
  }

  const handleRegionFilter = (region) => {
    setSelectedRegion(region)
    filterByRegion(region)
  }

  const handlePopulationFilter = (range) => {
    setPopulationRange(range)
    applyFilters(searchTerm, selectedRegion, range, sortBy)
  }

  const handleSort = (sort) => {
    setSortBy(sort)
    applyFilters(searchTerm, selectedRegion, populationRange, sort)
  }

  const applyFilters = (search, region, population, sort) => {
    let filtered = [...countries]

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(country =>
        country.name.common.toLowerCase().includes(searchLower) ||
        country.name.official.toLowerCase().includes(searchLower)
      )
    }

    // Apply region filter
    if (region) {
      filtered = filtered.filter(country => country.region === region)
    }

    // Apply population filter
    filtered = filtered.filter(country =>
      country.population >= population.min &&
      country.population <= population.max
    )

    // Apply sorting
    filtered.sort((a, b) => {
      const sortField = sort.startsWith('-') ? sort.slice(1) : sort
      const multiplier = sort.startsWith('-') ? -1 : 1
      
      if (sortField === 'name') {
        return multiplier * a.name.common.localeCompare(b.name.common)
      }
      if (sortField === 'population') {
        return multiplier * (a.population - b.population)
      }
      if (sortField === 'area') {
        return multiplier * ((a.area || 0) - (b.area || 0))
      }
      return 0
    })

    setFilteredCountries(filtered)
  }

  // GET /alpha/{code} - Get country by code
  const getCountryByCode = async (code) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`)
      if (!response.ok) throw new Error('Country not found')
      const data = await response.json()
      
      // Since the API response for a single country code is not always consistent,
      // check if it's an array and get first element if so
      const countryData = Array.isArray(data) ? data[0] : data
      
      setSelectedCountry(countryData)
      
      // Navigate to the country detail page using React Router
      navigate(`/country/${code}`);
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching country details:', error)
      setError(error.message)
      setLoading(false)
    }
  }

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
    // Navigate to country detail page using React Router
    navigate(`/country/${country.cca3}`);
  }

  const handleBack = () => {
    setSelectedCountry(null);
    setCompareMode(false);
    setCountriesToCompare([]);
    navigate('/home');
  }

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    
    // Apply/remove the dark class to the document element
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  const toggleFavorite = (country) => {
    const isFavorite = favorites.some(fav => fav.cca3 === country.cca3)
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.cca3 !== country.cca3))
    } else {
      setFavorites([...favorites, country])
    }
  }

  const toggleCompareMode = () => {
    const newCompareMode = !compareMode
    setCompareMode(newCompareMode)
    if (newCompareMode) {
      // Initialize filtered compare countries with all countries
      setFilteredCompareCountries([countries, countries])
    } else {
      setCountriesToCompare([])
    }
  }

  const addToCompare = (country) => {
    if (countriesToCompare.length < 2 && !countriesToCompare.some(c => c.cca3 === country.cca3)) {
      setCountriesToCompare([...countriesToCompare, country])
    }
  }

  const removeFromCompare = (countryCode) => {
    setCountriesToCompare(countriesToCompare.filter(c => c.cca3 !== countryCode))
  }

  // Apply filters for compare mode
  const applyCompareFilters = (index, filter) => {
    if (!countries.length) return
    
    let filtered = [...countries]
    
    // Apply region filter
    if (filter.region) {
      filtered = filtered.filter(country => country.region === filter.region)
    }
    
    // Apply population filter
    filtered = filtered.filter(country =>
      country.population >= 0 &&
      country.population <= filter.populationMax
    )
    
    // Apply sorting
    filtered.sort((a, b) => {
      const sortField = filter.sort.startsWith('-') ? filter.sort.slice(1) : filter.sort
      const multiplier = filter.sort.startsWith('-') ? -1 : 1
      
      if (sortField === 'name') {
        return multiplier * a.name.common.localeCompare(b.name.common)
      }
      if (sortField === 'population') {
        return multiplier * (a.population - b.population)
      }
      if (sortField === 'area') {
        return multiplier * ((a.area || 0) - (b.area || 0))
      }
      return 0
    })
    
    // Update the filtered countries for this compare side
    const newFilteredCompare = [...filteredCompareCountries]
    newFilteredCompare[index] = filtered
    setFilteredCompareCountries(newFilteredCompare)
  }

  // We need a useEffect to handle URL-based country loading
  useEffect(() => {
    // Check if we're on a country detail page
    const path = window.location.pathname;
    if (path.startsWith('/country/')) {
      const countryCode = path.split('/').pop();
      if (countryCode && !selectedCountry) {
        getCountryByCode(countryCode);
      }
    }
  }, []);  // Run only once on component mount

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white relative bg-pattern-light bg-pattern-dark overflow-hidden">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} compareMode={compareMode} toggleCompareMode={toggleCompareMode} />
        
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginWrapper />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/home" element={
            <ProtectedRoute>
              <>
                <div className="container mx-auto px-4 py-8">
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Countries Explorer</h1>
                    <button
                      onClick={toggleCompareMode}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        compareMode
                          ? 'bg-blue-500 hover:bg-blue-600 text-white'
                          : darkMode 
                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      }`}
                    >
                      {compareMode ? 'Exit Compare Mode' : 'Compare Countries'}
                    </button>
                  </div>
                
                  <div className="flex flex-col md:flex-row md:space-x-4 pb-8">
                    <div className="w-full md:w-2/3 mb-4 md:mb-0">
                      {!compareMode && (
                        <SearchBar onSearch={handleSearch} searchTerm={searchTerm} darkMode={darkMode} />
                      )}
                    </div>
                    <div className="w-full md:w-1/3">
                      <Filter
                        regions={Array.from(new Set(countries.map(country => country.region))).filter(Boolean)}
                        selectedRegion={selectedRegion}
                        onRegionChange={handleRegionFilter}
                        populationRange={populationRange}
                        onPopulationChange={handlePopulationFilter}
                        sortBy={sortBy}
                        onSortChange={handleSort}
                        darkMode={darkMode}
                        compareMode={compareMode}
                        countriesToCompare={countriesToCompare}
                        onCountryFilterChange={applyCompareFilters}
                      />
                    </div>
                  </div>
                  
                  {/* Error/loading indicator */}
                  {error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                      <p>{error}</p>
                    </div>
                  ) : loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <>
                      {/* Map component */}
                      {!compareMode && (
                        <div className="mb-10 transform transition-all duration-700 hover:scale-[1.02]">
                          <WorldMap 
                            darkMode={darkMode} 
                            onRegionClick={(region) => {
                              // Set the selected region based on the region name
                              const regionName = region.name;
                              // Map the region names from the WorldMap component to the API's region names
                              const regionMapping = {
                                "North America": "Americas",
                                "South America": "Americas",
                                "Europe": "Europe",
                                "Africa": "Africa",
                                "Asia": "Asia",
                                "Oceania": "Oceania",
                                "Antarctica": "Antarctic"
                              };
                              
                              const apiRegionName = regionMapping[regionName];
                              handleRegionFilter(apiRegionName);
                              
                              // Show a notification or feedback
                              const notification = document.createElement('div');
                              notification.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
                              notification.textContent = `Showing countries in ${regionName}`;
                              document.body.appendChild(notification);
                              
                              // Remove notification after 3 seconds
                              setTimeout(() => {
                                notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
                                setTimeout(() => {
                                  document.body.removeChild(notification);
                                }, 500);
                              }, 2500);
                            }}
                          />
                        </div>
                      )}
                      
                      {compareMode ? (
                        // Side-by-side country lists
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {filteredCompareCountries.map((countries, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                                {countriesToCompare[index] ? 
                                  `Similar to ${countriesToCompare[index].name.common}` : 
                                  `Country List ${index + 1}`
                                }
                              </h2>
                              <div className="h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                {countries.map(country => (
                                  <div 
                                    key={country.cca3}
                                    className={`flex items-center p-3 mb-2 border rounded-lg cursor-pointer transition-colors
                                      ${darkMode 
                                        ? 'border-gray-700 hover:bg-gray-700' 
                                        : 'border-gray-200 hover:bg-gray-50'
                                      }
                                      ${countriesToCompare.some(c => c?.cca3 === country.cca3) ? 
                                        'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900' : ''
                                      }
                                    `}
                                    onClick={() => addToCompare(country)}
                                  >
                                    <img 
                                      src={country.flags.png} 
                                      alt={`${country.name.common} flag`}
                                      className="w-12 h-8 object-cover rounded mr-3"
                                    />
                                    <div>
                                      <h3 className="font-medium text-gray-900 dark:text-white">
                                        {country.name.common}
                                      </h3>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {country.region} • Pop: {country.population.toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                                {countries.length === 0 && (
                                  <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p>No countries match these filters</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        // Normal country list
                        <CountryList
                          countries={filteredCountries}
                          onCountryClick={handleCountryClick}
                          darkMode={darkMode}
                          favorites={favorites}
                          onToggleFavorite={toggleFavorite}
                          compareMode={compareMode}
                          countriesToCompare={countriesToCompare}
                          onAddToCompare={addToCompare}
                          onRemoveFromCompare={removeFromCompare}
                        />
                      )}
                    </>
                  )}
                  
                  {/* Standard comparison UI (when 2 countries are selected) */}
                  {compareMode && countriesToCompare.length === 2 && (
                    <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                        Countries Comparison
                      </h2>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead>
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Comparison</th>
                              {countriesToCompare.map(country => (
                                <th key={country.cca3} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  <div className="flex items-center">
                                    <img 
                                      src={country.flags.png} 
                                      alt={`${country.name.common} flag`}
                                      className="w-6 h-4 mr-2 object-cover"
                                    />
                                    {country.name.common}
                                    <button 
                                      onClick={() => removeFromCompare(country.cca3)}
                                      className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                      </svg>
                                    </button>
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            {/* Existing comparison rows */}
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Population</td>
                              {countriesToCompare.map(country => (
                                <td key={country.cca3} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {country.population.toLocaleString()}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Area</td>
                              {countriesToCompare.map(country => (
                                <td key={country.cca3} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {country.area ? `${country.area.toLocaleString()} km²` : 'N/A'}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Region</td>
                              {countriesToCompare.map(country => (
                                <td key={country.cca3} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {country.region}
                                </td>
                              ))}
                            </tr>
                            {/* Additional comparison rows */}
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Capital</td>
                              {countriesToCompare.map(country => (
                                <td key={country.cca3} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {country.capital ? country.capital.join(', ') : 'N/A'}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Languages</td>
                              {countriesToCompare.map(country => (
                                <td key={country.cca3} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {country.languages ? Object.values(country.languages).join(', ') : 'N/A'}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Currency</td>
                              {countriesToCompare.map(country => (
                                <td key={country.cca3} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {country.currencies 
                                    ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol})`).join(', ') 
                                    : 'N/A'}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Population Density</td>
                              {countriesToCompare.map(country => (
                                <td key={country.cca3} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {country.area 
                                    ? `${(country.population / country.area).toFixed(2)} people/km²` 
                                    : 'N/A'}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </>
            </ProtectedRoute>
          } />
          
          <Route path="/country/:code" element={
            <ProtectedRoute>
              <div className="container mx-auto px-4 py-8">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                    <p>{error}</p>
                  </div>
                ) : selectedCountry ? (
                  <CountryDetail
                    country={selectedCountry}
                    onBack={handleBack}
                    isFavorite={favorites.some(fav => fav.cca3 === selectedCountry.cca3)}
                    onToggleFavorite={() => toggleFavorite(selectedCountry)}
                    onBorderClick={getCountryByCode}
                    darkMode={darkMode}
                    compareMode={compareMode}
                    onAddToCompare={() => addToCompare(selectedCountry)}
                  />
                ) : (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/favorites" element={
            <ProtectedRoute>
              <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-8 text-center dark:text-white fancy-heading">Your Favorite Countries</h2>
                {favorites.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-300">You haven't added any countries to your favorites yet.</p>
                  </div>
                ) : (
                  <CountryList
                    countries={favorites}
                    onCountryClick={handleCountryClick}
                    darkMode={darkMode}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    compareMode={compareMode}
                    countriesToCompare={countriesToCompare}
                    onAddToCompare={addToCompare}
                    onRemoveFromCompare={removeFromCompare}
                  />
                )}
                
                {/* Compare mode UI */}
                {compareMode && countriesToCompare.length > 0 && (
                  <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                      Countries to Compare ({countriesToCompare.length}/2)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {countriesToCompare.map(country => (
                        <div 
                          key={country.cca3}
                          className="flex items-center p-3 border rounded-lg dark:border-gray-700"
                        >
                          <img 
                            src={country.flags.png} 
                            alt={`${country.name.common} flag`}
                            className="w-12 h-8 mr-3 object-cover"
                          />
                          <span className="text-gray-900 dark:text-white">{country.name.common}</span>
                          <button 
                            onClick={() => removeFromCompare(country.cca3)}
                            className="ml-auto p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {countriesToCompare.length === 2 && (
                      <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead>
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Comparison</th>
                              {countriesToCompare.map(country => (
                                <th key={country.cca3} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  {country.name.common}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Population</td>
                              {countriesToCompare.map(country => (
                                <td key={country.cca3} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {country.population.toLocaleString()}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Area</td>
                              {countriesToCompare.map(country => (
                                <td key={country.cca3} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {country.area ? `${country.area.toLocaleString()} km²` : 'N/A'}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Region</td>
                              {countriesToCompare.map(country => (
                                <td key={country.cca3} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {country.region}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Capital</td>
                              {countriesToCompare.map(country => (
                                <td key={country.cca3} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {country.capital?.[0] || 'N/A'}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Currency</td>
                              {countriesToCompare.map(country => (
                                <td key={country.cca3} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {country.currencies ? Object.values(country.currencies).map(c => c.name).join(', ') : 'N/A'}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Languages</td>
                              {countriesToCompare.map(country => (
                                <td key={country.cca3} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {country.languages ? Object.values(country.languages).join(', ') : 'N/A'}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={toggleCompareMode}
                    className={`${
                      compareMode ? 'bg-red-500 hover:bg-red-600' : 'gradient-button'
                    } text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300`}
                  >
                    {compareMode ? 'Cancel Comparison' : 'Compare Countries'}
                  </button>
                </div>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

// This wrapper component allows us to access the useAuth hook inside the component tree
function LoginWrapper() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  
  // If user is already logged in, redirect to home
  if (user) {
    return <Navigate to="/home" replace />;
  }
  
  const handleLogin = (userData) => {
    login(userData);
    navigate('/home');
  };
  
  return <Login onLogin={handleLogin} />;
}

export default App
