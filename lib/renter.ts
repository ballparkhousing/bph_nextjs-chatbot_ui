// lib/rental.ts
import api from './api';
export const searchRenter = async (query: string) => {
  try {
    const response = await api.post('/renter/search', null, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching rentals:', error);
    throw error;
  }
};