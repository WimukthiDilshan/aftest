const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = {
  // User endpoints
  users: {
    login: `${API_URL}/users/login`,
    register: `${API_URL}/users/register`,
    profile: `${API_URL}/users/profile`,
    updateProfile: `${API_URL}/users/profile`,
  },
};

export default api; 