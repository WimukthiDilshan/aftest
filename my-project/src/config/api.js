const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = {
  // User endpoints
  users: {
    login: `${API_URL}/api/users/login`,
    register: `${API_URL}/api/users/register`,
    profile: `${API_URL}/api/users/profile`,
    updateProfile: `${API_URL}/api/users/profile`,
  },
};

export default api; 