import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Reports from '../Reports';
import { AuthProvider } from '../../hooks/useAuth';

const ReportsWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Reports Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('shows permission error for non-admin users', () => {
    render(<Reports />, { wrapper: ReportsWrapper });
    
    expect(screen.getByText(/no tienes permisos/i)).toBeInTheDocument();
  });

  test('renders without crashing for admin', () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('currentUser', JSON.stringify({
      id: 1,
      username: 'admin',
      role: 'ROLE_ADMIN'
    }));
    
    render(<Reports />, { wrapper: ReportsWrapper });
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});