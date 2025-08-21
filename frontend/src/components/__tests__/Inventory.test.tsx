import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Inventory from '../Inventory';
import { AuthProvider } from '../../hooks/useAuth';

const InventoryWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Inventory Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('shows permission error for non-admin users', () => {
    render(<Inventory />, { wrapper: InventoryWrapper });
    
    expect(screen.getByText(/no tienes permisos/i)).toBeInTheDocument();
  });

  test('renders without crashing for admin', () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('currentUser', JSON.stringify({
      id: 1,
      username: 'admin',
      role: 'ROLE_ADMIN'
    }));
    
    render(<Inventory />, { wrapper: InventoryWrapper });
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});