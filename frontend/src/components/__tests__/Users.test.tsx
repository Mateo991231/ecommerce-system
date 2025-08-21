import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Users from '../Users';
import { AuthProvider } from '../../hooks/useAuth';

const UsersWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Users Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('shows permission error for non-admin users', () => {
    render(<Users />, { wrapper: UsersWrapper });
    
    expect(screen.getByText(/no tienes permisos/i)).toBeInTheDocument();
  });

  test('renders without crashing for admin', () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('currentUser', JSON.stringify({
      id: 1,
      username: 'admin',
      role: 'ROLE_ADMIN'
    }));
    
    render(<Users />, { wrapper: UsersWrapper });
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});