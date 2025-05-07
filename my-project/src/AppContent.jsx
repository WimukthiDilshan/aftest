import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import CountryList from './components/CountryList';
import SearchBar from './components/SearchBar';
import Filter from './components/Filter';
import CountryDetail from './components/CountryDetail';
import ThemeToggle from './components/ThemeToggle';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import WorldMap from './components/WorldMap';
import SiteDescription from './components/SiteDescription';
import Favorites from './components/Favorites';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [populationRange, setPopulationRange] = useState({ min: 0, max: 1500000000 });
  const [sortBy, setSortBy] = useState('name');
  const [compareMode, setCompareMode] = useState(false);
  const [countriesToCompare, setCountriesToCompare] = useState([]);

  useEffect(() => {
    fetchAllCountries();
    // Initialize dark mode
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (country) => {
    const isFavorite = favorites.some(fav => fav.cca3 === country.cca3);
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.cca3 !== country.cca3));
    } else {
      setFavorites([...favorites, country]);
    }
  };

  const fetchAllCountries = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://restcountries.com/v3.1/all');
      if (!response.ok) throw new Error('Failed to fetch countries');
      const data = await response.json();
      setCountries(data);
      setFilteredCountries(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching countries:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredCountries(countries);
      return;
    }
    const filtered = countries.filter(country => 
      country.name.common.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCountries(filtered);
  };

  const handleRegionFilter = (region) => {
    setSelectedRegion(region);
    if (!region) {
      setFilteredCountries(countries);
      return;
    }
    const filtered = countries.filter(country => country.region === region);
    setFilteredCountries(filtered);
  };

  const handlePopulationFilter = (range) => {
    setPopulationRange(range);
    applyFilters(searchTerm, selectedRegion, range, sortBy);
  };

  const handleSort = (sort) => {
    setSortBy(sort);
    applyFilters(searchTerm, selectedRegion, populationRange, sort);
  };

  const applyFilters = (search, region, population, sort) => {
    let filtered = [...countries];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(country =>
        country.name.common.toLowerCase().includes(searchLower) ||
        country.name.official.toLowerCase().includes(searchLower)
      );
    }

    // Apply region filter
    if (region) {
      filtered = filtered.filter(country => country.region === region);
    }

    // Apply population filter
    filtered = filtered.filter(country =>
      country.population >= population.min &&
      country.population <= population.max
    );

    // Apply sorting
    filtered.sort((a, b) => {
      const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
      const multiplier = sort.startsWith('-') ? -1 : 1;

      if (sortField === 'name') {
        return multiplier * a.name.common.localeCompare(b.name.common);
      } else if (sortField === 'population') {
        return multiplier * (a.population - b.population);
      } else if (sortField === 'area') {
        return multiplier * ((a.area || 0) - (b.area || 0));
      }
      return 0;
    });

    setFilteredCountries(filtered);
  };

  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    if (compareMode) {
      setCountriesToCompare([]);
    }
  };

  const handleAddToCompare = (country) => {
    if (countriesToCompare.length < 2) {
      setCountriesToCompare([...countriesToCompare, country]);
    }
  };

  const handleRemoveFromCompare = (countryCode) => {
    setCountriesToCompare(countriesToCompare.filter(c => c.cca3 !== countryCode));
  };

  const applyCompareFilters = (index, filter) => {
    if (!countries.length) return;
    
    let filtered = [...countries];
    
    // Apply region filter
    if (filter.region) {
      filtered = filtered.filter(country => country.region === filter.region);
    }
    
    // Apply population filter
    filtered = filtered.filter(country =>
      country.population >= 0 &&
      country.population <= filter.populationMax
    );
    
    // Apply sorting
    filtered.sort((a, b) => {
      const sortField = filter.sort.startsWith('-') ? filter.sort.slice(1) : filter.sort;
      const multiplier = filter.sort.startsWith('-') ? -1 : 1;
      
      if (sortField === 'name') {
        return multiplier * a.name.common.localeCompare(b.name.common);
      } else if (sortField === 'population') {
        return multiplier * (a.population - b.population);
      } else if (sortField === 'area') {
        return multiplier * ((a.area || 0) - (b.area || 0));
      }
      return 0;
    });
    
    // Update the filtered countries for the specific side
    const newFilteredCountries = [...filteredCountries];
    newFilteredCountries[index] = filtered;
    setFilteredCountries(newFilteredCountries);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <div>
                  <SiteDescription />
                  <div className="mb-8">
                    <WorldMap 
                      darkMode={darkMode} 
                      onRegionClick={(region) => {
                        setSelectedRegion(region.name);
                        handleRegionFilter(region.name);
                      }} 
                    />
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {compareMode ? 'Compare Countries' : 'All Countries'}
                    </h1>
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
                  {error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      <p>{error}</p>
                    </div>
                  ) : loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <CountryList
                      countries={filteredCountries}
                      onCountryClick={(country) => navigate(`/country/${country.cca3}`)}
                      darkMode={darkMode}
                      favorites={favorites}
                      onToggleFavorite={toggleFavorite}
                      compareMode={compareMode}
                      countriesToCompare={countriesToCompare}
                      onAddToCompare={handleAddToCompare}
                      onRemoveFromCompare={handleRemoveFromCompare}
                    />
                  )}
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/country/:code"
            element={
              <ProtectedRoute>
                <CountryDetail
                  onBack={() => navigate('/home')}
                  darkMode={darkMode}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile darkMode={darkMode} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites
                  darkMode={darkMode}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default AppContent; 