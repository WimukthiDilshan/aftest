import { useState } from 'react'

function Filter({ 
  regions, 
  selectedRegion, 
  onRegionChange, 
  populationRange, 
  onPopulationChange, 
  sortBy, 
  onSortChange, 
  darkMode, 
  compareMode, 
  countriesToCompare,
  onCountryFilterChange 
}) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [filters, setFilters] = useState([
    { region: '', populationMax: 1500000000, sort: 'name' },
    { region: '', populationMax: 1500000000, sort: 'name' }
  ])

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: '-name', label: 'Name (Z-A)' },
    { value: 'population', label: 'Population (Low to High)' },
    { value: '-population', label: 'Population (High to Low)' },
    { value: 'area', label: 'Area (Small to Large)' },
    { value: '-area', label: 'Area (Large to Small)' }
  ]

  // If regions wasn't passed in, use default list
  const regionOptions = regions || ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']

  // Handle filter change for a specific side (0 for left, 1 for right)
  const handleSideFilterChange = (index, key, value) => {
    const newFilters = [...filters]
    newFilters[index] = { ...newFilters[index], [key]: value }
    setFilters(newFilters)
    
    // If in compare mode, notify parent component of filter changes
    if (compareMode && onCountryFilterChange) {
      onCountryFilterChange(index, { ...newFilters[index] })
    }
  }

  return (
    <div className="w-full responsive-container">
      {compareMode ? (
        // Side-by-side filter UI
        <div className="flex flex-col sm:flex-row gap-4">
          {[0, 1].map((index) => (
            <div key={index} className="flex-1 border p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm dark:border-gray-700">
              <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {countriesToCompare[index] ? (
                  <div className="flex items-center">
                    <img 
                      src={countriesToCompare[index].flags.png} 
                      alt={`${countriesToCompare[index].name.common} flag`}
                      className="w-6 h-4 mr-2 object-cover"
                    />
                    <span>{countriesToCompare[index].name.common}</span>
                  </div>
                ) : (
                  `Filter ${index + 1}`
                )}
              </h3>
              <div className="space-y-3">
                <div>
                  <select
                    value={filters[index].region}
                    onChange={(e) => handleSideFilterChange(index, 'region', e.target.value)}
                    className={`w-full px-3 py-2 sm:px-4 touch-target border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Filter by Region</option>
                    {regionOptions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block mb-2 text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Population (max: {filters[index].populationMax.toLocaleString()})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1500000000"
                    step="1000000"
                    value={filters[index].populationMax}
                    onChange={(e) => handleSideFilterChange(index, 'populationMax', parseInt(e.target.value))}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer touch-target"
                  />
                  <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>0</span>
                    <span>750M</span>
                    <span>1.5B</span>
                  </div>
                </div>
                <div>
                  <select
                    value={filters[index].sort}
                    onChange={(e) => handleSideFilterChange(index, 'sort', e.target.value)}
                    className={`w-full px-3 py-2 sm:px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-target text-sm ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Standard filter UI
        <div>
          <div className="flex-responsive sm:space-x-4">
            <select
              value={selectedRegion || ''}
              onChange={(e) => onRegionChange(e.target.value)}
              className={`w-full px-3 py-2 sm:px-4 touch-target border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">Filter by Region</option>
              {regionOptions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            
            <button 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`mt-3 sm:mt-0 px-3 py-2 sm:px-4 w-full rounded-lg border transition-colors touch-target touch-ripple text-sm sm:text-base ${
                darkMode 
                  ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600' 
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
            </button>
          </div>
          
          {showAdvancedFilters && (
            <div className="mt-4 space-y-4">
              <div>
                <label className={`block mb-2 text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Population (max: {populationRange.max.toLocaleString()})
                </label>
                <input
                  type="range"
                  min="0"
                  max="1500000000"
                  step="1000000"
                  value={populationRange.max}
                  onChange={(e) => onPopulationChange({...populationRange, max: parseInt(e.target.value)})}
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer touch-target"
                />
                <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>0</span>
                  <span>750M</span>
                  <span>1.5B</span>
                </div>
              </div>
              
              <div>
                <label className={`block mb-2 text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  className={`w-full px-3 py-2 sm:px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent touch-target text-sm sm:text-base ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Filter 