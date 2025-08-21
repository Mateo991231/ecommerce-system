import { User, Product, Order, OrderItem, PageResponse, JwtResponse, LoginRequest } from '../index';

describe('TypeScript Types', () => {
  test('User interface should have correct structure', () => {
    const user: User = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'CUSTOMER',
      isFrequentCustomer: false
    };

    expect(user.id).toBe(1);
    expect(user.role).toBe('CUSTOMER');
    expect(user.isFrequentCustomer).toBe(false);
  });

  test('Product interface should have correct structure', () => {
    const product: Product = {
      id: 1,
      name: 'iPhone 15',
      description: 'Latest iPhone model',
      price: 999.99,
      category: 'Electronics',
      stock: 50,
      isActive: true
    };

    expect(product.price).toBe(999.99);
    expect(product.isActive).toBe(true);
  });

  test('Order interface should have correct structure', () => {
    const order: Order = {
      id: 1,
      userId: 1,
      totalAmount: 999.99,
      discountApplied: 0,
      orderDate: '2024-01-01T00:00:00Z',
      status: 'PENDING',
      items: []
    };

    expect(order.status).toBe('PENDING');
    expect(order.items).toEqual([]);
  });

  test('OrderItem interface should have correct structure', () => {
    const orderItem: OrderItem = {
      id: 1,
      productId: 1,
      productName: 'iPhone 15',
      quantity: 2,
      unitPrice: 999.99
    };

    expect(orderItem.quantity).toBe(2);
    expect(orderItem.unitPrice).toBe(999.99);
  });

  test('PageResponse interface should have correct structure', () => {
    const pageResponse: PageResponse<Product> = {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 10,
      number: 0
    };

    expect(pageResponse.content).toEqual([]);
    expect(pageResponse.size).toBe(10);
  });

  test('JwtResponse interface should have correct structure', () => {
    const jwtResponse: JwtResponse = {
      token: 'jwt-token',
      type: 'Bearer',
      id: 1,
      username: 'admin',
      email: 'admin@test.com',
      role: 'ROLE_ADMIN'
    };

    expect(jwtResponse.type).toBe('Bearer');
    expect(jwtResponse.role).toBe('ROLE_ADMIN');
  });

  test('LoginRequest interface should have correct structure', () => {
    const loginRequest: LoginRequest = {
      username: 'admin',
      password: 'admin123'
    };

    expect(loginRequest.username).toBe('admin');
    expect(loginRequest.password).toBe('admin123');
  });
});