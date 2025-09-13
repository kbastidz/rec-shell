export const environment = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',

  apiEndpoints: {
    users: '/users',
    auth: '/auth',
    products: '/products',
    notifications: '/notifications',
  },

  // Variables de entorno
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
};

export const buildApiUrl = (endpoint: string): string => {
  return `${environment.baseUrl}${endpoint}`;
};