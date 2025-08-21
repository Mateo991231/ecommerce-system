import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { AuthProvider } from '../../hooks/useAuth';

const LoginWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Login Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders login form', () => {
    render(<Login />, { wrapper: LoginWrapper });
    
    expect(screen.getByText('E-Commerce')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  test('shows test credentials', () => {
    render(<Login />, { wrapper: LoginWrapper });
    
    expect(screen.getByText('Credenciales de prueba:')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('admin123')).toBeInTheDocument();
  });

  test('renders without crashing', () => {
    render(<Login />, { wrapper: LoginWrapper });
    
    expect(screen.getByText('Bienvenido de vuelta')).toBeInTheDocument();
  });
});