import httpClient from '../../utils/httpClient';
import type { Product } from '../../types/searchTypes';
import { enrichProductsForCard } from '../../utils/productCardEnrichment';
import { notify } from '../../utils/notifications';

export const favoritesLoader = async () => {
  try {
    const response = await httpClient.get('/catalog/wishlist');
    const products = (response.data.data ?? []) as Product[];
    return await enrichProductsForCard(products);
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      (error as { response: { status: number } }).response?.status === 401
    ) {
      return [];
    }
    notify('error', 'Error de conexión', 'No hemos podido cargar tus favoritos.');
    return [];
  }
};
