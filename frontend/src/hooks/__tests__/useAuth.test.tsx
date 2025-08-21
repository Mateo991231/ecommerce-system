import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../useAuth';
import { authAPI } from '../../services/api';

jest.mock('../../services/api');
const mockedAuthAPI = authAPI as jest.Mocked<typeof authAPI>;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('should initialize with no user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isAdmin).toBe(false);
  });

  test('should load user from localStorage on init', () => {
    const mockUser = {
      token: 'test-token',
      id: 1,
      username: 'admin',
      email: 'admin@test.com',
      role: 'ROLE_ADMIN',
      type: 'Bearer'
    };
    
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(true);
  });

  test('should login successfully', async () => {
    const mockResponse = {
      token: 'new-token',
      id: 1,
      username: 'admin',
      email: 'admin@test.com',
      role: 'ROLE_ADMIN',
      type: 'Bearer'
    };
    
    mockedAuthAPI.login.mockResolvedValue(mockResponse);
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login({ username: 'admin', password: 'admin123' });
    });
    
    expect(result.current.user).toEqual(mockResponse);
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem('token')).toBe('new-token');
  });

  test('should logout successfully', () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('currentUser', JSON.stringify({ id: 1 }));
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });
});