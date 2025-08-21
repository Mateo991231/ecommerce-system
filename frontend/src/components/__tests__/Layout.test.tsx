import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from '../Layout';
import { AuthProvider } from '../../hooks/useAuth';

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Layout Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders children content', () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('currentUser', JSON.stringify({
      id: 1,
      username: 'admin',
      role: 'ROLE_ADMIN'
    }));
    
    render(
      <Layout>
        <div data-testid="child-content">Test Content</div>
      </Layout>,
      { wrapper: LayoutWrapper }
    );
    
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  test('renders without crashing', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
      { wrapper: LayoutWrapper }
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});