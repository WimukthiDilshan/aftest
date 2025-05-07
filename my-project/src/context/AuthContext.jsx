import { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const userInfo = localStorage.getItem('userInfo');
        
        if (userInfo) {
          const parsedUser = JSON.parse(userInfo);
          
          // Verify token is still valid by making a request to profile endpoint
          const response = await fetch(api.users.profile, {
            headers: {
              Authorization: `Bearer ${parsedUser.token}`,
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          });
          
          if (response.ok) {
            setUser(parsedUser);
          } else {
            // Token is invalid, remove from localStorage
            localStorage.removeItem('userInfo');
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Clear invalid user data
        localStorage.removeItem('userInfo');
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);

  // Login user
  const login = (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext; 