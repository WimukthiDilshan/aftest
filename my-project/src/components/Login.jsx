import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../config/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { identifier, password } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!identifier || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Attempting login to:', api.users.login);
      
      const response = await fetch(api.users.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email: identifier, password })
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }
      
      setSuccess(true);
      login(data);
      navigate('/home');
      
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pattern-light dark:bg-pattern-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="auth-container p-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold auth-heading mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 dark:text-gray-300">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 animate-pulse" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 animate-pulse" role="alert">
              <span className="block sm:inline">Login successful! Redirecting...</span>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit} role="form">
            <div className="floating-label">
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="email"
                required
                className="auth-input w-full px-3 py-2 text-gray-900 dark:text-white placeholder-transparent"
                placeholder="Email or Username"
                value={identifier}
                onChange={handleChange}
              />
              <label htmlFor="identifier" className="text-gray-500 dark:text-gray-400">Email or Username</label>
            </div>
            
            <div className="floating-label">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="auth-input w-full px-3 py-2 text-gray-900 dark:text-white placeholder-transparent"
                placeholder="Password"
                value={password}
                onChange={handleChange}
              />
              <label htmlFor="password" className="text-gray-500 dark:text-gray-400">Password</label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || success}
                className="auth-button gradient-button w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : success ? 'Redirecting...' : 'Sign in'}
              </button>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-sm">
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 hover:underline transition-all">
                  Don't have an account? Register
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 