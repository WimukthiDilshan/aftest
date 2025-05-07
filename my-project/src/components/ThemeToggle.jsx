import { useState, useEffect } from 'react';

function ThemeToggle({ darkMode, toggleDarkMode }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    toggleDarkMode();
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <button
      onClick={handleClick}
      className={`relative w-12 h-12 rounded-full transition-all duration-500 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-yellow-200 to-yellow-400'
      } group`}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Animated background */}
      <div className={`absolute inset-0 rounded-full transition-opacity duration-500 ${
        darkMode ? 'opacity-0' : 'opacity-100'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-yellow-400 animate-pulse"></div>
      </div>

      {/* Sun/Moon icon */}
      <div className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ${
        isAnimating ? 'scale-110' : 'scale-100'
      }`}>
        {darkMode ? (
          // Moon icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-300 transform transition-transform duration-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        ) : (
          // Sun icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-yellow-600 transform transition-transform duration-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )}
      </div>

      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-full transition-opacity duration-500 ${
        darkMode ? 'opacity-0' : 'opacity-100'
      }`}>
        <div className="absolute inset-0 bg-yellow-400 opacity-20 blur-md"></div>
      </div>

      {/* Hover effect */}
      <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
        darkMode 
          ? 'bg-gray-700 opacity-0 group-hover:opacity-20' 
          : 'bg-yellow-300 opacity-0 group-hover:opacity-20'
      }`}></div>

      {/* Click ripple effect */}
      {isAnimating && (
        <div className="absolute inset-0 rounded-full animate-ping bg-yellow-400 opacity-20"></div>
      )}
    </button>
  );
}

export default ThemeToggle; 