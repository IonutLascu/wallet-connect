import axios from 'axios';
import { CONFIG } from '../config';

const api = axios.create({
  baseURL: CONFIG.API_URL,
  headers: CONFIG.DEFAULT_HEADERS
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem(CONFIG.AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchSettings = async () => {
  try {
    const response = await api.get(CONFIG.API_ENDPOINTS.SETTINGS);
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post(CONFIG.API_ENDPOINTS.LOGIN, { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error.response?.data || error;
  }
};

export const checkAuth = async () => {
  try {
    const response = await api.get(CONFIG.API_ENDPOINTS.AUTH_CHECK);
    return response.data;
  } catch (error) {
    console.error('Auth check error:', error);
    throw error.response?.data || error;
  }
};