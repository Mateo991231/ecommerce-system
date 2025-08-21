import axios from 'axios';
import { LoginRequest, JwtResponse, Product, PageResponse } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials: LoginRequest): Promise<JwtResponse> =>
    api.post('/auth/login', credentials).then(res => res.data),
  
  register: (userData: any): Promise<any> =>
    api.post('/auth/register', userData).then(res => res.data),
};

// Products API
export const productsAPI = {
  getProducts: (page = 0, size = 10): Promise<PageResponse<Product>> =>
    api.get(`/products?page=${page}&size=${size}`).then(res => res.data),
  
  searchProducts: (params: any, page = 0, size = 10): Promise<PageResponse<Product>> => {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...Object.fromEntries(Object.entries(params).filter(([_, v]) => v))
    });
    return api.get(`/products/search?${searchParams}`).then(res => res.data);
  },
};

export { api };
export default api;