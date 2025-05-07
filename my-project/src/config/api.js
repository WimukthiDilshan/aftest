const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Remove trailing slash if present
const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;

export const api = {
  // User endpoints
  users: {
    login: `${baseUrl}/api/users/login`,
    register: `${baseUrl}/api/users`,
    profile: `${baseUrl}/api/users/profile`,
    updateProfile: `${baseUrl}/api/users/profile`,
  },
};

export default api; 