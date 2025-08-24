import axios from 'axios';
import { CONFIG } from '../config';

const api = axios.create({
  baseURL: CONFIG.API_URL,
  headers: CONFIG.DEFAULT_HEADERS
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


const redirectToLogin = () => {
  try { localStorage.removeItem('token'); } catch {}
  if (window.location.pathname !== '/login') {
    window.location.replace('/login?session=expired');
  }
};

api.interceptors.response.use(
  res => res,
  err => {
    const status = err?.response?.status;
    if (status === 401 || 403 === status) redirectToLogin();
    return Promise.reject(err);
  }
);

export const login = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    const { token } = response.data;
    localStorage.setItem('token', token);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const fetchSettings = async () => {
  const { data } = await api.get('/api/settings');
  return Array.isArray(data) ? data[0] : data;
};

export const createSettings = async (settings) => {
  const { data } = await api.post('/api/settings', settings);
  return data;
};

export const fetchAllSettings = async () => {
  try {
    const response = await api.get('/api/settings');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};