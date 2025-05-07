const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Remove trailing slash if present and ensure /api prefix
const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
const apiBaseUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;

export const api = {
  // User endpoints
  users: {
    login: `${apiBaseUrl}/users/login`,
    register: `${apiBaseUrl}/users`,
    profile: `${apiBaseUrl}/users/profile`,
    updateProfile: `${apiBaseUrl}/users/profile`,
  },
};

export default api; 