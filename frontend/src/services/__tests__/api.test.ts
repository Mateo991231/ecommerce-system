jest.mock('../api', () => ({
  productsAPI: {
    getProducts: jest.fn(),
    searchProducts: jest.fn(),
  },
  authAPI: {
    login: jest.fn(),
    register: jest.fn(),
  },
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }
}));

import { productsAPI, authAPI } from '../api';
const mockedProductsAPI = productsAPI as jest.Mocked<typeof productsAPI>;
const mockedAuthAPI = authAPI as jest.Mocked<typeof authAPI>;

describe('API Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('productsAPI', () => {
    test('getProducts should return products', async () => {
      const mockResponse = {
        content: [{ id: 1, name: 'iPhone 15' }],
        totalElements: 1
      };
      
      mockedProductsAPI.getProducts.mockResolvedValue(mockResponse);
      
      const result = await productsAPI.getProducts(0, 10);
      
      expect(mockedProductsAPI.getProducts).toHaveBeenCalledWith(0, 10);
      expect(result).toEqual(mockResponse);
    });

    test('searchProducts should handle search parameters', async () => {
      const mockResponse = { content: [], totalElements: 0 };
      const searchParams = { name: 'iPhone', category: 'Electronics' };
      
      mockedProductsAPI.searchProducts.mockResolvedValue(mockResponse);
      
      const result = await productsAPI.searchProducts(searchParams, 0, 10);
      
      expect(mockedProductsAPI.searchProducts).toHaveBeenCalledWith(searchParams, 0, 10);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('authAPI', () => {
    test('login should return JWT response', async () => {
      const credentials = { username: 'admin', password: 'admin123' };
      const mockResponse = {
        token: 'jwt-token',
        id: 1,
        username: 'admin',
        email: 'admin@test.com',
        role: 'ROLE_ADMIN',
        type: 'Bearer'
      };
      
      mockedAuthAPI.login.mockResolvedValue(mockResponse);
      
      const result = await authAPI.login(credentials);
      
      expect(mockedAuthAPI.login).toHaveBeenCalledWith(credentials);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Error handling', () => {
    test('should handle API errors', async () => {
      const error = new Error('Network Error');
      mockedProductsAPI.getProducts.mockRejectedValue(error);
      
      await expect(productsAPI.getProducts(0, 10)).rejects.toThrow('Network Error');
    });
  });
});