import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Orders from '../Orders';
import { AuthProvider } from '../../hooks/useAuth';

const OrdersWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Orders Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders orders component', () => {
    render(<Orders />, { wrapper: OrdersWrapper });
    
    expect(screen.getByText(/gestión de órdenes/i)).toBeInTheDocument();
  });

  test('renders without crashing for admin', () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('currentUser', JSON.stringify({
      id: 1,
      username: 'admin',
      role: 'ROLE_ADMIN'
    }));
    
    render(<Orders />, { wrapper: OrdersWrapper });
    expect(screen.getByText(/gestión de órdenes/i)).toBeInTheDocument();
  });
});