import { useState, useEffect } from 'react';

const WorldMap = ({ darkMode, onRegionClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [highlightedRegion, setHighlightedRegion] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [clickedRegion, setClickedRegion] = useState(null);
  const [activeRegion, setActiveRegion] = useState(null);

  // Define regions with coordinates for the interactive map - adjusted position for Oceania and added Antarctica
  const regions = [
    { id: 1, name: "North America", cx: "25%", cy: "35%", r: "12%", color: darkMode ? "#3B82F6" : "#2563EB", hoverColor: darkMode ? "#60A5FA" : "#3B82F6", 
      path: "M20,20 Q25,25 20,45 Q30,50 25,55 L35,50 Q40,40 30,30 L20,20" },
    { id: 2, name: "South America", cx: "30%", cy: "65%", r: "10%", color: darkMode ? "#EC4899" : "#DB2777", hoverColor: darkMode ? "#F472B6" : "#EC4899", 
      path: "M25,55 Q35,60 30,75 Q25,80 30,85 L40,75 Q35,65 30,60 L25,55" },
    { id: 3, name: "Europe", cx: "48%", cy: "30%", r: "8%", color: darkMode ? "#10B981" : "#059669", hoverColor: darkMode ? "#34D399" : "#10B981", 
      path: "M45,25 Q55,20 60,30 Q55,40 45,38 L40,35 Q45,30 45,25" },
    { id: 4, name: "Africa", cx: "50%", cy: "55%", r: "12%", color: darkMode ? "#F59E0B" : "#D97706", hoverColor: darkMode ? "#FBBF24" : "#F59E0B", 
      path: "M40,35 Q55,45 55,65 Q45,70 40,60 L38,50 Q40,40 40,35" },
    { id: 5, name: "Asia", cx: "65%", cy: "35%", r: "14%", color: darkMode ? "#8B5CF6" : "#7C3AED", hoverColor: darkMode ? "#A78BFA" : "#8B5CF6", 
      path: "M55,20 Q70,15 80,35 Q85,45 75,50 Q65,55 60,45 Q55,35 55,20" },
    { id: 6, name: "Oceania", cx: "78%", cy: "65%", r: "8%", color: darkMode ? "#EF4444" : "#DC2626", hoverColor: darkMode ? "#F87171" : "#EF4444", 
      path: "M70,55 Q85,60 85,70 Q80,75 70,70 L70,55" },
    { id: 7, name: "Antarctica", cx: "50%", cy: "85%", r: "10%", color: darkMode ? "#94A3B8" : "#64748B", hoverColor: darkMode ? "#CBD5E1" : "#94A3B8", 
      path: "M35,85 Q50,80 65,85 Q60,95 40,95 L35,85" }
  ];

  // World map image URLs for both light and dark modes - updated with higher contrast image for dark mode
  const worldMapLight = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Equirectangular_projection_SW.jpg/1024px-Equirectangular_projection_SW.jpg";
  const worldMapDark = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Blue_Marble_2002.png/1024px-Blue_Marble_2002.png";
  
  // Animation for the globe
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    const rotationInterval = setInterval(() => {
      setRotation(prev => (prev + 0.2) % 360);
    }, 50);

    return () => {
      clearTimeout(timer);
      clearInterval(rotationInterval);
    };
  }, []);

  // Handle mouse movement for interactive parallax effect
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  // Handle region click
  const handleRegionClick = (region) => {
    setClickedRegion(region.id);
    setActiveRegion(region.id);
    
    // Create a visual pulse effect at the click location
    const pulseEffect = document.createElement('div');
    pulseEffect.className = 'absolute w-16 h-16 rounded-full bg-white opacity-20 transform -translate-x-1/2 -translate-y-1/2 animate-ping';
    pulseEffect.style.left = `${region.cx}`;
    pulseEffect.style.top = `${region.cy}`;
    
    // Remove pulse effect after animation
    setTimeout(() => {
      if (pulseEffect.parentNode) {
        pulseEffect.parentNode.removeChild(pulseEffect);
      }
    }, 1000);
    
    // If parent component provided an onClick handler, call it with the region data
    if (onRegionClick) {
      onRegionClick(region);
    }
    
    // Reset clicked state after animation completes but keep the active region
    setTimeout(() => {
      setClickedRegion(null);
    }, 500);
  };

  // Generate random stars for the background
  const generateStars = (count) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      cx: `${Math.random() * 100}%`,
      cy: `${Math.random() * 100}%`,
      r: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      animationDelay: `${Math.random() * 5}s`
    }));
  };

  const stars = generateStars(100);

  return (
    <div 
      className={`relative w-full h-[400px] md:h-[450px] overflow-hidden rounded-xl transition-all duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0 transform translate-y-10'
      } ${darkMode ? 'bg-gray-900' : 'bg-black'}`}
      onMouseMove={handleMouseMove}
    >
      {/* Glowing background effect */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
            ${darkMode ? 'rgba(129, 140, 248, 0.3)' : 'rgba(59, 130, 246, 0.6)'}, 
            ${darkMode ? 'rgba(17, 24, 39, 0)' : 'rgba(0, 0, 0, 0)'} 70%)`
        }}
      ></div>

      {/* Stars background (only in dark mode) */}
      {darkMode && (
        <svg className="absolute inset-0 w-full h-full z-0">
          {stars.map(star => (
            <circle
              key={star.id}
              cx={star.cx}
              cy={star.cy}
              r={star.r}
              fill="white"
              opacity={star.opacity}
              className="animate-pulse"
              style={{ animationDuration: '3s', animationDelay: star.animationDelay }}
            />
          ))}
        </svg>
      )}

      {/* Preload images for map texture patterns */}
      <div className="hidden">
        <img src={worldMapLight} onLoad={() => setMapLoaded(true)} alt="World Map Light" />
        <img src={worldMapDark} onLoad={() => setMapLoaded(true)} alt="World Map Dark" />
      </div>

      {/* Main globe container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="relative w-[90%] h-[90%] transition-transform duration-700 ease-out"
          style={{ 
            transform: `rotateY(${rotation / 10}deg) rotateX(${Math.sin(rotation / 30) * 5}deg) perspective(1000px)`,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* 3D Globe SVG with realistic map texture */}
          <svg 
            viewBox="0 0 100 100" 
            className="absolute inset-0 w-full h-full z-10"
            style={{ filter: `drop-shadow(0 4px 20px ${darkMode ? 'rgba(79, 70, 229, 0.4)' : 'rgba(59, 130, 246, 0.3)'})` }}
          >
            {/* Define patterns for the earth texture */}
            <defs>
              <pattern id="worldMapPattern" patternUnits="userSpaceOnUse" width="100" height="100">
                <image 
                  href={darkMode ? worldMapDark : worldMapLight} 
                  width="100" 
                  height="100" 
                  preserveAspectRatio="xMidYMid slice"
                  opacity="1"
                />
              </pattern>
              
              {/* Overlay gradient for blending with the background */}
              <radialGradient id="globeGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor={darkMode ? "rgba(30, 41, 59, 0)" : "rgba(239, 246, 255, 0)"} />
                <stop offset="85%" stopColor={darkMode ? "rgba(30, 41, 59, 0)" : "rgba(239, 246, 255, 0)"} />
                <stop offset="100%" stopColor={darkMode ? "rgba(30, 41, 59, 0.3)" : "rgba(239, 246, 255, 0.5)"} />
              </radialGradient>
              
              {/* Color adjustment filter for dark mode */}
              <filter id="darkModeEnhance">
                <feColorMatrix 
                  type="matrix" 
                  values="1.2 0 0 0 0
                          0 1.2 0 0 0
                          0 0 1.2 0 0
                          0 0 0 1 0"
                />
                <feComponentTransfer>
                  <feFuncR type="linear" slope="1.2" intercept="0" />
                  <feFuncG type="linear" slope="1.2" intercept="0" />
                  <feFuncB type="linear" slope="1.2" intercept="0" />
                </feComponentTransfer>
              </filter>
            </defs>

            {/* Base circle for the globe with map texture */}
            <circle 
              cx="50%" 
              cy="50%" 
              r="45%" 
              fill="url(#worldMapPattern)" 
              stroke={darkMode ? '#3B82F6' : '#60A5FA'}
              strokeWidth={darkMode ? "0.5" : "1.5"}
              className="transition-all duration-300"
              filter={darkMode ? "url(#darkModeEnhance)" : "none"}
            />
            
            {/* Overlay for the 3D effect */}
            <circle 
              cx="50%" 
              cy="50%" 
              r="45%" 
              fill="url(#globeGradient)" 
              className="transition-all duration-300"
            />

            {/* Globe grid lines (reduced opacity for the realistic map) */}
            <g opacity={darkMode ? "0.4" : "0.6"}>
              {/* Latitude lines */}
              {[15, 30, 45, 60, 75].map(angle => (
                <ellipse 
                  key={`lat-${angle}`}
                  cx="50%" 
                  cy="50%" 
                  rx="45%" 
                  ry={`${45 * Math.cos(angle * Math.PI / 180)}%`}
                  fill="none"
                  stroke={darkMode ? '#8BBAFF' : '#93C5FD'}
                  strokeWidth={darkMode ? "0.3" : "0.8"}
                  strokeDasharray="1,1"
                />
              ))}
              
              {/* Longitude lines */}
              {Array.from({ length: 12 }).map((_, i) => (
                <line 
                  key={`long-${i}`}
                  x1="50%" 
                  y1="5%" 
                  x2="50%" 
                  y2="95%"
                  stroke={darkMode ? '#8BBAFF' : '#93C5FD'}
                  strokeWidth={darkMode ? "0.3" : "0.8"}
                  strokeDasharray="1,1"
                  transform={`rotate(${i * 30} 50 50)`}
                />
              ))}
            </g>

            {/* Interactive regions with fixed color values instead of dynamic classes */}
            {regions.map(region => (
              <g key={region.id} 
                 onMouseEnter={() => setHighlightedRegion(region.id)}
                 onMouseLeave={() => setHighlightedRegion(null)}
                 onClick={() => handleRegionClick(region)}
                 className="cursor-pointer">
                {/* Visible circle for region */}
                <circle
                  cx={region.cx}
                  cy={region.cy}
                  r={region.r}
                  fill={region.color}
                  opacity={highlightedRegion === region.id ? 0.6 : activeRegion === region.id ? 0.5 : 0.25}
                  stroke={activeRegion === region.id ? "white" : region.color}
                  strokeWidth={activeRegion === region.id ? "1" : "0.5"}
                  className={`transition-all duration-300 ${clickedRegion === region.id ? 'animate-ping' : ''}`}
                />
                
                {/* Continent shape path for better click detection */}
                <path
                  d={region.path}
                  fill={region.color}
                  opacity={highlightedRegion === region.id ? "0.2" : activeRegion === region.id ? "0.15" : "0.1"}
                  className="pointer-events-auto"
                  stroke={highlightedRegion === region.id || activeRegion === region.id ? "white" : "transparent"}
                  strokeWidth={activeRegion === region.id ? "1" : "0.5"}
                />
                
                {/* Invisible larger clickable area around the region */}
                <circle
                  cx={region.cx}
                  cy={region.cy}
                  r={`${parseFloat(region.r) * 1.8}%`}
                  fill="transparent"
                  className="pointer-events-auto"
                />
                
                {/* Pulse effect for hover interaction */}
                {(highlightedRegion === region.id || activeRegion === region.id) && (
                  <circle
                    cx={region.cx}
                    cy={region.cy}
                    r={region.r}
                    fill="none"
                    stroke="white" 
                    strokeWidth="0.8"
                    opacity="0.5"
                    className="animate-ping"
                    style={{ animationDuration: '1.5s' }}
                  />
                )}
                
                {/* Display name on hover or when active */}
                {(highlightedRegion === region.id || activeRegion === region.id) && (
                  <text
                    x={region.cx}
                    y={region.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={activeRegion === region.id ? "4.5" : "4"}
                    fontWeight="bold"
                    className="pointer-events-none"
                    style={{ textShadow: '0 0 3px black, 0 0 2px black' }}
                  >
                    {region.name}
                  </text>
                )}
                
                {/* "Click here" tooltip for better discoverability */}
                {highlightedRegion === region.id && activeRegion !== region.id && (
                  <text
                    x={region.cx}
                    y={`calc(${region.cy} + 6%)`}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="2.5"
                    className="pointer-events-none animate-pulse"
                    style={{ textShadow: '0 0 2px black' }}
                  >
                    Click to filter
                  </text>
                )}
              </g>
            ))}

            {/* Equator highlight */}
            <ellipse 
              cx="50%" 
              cy="50%" 
              rx="45%" 
              ry="45%"
              fill="none"
              stroke={darkMode ? '#60A5FA' : '#3B82F6'}
              strokeWidth="0.8"
              opacity="0.8"
            />

            {/* Animated glow pulse */}
            <circle 
              cx="50%" 
              cy="50%" 
              r="45%" 
              fill="none"
              stroke={darkMode ? '#3B82F6' : '#60A5FA'}
              strokeWidth="0.8"
              className="animate-ping"
              style={{ animationDuration: '3s' }}
              opacity="0.3"
            />
            
            {/* Light reflection overlay for 3D effect */}
            <ellipse 
              cx="40%" 
              cy="40%" 
              rx="30%" 
              ry="20%"
              fill="white"
              opacity={darkMode ? "0.08" : "0.1"}
            />
          </svg>

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: 0.4,
                  backgroundColor: darkMode ? '#60A5FA' : '#3B82F6',
                  animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out ${Math.random() * 5}s, pulse 3s infinite ease-in-out ${Math.random() * 3}s`,
                  boxShadow: `0 0 ${Math.random() * 5 + 5}px ${darkMode ? 'rgba(96, 165, 250, 0.5)' : 'rgba(59, 130, 246, 0.3)'}`
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Region information panel with clickable action button */}
      <div 
        className={`absolute bottom-4 left-0 right-0 mx-auto w-3/4 md:w-2/3 lg:w-1/2 p-3 rounded-lg z-20 backdrop-blur-md transition-all duration-300 ${
          darkMode 
            ? 'bg-gray-800/70 text-white' 
            : 'bg-white/90 text-gray-800 shadow-lg border border-gray-200'
        } transform ${highlightedRegion ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      >
        {highlightedRegion && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-6 h-6 rounded-full mr-2" 
                style={{ 
                  backgroundColor: regions.find(r => r.id === highlightedRegion)?.color 
                }}
              ></div>
              <div>
                <h3 className="font-bold text-base">
                  {regions.find(r => r.id === highlightedRegion)?.name}
                </h3>
                <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Click to explore countries in this region
                </p>
              </div>
            </div>
            <button 
              className={`px-3 py-1 text-xs font-medium rounded-md ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } transition-colors duration-200`}
              onClick={() => handleRegionClick(regions.find(r => r.id === highlightedRegion))}
            >
              View
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorldMap; 