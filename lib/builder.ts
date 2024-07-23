// lib/rental.ts
import api from './api';
export const searchBuilder = async (query: string) => {
  try {
    const response = await api.post('/builder/search', null, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching rentals:', error);
    throw error;
  }
};