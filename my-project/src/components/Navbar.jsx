import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { useState, useEffect, useRef } from 'react';

const Navbar = ({ darkMode, toggleDarkMode, compareMode, toggleCompareMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const [navHeight, setNavHeight] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get navbar height for animations
  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }
  }, [navRef.current]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Generate random particles
  const particleCount = 12;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 15 + 20,
    delay: Math.random() * 5
  }));

  return (
    <>
      <nav 
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          darkMode 
            ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900' 
            : 'bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 shadow-lg'
        } ${scrolled ? 'shadow-2xl' : ''}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* 3D Parallax layer */}
        <div 
          className={`absolute inset-0 transition-transform duration-700 ease-out ${
            isHovering ? 'scale-105 opacity-80' : 'scale-100 opacity-50'
          }`} 
          style={{ 
            backgroundImage: darkMode 
              ? 'radial-gradient(circle at 50% 120%, rgba(76, 29, 149, 0.2), rgba(17, 24, 39, 0) 70%)' 
              : 'radial-gradient(circle at 50% 120%, rgba(255, 255, 255, 0.3), rgba(37, 99, 235, 0) 70%)'
          }}
        ></div>

        {/* Decorative top border with gradient and animation */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
          <div className="absolute inset-0 w-full bg-white opacity-30 animate-pulse" 
               style={{ animationDuration: '3s' }}></div>
        </div>
        
        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          {particles.map(particle => (
            <div 
              key={particle.id}
              className={`absolute rounded-full ${
                darkMode ? 'bg-blue-400' : 'bg-blue-500'
              }`}
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                opacity: 0.2,
                animation: `float ${particle.duration}s infinite ease-in-out ${particle.delay}s, pulse 3s infinite ease-in-out ${particle.delay}s`,
                boxShadow: darkMode 
                  ? `0 0 ${particle.size * 2}px rgba(96, 165, 250, 0.3)` 
                  : `0 0 ${particle.size * 2}px rgba(59, 130, 246, 0.2)`
              }}
            ></div>
          ))}
        </div>
        
        {/* Background pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-5 z-0 pointer-events-none">
          <div className={`absolute -top-10 -left-10 w-40 h-40 rounded-full ${
            darkMode ? 'bg-blue-600' : 'bg-blue-500'
          } blur-xl transform ${isHovering ? 'scale-110' : 'scale-100'} transition-transform duration-700`}></div>
          <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full ${
            darkMode ? 'bg-purple-700' : 'bg-purple-500'
          } blur-xl transform ${isHovering ? 'scale-110' : 'scale-100'} transition-transform duration-700`}></div>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)"></rect>
          </svg>
        </div>
        
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 relative z-10">
          {/* Logo and title */}
          <Link to={user ? "/home" : "/"} className="flex items-center group" onClick={closeMenu}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg mr-3 group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12">
              <div className="absolute w-12 h-12 rounded-full bg-blue-400 opacity-20 animate-ping" style={{animationDuration: '3s'}}></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white transform group-hover:rotate-[-12deg] transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="relative overflow-hidden">
                <span className={`self-center text-xl sm:text-2xl font-bold whitespace-nowrap transition-all duration-500 transform ${isHovering ? 'translate-y-[-100%]' : 'translate-y-0'} inline-block`} style={{ 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  backgroundImage: darkMode 
                    ? 'linear-gradient(to right, #60a5fa, #a78bfa)' 
                    : 'linear-gradient(to right, #ffffff, #e0f2fe)'
                }}>
                  Countries Explorer
                </span>
                <span className={`absolute top-0 left-0 text-xl sm:text-2xl font-bold whitespace-nowrap transition-all duration-500 transform ${isHovering ? 'translate-y-0' : 'translate-y-[100%]'}`} style={{ 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  backgroundImage: darkMode 
                    ? 'linear-gradient(to right, #a78bfa, #60a5fa)' 
                    : 'linear-gradient(to right, #e0f2fe, #ffffff)'
                }}>
                  Countries Explorer
                </span>
              </div>
              <span className={`block text-xs ${darkMode ? 'text-gray-400' : 'text-blue-100'} transition-all duration-500 ${isHovering ? 'translate-x-1' : ''}`}>
                Discover the world
              </span>
            </div>
          </Link>
          
          <div className="flex items-center md:order-2 space-x-2 sm:space-x-3 md:space-x-4">
            {/* Theme toggle with animation */}
            <div className="relative">
              <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                darkMode ? 'bg-purple-400' : 'bg-yellow-400'
              } animate-ping`} style={{animationDuration: '2s'}}></div>
              <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              <div className={`absolute inset-0 rounded-full ${
                  darkMode ? 'bg-purple-800' : 'bg-yellow-300'
                } opacity-0 group-hover:opacity-10 transform scale-0 group-hover:scale-125 transition-all duration-300`}>
              </div>
            </div>
            
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <div className={`text-gray-800 dark:text-white relative overflow-hidden ${
                  darkMode ? 'bg-gray-800' : 'bg-gray-100'
                } bg-opacity-30 px-3 py-1 rounded-full transition-all duration-300 group hover:shadow-md`}>
                  {/* Background shimmer effect */}
                  <div className="absolute inset-0 w-[200%] opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <span className="font-medium relative z-10">Welcome, {user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="relative py-2 px-4 font-medium rounded-lg text-white overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group"
                >
                  {/* Button gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 transition-all duration-300 group-hover:from-red-600 group-hover:to-pink-700"></div>
                  
                  {/* Button shine effect */}
                  <div className="absolute inset-0 w-[200%] opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <span className="relative z-10">Logout</span>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <Link
                  to="/login"
                  className="relative py-2 px-4 font-medium rounded-lg text-white overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group"
                >
                  {/* Button gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:from-blue-600 group-hover:to-purple-700"></div>
                  
                  {/* Button shine effect */}
                  <div className="absolute inset-0 w-[200%] opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <span className="relative z-10">Login</span>
                </Link>
                <Link
                  to="/register"
                  className={`relative py-2 px-4 font-medium rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group`}
                >
                  {/* Button background */}
                  <div className={`absolute inset-0 transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 group-hover:bg-gray-600' 
                      : 'bg-white group-hover:bg-gray-100'
                  }`}></div>
                  
                  {/* Button border */}
                  <div className={`absolute inset-0 border rounded-lg ${
                    darkMode ? 'border-gray-600' : 'border-gray-200'
                  }`}></div>
                  
                  {/* Button shine effect */}
                  <div className="absolute inset-0 w-[200%] opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <span className={`relative z-10 ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>Register</span>
                </Link>
              </div>
            )}
            
            {/* Mobile menu button with animated icon */}
            {user && (
              <button 
                type="button" 
                className={`inline-flex items-center p-2 ml-1 text-sm rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-gray-200 touch-target touch-ripple relative overflow-hidden ${
                  darkMode 
                    ? 'text-gray-400 hover:bg-gray-700 focus:ring-gray-600' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`} 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                
                {/* Button background pulse */}
                <div className={`absolute inset-0 rounded-lg ${
                  mobileMenuOpen 
                    ? darkMode ? 'bg-gray-700' : 'bg-gray-200' 
                    : 'bg-transparent'
                } transition-all duration-300`}></div>
                
                {/* Animated hamburger icon */}
                <div className="w-6 h-6 relative">
                  <span className={`absolute h-0.5 rounded-full transition-all duration-300 transform ${
                    darkMode ? 'bg-gray-300' : 'bg-gray-700'
                  } ${
                    mobileMenuOpen 
                      ? 'rotate-45 translate-y-0 w-6 top-3' 
                      : 'w-6 top-1.5'
                  }`}></span>
                  <span className={`absolute h-0.5 w-6 rounded-full transition-all duration-300 ${
                    darkMode ? 'bg-gray-300' : 'bg-gray-700'
                  } ${
                    mobileMenuOpen 
                      ? 'opacity-0' 
                      : 'opacity-100'
                  } top-3`}></span>
                  <span className={`absolute h-0.5 rounded-full transition-all duration-300 transform ${
                    darkMode ? 'bg-gray-300' : 'bg-gray-700'
                  } ${
                    mobileMenuOpen 
                      ? '-rotate-45 translate-y-0 w-6 top-3' 
                      : 'w-6 top-4.5'
                  }`}></span>
                </div>
              </button>
            )}
          </div>
          
          {/* Main navigation */}
          {user && (
            <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 transition-all duration-300 ${
              mobileMenuOpen 
                ? 'block opacity-100' 
                : 'hidden md:flex opacity-0 md:opacity-100'
            }`} id="navbar-user">
              <ul className={`flex flex-col font-medium p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 ${
                darkMode 
                  ? 'bg-gray-800 md:bg-transparent border border-gray-700' 
                  : 'bg-white md:bg-transparent border border-gray-200 shadow-sm'
              }`}>
                {['home', 'favorites', 'profile'].map((path) => (
                  <li key={path} className="relative">
                    <Link 
                      to={`/${path}`} 
                      className={`block py-2 pl-3 pr-4 rounded md:p-0 transition-all duration-300 ${
                        isActive(`/${path}`) 
                          ? darkMode
                            ? 'text-white md:text-blue-400'
                            : 'text-white md:text-white font-semibold' 
                          : darkMode
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white md:hover:bg-transparent md:hover:text-blue-400'
                            : 'text-blue-100 hover:bg-blue-700 hover:text-white md:hover:bg-transparent md:hover:text-white'
                      }`}
                      onClick={closeMenu}
                    >
                      {/* Mobile active background */}
                      {isActive(`/${path}`) && (
                        <div className={`absolute inset-0 rounded md:hidden ${
                          darkMode 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                            : 'bg-gradient-to-r from-blue-700 to-blue-600'
                        } -z-10`}></div>
                      )}
                      
                      {/* Desktop underline effect */}
                      <span className={`relative inline-block ${
                        isActive(`/${path}`) ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white' : ''
                      }`}>
                        {path.charAt(0).toUpperCase() + path.slice(1)}
                      </span>
                    </Link>
                  </li>
                ))}
                <li className="md:hidden">
                  <button
                    onClick={() => {
                      closeMenu();
                      handleLogout();
                    }}
                    className="relative block w-full text-left py-2 pl-3 pr-4 text-white rounded mt-2 overflow-hidden"
                  >
                    {/* Button background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 -z-10"></div>
                    
                    {/* Button shine effect */}
                    <div className="absolute inset-0 w-[200%] opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    <span className="relative z-10">Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
        
        {/* Bottom nav bar divider with glow effect */}
        <div className={`h-[1px] w-full ${
          darkMode ? 'bg-gray-800' : 'bg-gray-200'
        } relative overflow-hidden transition-opacity duration-300 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className={`absolute top-0 left-0 h-full w-20 animate-shimmer ${
            darkMode 
              ? 'bg-gradient-to-r from-transparent via-gray-700 to-transparent' 
              : 'bg-gradient-to-r from-transparent via-white to-transparent'
          }`}></div>
        </div>
      </nav>
      
      {/* Mobile bottom navigation - only show when logged in */}
      {user && (
        <div className="md:hidden block fixed bottom-0 left-0 z-50 w-full">
          <div className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          } z-50`}>
            <div className="flex justify-around items-center h-16">
              {['home', 'favorites', 'profile'].map((path) => (
                <Link 
                  key={path}
                  to={`/${path}`} 
                  className={`mobile-nav-item relative ${isActive(`/${path}`) ? 'active' : ''}`}
                >
                  {/* Active indicator */}
                  {isActive(`/${path}`) && (
                    <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                      darkMode ? 'bg-blue-400' : 'bg-blue-600'
                    }`}></div>
                  )}
                  
                  {/* Icon for each navigation item */}
                  <div className="relative">
                    {isActive(`/${path}`) && (
                      <div className={`absolute inset-0 rounded-full ${
                        darkMode ? 'bg-blue-500' : 'bg-blue-600'
                      } opacity-20 animate-ping`} style={{animationDuration: '2s'}}></div>
                    )}
                    
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform duration-300 ${
                      isActive(`/${path}`) ? 'scale-110' : ''
                    } ${
                      isActive(`/${path}`) 
                        ? darkMode ? 'text-blue-400' : 'text-blue-600'
                        : darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {path === 'home' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive(`/${path}`) ? 2.5 : 2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      )}
                      {path === 'favorites' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive(`/${path}`) ? 2.5 : 2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      )}
                      {path === 'profile' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive(`/${path}`) ? 2.5 : 2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      )}
                    </svg>
                  </div>
                  
                  <span className={`text-xs mt-1 ${
                    isActive(`/${path}`)
                      ? darkMode ? 'text-blue-400' : 'text-blue-600'
                      : darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {path.charAt(0).toUpperCase() + path.slice(1)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Spacer to account for fixed header */}
      <div className="h-16"></div>
      
      {/* Spacer for mobile bottom nav */}
      {user && <div className="h-16 md:hidden"></div>}

      {/* Floating keyframes animations */}
      <style jsx="true">{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100vw);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </>
  );
};

export default Navbar; 