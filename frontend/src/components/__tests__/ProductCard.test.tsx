import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../ProductCard';

const mockProduct = {
  id: 1,
  name: 'iPhone 15',
  description: 'Latest iPhone model',
  price: 999.99,
  category: 'Electronics',
  stock: 50,
  isActive: true
};

const mockUser = {
  id: 1,
  username: 'admin',
  role: 'ADMIN' as const
};

describe('ProductCard Component', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnBuy = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders product information correctly', () => {
    render(
      <ProductCard 
        product={mockProduct} 
        user={mockUser}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onBuy={mockOnBuy}
      />
    );

    expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    expect(screen.getByText('Latest iPhone model')).toBeInTheDocument();
    expect(screen.getByText('$999.99')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Stock: 50')).toBeInTheDocument();
  });

  test('shows admin buttons for admin users', () => {
    render(
      <ProductCard 
        product={mockProduct} 
        user={mockUser}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onBuy={mockOnBuy}
      />
    );

    expect(screen.getByText('Editar')).toBeInTheDocument();
    expect(screen.getByText('Eliminar')).toBeInTheDocument();
  });

  test('shows buy button for customer users', () => {
    const customerUser = { ...mockUser, role: 'CUSTOMER' as const };
    
    render(
      <ProductCard 
        product={mockProduct} 
        user={customerUser}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onBuy={mockOnBuy}
      />
    );

    expect(screen.getByText('Comprar')).toBeInTheDocument();
    expect(screen.queryByText('Editar')).not.toBeInTheDocument();
    expect(screen.queryByText('Eliminar')).not.toBeInTheDocument();
  });

  test('calls onEdit when edit button is clicked', () => {
    render(
      <ProductCard 
        product={mockProduct} 
        user={mockUser}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onBuy={mockOnBuy}
      />
    );

    fireEvent.click(screen.getByText('Editar'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockProduct);
  });

  test('calls onDelete when delete button is clicked', () => {
    render(
      <ProductCard 
        product={mockProduct} 
        user={mockUser}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onBuy={mockOnBuy}
      />
    );

    fireEvent.click(screen.getByText('Eliminar'));
    expect(mockOnDelete).toHaveBeenCalledWith(mockProduct.id);
  });

  test('shows out of stock message when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    
    render(
      <ProductCard 
        product={outOfStockProduct} 
        user={mockUser}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onBuy={mockOnBuy}
      />
    );

    expect(screen.getByText('Agotado')).toBeInTheDocument();
  });
});