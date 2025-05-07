import { useState, useEffect } from 'react';

const WorldMap = ({ darkMode, countries, onCountryClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [highlightedRegion, setHighlightedRegion] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [clickedRegion, setClickedRegion] = useState(null);
  const [activeRegion, setActiveRegion] = useState(null);

  // Define regions with coordinates for the interactive map
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
    
    // Filter countries by region and call onCountryClick with the first country
    const regionCountries = countries.filter(country => country.region === region.name);
    if (regionCountries.length > 0 && onCountryClick) {
      onCountryClick(regionCountries[0]);
    }
    
    // Reset clicked state after animation completes but keep the active region
    setTimeout(() => {
      setClickedRegion(null);
    }, 500);
  };

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

      {/* Main globe container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="relative w-[90%] h-[90%] transition-transform duration-700 ease-out"
          style={{ 
            transform: `rotateY(${rotation / 10}deg) rotateX(${Math.sin(rotation / 30) * 5}deg) perspective(1000px)`,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* 3D Globe SVG */}
          <svg 
            viewBox="0 0 100 100" 
            className="absolute inset-0 w-full h-full z-10"
            style={{ filter: `drop-shadow(0 4px 20px ${darkMode ? 'rgba(79, 70, 229, 0.4)' : 'rgba(59, 130, 246, 0.3)'})` }}
          >
            {/* Base circle for the globe */}
            <circle 
              cx="50%" 
              cy="50%" 
              r="45%" 
              fill={darkMode ? "#1E293B" : "#E2E8F0"}
              stroke={darkMode ? '#3B82F6' : '#60A5FA'}
              strokeWidth={darkMode ? "0.5" : "1.5"}
              className="transition-all duration-300"
            />

            {/* Interactive regions */}
            {regions.map(region => (
              <g
                key={region.id}
                onClick={() => handleRegionClick(region)}
                className="cursor-pointer transition-all duration-300"
                style={{
                  transform: `translate(${mousePosition.x * 10 - 5}px, ${mousePosition.y * 10 - 5}px)`,
                  filter: `drop-shadow(0 0 8px ${region.color})`
                }}
              >
                <path
                  d={region.path}
                  fill={region.color}
                  stroke={darkMode ? '#1E293B' : '#E2E8F0'}
                  strokeWidth="0.5"
                  className={`transition-all duration-300 ${
                    clickedRegion === region.id ? 'animate-pulse' : ''
                  }`}
                  style={{
                    opacity: activeRegion === region.id ? 0.8 : 0.6,
                    transform: `scale(${highlightedRegion === region.id ? 1.05 : 1})`
                  }}
                  onMouseEnter={() => setHighlightedRegion(region.id)}
                  onMouseLeave={() => setHighlightedRegion(null)}
                />
                <text
                  x={region.cx}
                  y={region.cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`text-xs font-bold transition-all duration-300 ${
                    darkMode ? 'fill-white' : 'fill-gray-900'
                  }`}
                  style={{
                    opacity: highlightedRegion === region.id ? 1 : 0,
                    transform: `translateY(${highlightedRegion === region.id ? '-20px' : '0'})`
                  }}
                >
                  {region.name}
                </text>
              </g>
            ))}

            {/* Equator line */}
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
          </svg>
        </div>
      </div>
    </div>
  );
};

export default WorldMap; 