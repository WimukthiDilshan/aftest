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
                  <div className="flex flex-col md:flex-row md:space-x-4 pb-8">
                    <div className="w-full md:w-2/3 mb-4 md:mb-0">
                      <SearchBar onSearch={handleSearch} searchTerm={searchTerm} darkMode={darkMode} />
                    </div>
                    <div className="w-full md:w-1/3">
                      <Filter
                        regions={Array.from(new Set(countries.map(country => country.region))).filter(Boolean)}
                        selectedRegion={selectedRegion}
                        onRegionChange={handleRegionFilter}
                        darkMode={darkMode}
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
                    <>
                      <div className="mb-8">
                        <WorldMap 
                          countries={countries}
                          onCountryClick={(country) => navigate(`/country/${country.cca3}`)}
                          darkMode={darkMode}
                        />
                      </div>
                      <CountryList
                        countries={filteredCountries}
                        onCountryClick={(country) => navigate(`/country/${country.cca3}`)}
                        darkMode={darkMode}
                        favorites={favorites}
                        onToggleFavorite={toggleFavorite}
                      />
                    </>
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
        </Routes>
      </main>
    </div>
  );
}

export default AppContent; 