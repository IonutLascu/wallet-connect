export const CONFIG = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  AUTH_TOKEN_KEY: 'token',
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json'
  },
  API_ENDPOINTS: {
    LOGIN: '/api/auth/login',
    AUTH_CHECK: '/api/auth/me',
    SETTINGS: '/settings'
  }
};