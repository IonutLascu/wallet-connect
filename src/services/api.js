import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const fetchSettings = async () => {
  try {
    const response = await axios.get(`${API_URL}/settings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};