// lib/rental.ts
import api from './api';
export const searchRental = async (query: string) => {
  try {
    const response = await api.post('/rental/search', null, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching rentals:', error);
    throw error;
  }
};