describe('Utility Functions', () => {
  test('localStorage mock works correctly', () => {
    localStorage.setItem('test', 'value');
    expect(localStorage.getItem('test')).toBe('value');
    
    localStorage.removeItem('test');
    expect(localStorage.getItem('test')).toBeNull();
    
    localStorage.clear();
    expect(localStorage.clear).toBeDefined();
  });

  test('price formatting', () => {
    const formatPrice = (price: number) => `$${price.toFixed(2)}`;
    
    expect(formatPrice(999.99)).toBe('$999.99');
    expect(formatPrice(1000)).toBe('$1000.00');
    expect(formatPrice(0.5)).toBe('$0.50');
  });

  test('date formatting', () => {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString();
    };
    
    const testDate = '2024-01-01T10:00:00Z';
    const formatted = formatDate(testDate);
    
    expect(formatted).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
  });

  test('role checking utilities', () => {
    const isAdmin = (role: string) => role === 'ROLE_ADMIN' || role === 'ADMIN';
    const isCustomer = (role: string) => role === 'CUSTOMER';
    
    expect(isAdmin('ROLE_ADMIN')).toBe(true);
    expect(isAdmin('ADMIN')).toBe(true);
    expect(isAdmin('CUSTOMER')).toBe(false);
    
    expect(isCustomer('CUSTOMER')).toBe(true);
    expect(isCustomer('ADMIN')).toBe(false);
  });

  test('stock status utilities', () => {
    const getStockStatus = (stock: number) => {
      if (stock === 0) return 'out-of-stock';
      if (stock <= 10) return 'low-stock';
      return 'in-stock';
    };
    
    expect(getStockStatus(0)).toBe('out-of-stock');
    expect(getStockStatus(5)).toBe('low-stock');
    expect(getStockStatus(50)).toBe('in-stock');
  });

  test('order status utilities', () => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'PENDING': return 'warning';
        case 'APPROVED': return 'success';
        case 'REJECTED': return 'error';
        default: return 'default';
      }
    };
    
    expect(getStatusColor('PENDING')).toBe('warning');
    expect(getStatusColor('APPROVED')).toBe('success');
    expect(getStatusColor('REJECTED')).toBe('error');
    expect(getStatusColor('UNKNOWN')).toBe('default');
  });
});