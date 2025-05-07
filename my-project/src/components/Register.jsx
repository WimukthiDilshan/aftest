import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { name, username, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!name || !username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, username, email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // On successful registration, redirect to login page
      // Do not store user info - that will happen after login
      navigate('/login');
      
    } catch (error) {
      setError(error.message);
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
              Join Our Community
            </h2>
            <p className="text-gray-600 dark:text-gray-300">Create your account to explore countries</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 animate-pulse" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="floating-label">
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="auth-input w-full px-3 py-2 text-gray-900 dark:text-white placeholder-transparent"
                placeholder="Full name"
                value={name}
                onChange={handleChange}
              />
              <label htmlFor="name" className="text-gray-500 dark:text-gray-400">Full name</label>
            </div>
            
            <div className="floating-label">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="auth-input w-full px-3 py-2 text-gray-900 dark:text-white placeholder-transparent"
                placeholder="Username"
                value={username}
                onChange={handleChange}
              />
              <label htmlFor="username" className="text-gray-500 dark:text-gray-400">Username</label>
            </div>
            
            <div className="floating-label">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="auth-input w-full px-3 py-2 text-gray-900 dark:text-white placeholder-transparent"
                placeholder="Email address"
                value={email}
                onChange={handleChange}
              />
              <label htmlFor="email" className="text-gray-500 dark:text-gray-400">Email address</label>
            </div>
            
            <div className="floating-label">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="auth-input w-full px-3 py-2 text-gray-900 dark:text-white placeholder-transparent"
                placeholder="Password"
                value={password}
                onChange={handleChange}
              />
              <label htmlFor="password" className="text-gray-500 dark:text-gray-400">Password</label>
            </div>
            
            <div className="floating-label">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="auth-input w-full px-3 py-2 text-gray-900 dark:text-white placeholder-transparent"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={handleChange}
              />
              <label htmlFor="confirmPassword" className="text-gray-500 dark:text-gray-400">Confirm password</label>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="auth-button gradient-button w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : 'Create Account'}
              </button>
            </div>
            
            <div className="flex items-center justify-center mt-6">
              <div className="text-sm">
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 hover:underline transition-all">
                  Already have an account? Sign in
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register; 