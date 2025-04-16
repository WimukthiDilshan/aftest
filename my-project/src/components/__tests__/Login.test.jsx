import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { AuthProvider } from '../../context/AuthContext';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const renderLogin = (props = {}) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Login {...props} />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    renderLogin();
    
    // Check if main elements are present
    expect(screen.getByPlaceholderText(/email or username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty form submission', async () => {
    renderLogin();
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);

    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
    });
  });

  test('handles successful login', async () => {
    const mockOnLogin = jest.fn();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'fake-token' }),
      })
    );

    renderLogin({ onLogin: mockOnLogin });
    
    const emailInput = screen.getByPlaceholderText(/email or username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const form = screen.getByRole('form');

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith({ token: 'fake-token' });
    });
  });

  test('shows error message for failed login', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Login failed' }),
      })
    );

    renderLogin();
    
    const emailInput = screen.getByPlaceholderText(/email or username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const form = screen.getByRole('form');

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'wrongpassword');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/login failed/i)).toBeInTheDocument();
    });
  });
}); 