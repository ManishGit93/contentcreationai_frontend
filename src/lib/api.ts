import axios from 'axios';
import { mockApi, shouldUseMockApi } from './mockApi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Create a proxy that uses mock API when enabled
const createApiProxy = () => {
  if (shouldUseMockApi()) {
    console.log('🔧 Using Mock API mode - backend not required');
    return {
      get: async (url: string, config?: any) => {
        if (url === '/proposals') return mockApi.getProposals();
        if (url.startsWith('/proposals/')) {
          const id = url.split('/proposals/')[1];
          return mockApi.getProposal(id);
        }
        if (url === '/templates') return mockApi.getTemplates();
        throw new Error(`Mock API: GET ${url} not implemented`);
      },
      post: async (url: string, data?: any, config?: any) => {
        if (url === '/auth/register') return mockApi.register(data);
        if (url === '/auth/login') return mockApi.login(data);
        if (url === '/proposals') return mockApi.createProposal(data);
        if (url === '/ai/generate-proposal') return mockApi.generateProposal(data);
        if (url === '/templates') return mockApi.createTemplate(data);
        throw new Error(`Mock API: POST ${url} not implemented`);
      },
      put: async (url: string, data?: any, config?: any) => {
        if (url === '/me') return mockApi.updateProfile(data);
        throw new Error(`Mock API: PUT ${url} not implemented`);
      },
      delete: async (url: string, config?: any) => {
        throw new Error(`Mock API: DELETE ${url} not implemented`);
      },
    };
  }
  return api;
};

export default createApiProxy();

