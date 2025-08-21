describe('API Services - Simple Tests', () => {
  test('API module exports should be defined', () => {
    const api = require('../api');
    
    expect(api.productsAPI).toBeDefined();
    expect(api.authAPI).toBeDefined();
    expect(api.api).toBeDefined();
  });

  test('productsAPI should have required methods', () => {
    const { productsAPI } = require('../api');
    
    expect(typeof productsAPI.getProducts).toBe('function');
    expect(typeof productsAPI.searchProducts).toBe('function');
  });

  test('authAPI should have required methods', () => {
    const { authAPI } = require('../api');
    
    expect(typeof authAPI.login).toBe('function');
    expect(typeof authAPI.register).toBe('function');
  });
});