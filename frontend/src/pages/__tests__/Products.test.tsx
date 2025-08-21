import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Products from '../Products';
import { AuthProvider } from '../../hooks/useAuth';
import { productsAPI, api } from '../../services/api';

jest.mock('../../services/api');
const mockedProductsAPI = productsAPI as jest.Mocked<typeof productsAPI>;
const mockedApi = api as jest.Mocked<typeof api>;

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockProducts = {
  content: [
    {
      id: 1,
      name: 'iPhone 15',
      description: 'Latest iPhone',
      price: 999.99,
      category: 'Electronics',
      stock: 50,
      isActive: true
    }
  ],
  totalElements: 1,
  totalPages: 1,
  size: 10,
  number: 0
};

const ProductsWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Products Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('currentUser', JSON.stringify({
      id: 1,
      username: 'customer',
      role: 'CUSTOMER'
    }));
    mockedProductsAPI.getProducts.mockResolvedValue(mockProducts);
  });

  test('renders products list', async () => {
    render(<Products />, { wrapper: ProductsWrapper });
    
    await waitFor(() => {
      expect(screen.getByText('iPhone 15')).toBeInTheDocument();
      expect(screen.getByText('$999.99')).toBeInTheDocument();
      expect(screen.getByText('Electrónicos')).toBeInTheDocument();
    });
  });

  test('shows search form', () => {
    render(<Products />, { wrapper: ProductsWrapper });
    
    expect(screen.getByLabelText('Nombre del Producto')).toBeInTheDocument();
    expect(screen.getByLabelText('Categoría')).toBeInTheDocument();
    expect(screen.getByLabelText('Precio Mínimo')).toBeInTheDocument();
    expect(screen.getByLabelText('Precio Máximo')).toBeInTheDocument();
  });

  test('handles search', async () => {
    mockedProductsAPI.searchProducts.mockResolvedValue(mockProducts);
    
    render(<Products />, { wrapper: ProductsWrapper });
    
    fireEvent.change(screen.getByLabelText('Nombre del Producto'), {
      target: { value: 'iPhone' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /buscar/i }));
    
    await waitFor(() => {
      expect(mockedProductsAPI.searchProducts).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'iPhone' }),
        0,
        10
      );
    });
  });

  test('shows buy button for customers', async () => {
    render(<Products />, { wrapper: ProductsWrapper });
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /comprar/i })).toBeInTheDocument();
    });
  });

  test('shows admin buttons for admin users', async () => {
    localStorage.setItem('currentUser', JSON.stringify({
      id: 1,
      username: 'admin',
      role: 'ADMIN'
    }));
    
    render(<Products />, { wrapper: ProductsWrapper });
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /agregar producto/i })).toBeInTheDocument();
    });
  });

  test('handles buy product', async () => {
    mockedApi.post.mockResolvedValue({ data: { id: 1 } });
    
    render(<Products />, { wrapper: ProductsWrapper });
    
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /comprar/i }));
    });
    
    expect(screen.getByText('Comprar Producto')).toBeInTheDocument();
    
    fireEvent.click(screen.getByRole('button', { name: 'Comprar' }));
    
    await waitFor(() => {
      expect(mockedApi.post).toHaveBeenCalled();
    });
  });
});