import { useState, useEffect, useRef } from 'react'

function SearchBar({ onSearch, searchTerm: externalSearchTerm, darkMode }) {
  const [searchTerm, setSearchTerm] = useState(externalSearchTerm || '')
  const [searchHistory, setSearchHistory] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const searchInputRef = useRef(null)

  useEffect(() => {
    // Load search history from localStorage
    const history = localStorage.getItem('searchHistory')
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  // Sync with external searchTerm prop when it changes
  useEffect(() => {
    if (externalSearchTerm !== undefined && externalSearchTerm !== searchTerm) {
      setSearchTerm(externalSearchTerm)
    }
  }, [externalSearchTerm])

  const handleChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
    setShowSuggestions(true)
  }

  const handleSearch = (term) => {
    if (term.trim()) {
      // Add to search history
      const newHistory = [term, ...searchHistory.filter(h => h !== term)].slice(0, 5)
      setSearchHistory(newHistory)
      localStorage.setItem('searchHistory', JSON.stringify(newHistory))
      onSearch(term)
    }
    setShowSuggestions(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm)
    }
  }

  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      setIsListening(true)
      const recognition = new window.webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim().replace(/\.$/, '')
        setSearchTerm(transcript)
        onSearch(transcript)
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.start()
    }
  }

  return (
    <div className="w-full md:w-96 relative">
      <div className="relative">
        <input
          ref={searchInputRef}
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Search for a country..."
          className={`w-full px-4 py-2 pl-10 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            darkMode 
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
        />
        <svg
          className={`absolute left-3 top-2.5 h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <button
          onClick={startVoiceSearch}
          className={`absolute right-3 top-2.5 p-1 rounded-full transition-colors ${
            isListening 
              ? 'text-red-500 animate-pulse' 
              : darkMode 
                ? 'text-gray-400 hover:text-gray-300' 
                : 'text-gray-400 hover:text-gray-600'
          }`}
          aria-label="Voice search"
          title="Voice search"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </button>
      </div>

      {/* Search Suggestions and History */}
      {showSuggestions && (searchHistory.length > 0 || searchTerm) && (
        <div className={`absolute w-full mt-2 rounded-lg shadow-lg overflow-hidden ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          {searchTerm && (
            <div className={`p-2 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <button
                onClick={() => handleSearch(searchTerm)}
                className={`w-full text-left px-2 py-1 rounded hover:bg-opacity-10 ${
                  darkMode 
                    ? 'text-white hover:bg-white' 
                    : 'text-gray-900 hover:bg-gray-900'
                }`}
              >
                Search for "{searchTerm}"
              </button>
            </div>
          )}
          {searchHistory.length > 0 && (
            <div className="p-2">
              <div className={`text-xs font-semibold mb-2 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Recent Searches
              </div>
              {searchHistory.map((term, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(term)}
                  className={`w-full text-left px-2 py-1 rounded hover:bg-opacity-10 ${
                    darkMode 
                      ? 'text-white hover:bg-white' 
                      : 'text-gray-900 hover:bg-gray-900'
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar 