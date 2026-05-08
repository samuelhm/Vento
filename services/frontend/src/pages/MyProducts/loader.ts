import httpClient from '../../utils/httpClient';
import type { Product } from '../../types/searchTypes';
import { enrichProductsWithCity } from '../../utils/productLocation';
import { notify } from '../../utils/notifications';

export const myProductsLoader = async () => {
  try {
    const response = await httpClient.get('/catalog/listings/mine');
    const products = (response.data.data ?? []) as Product[];
    const activeProducts = products.filter((product) => product.state !== 'sold');
    return await enrichProductsWithCity(activeProducts);
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      (error as { response: { status: number } }).response?.status === 401
    ) {
      // Return empty array and let ProtectedLayout handle the redirect to /login
      // This ensures usePendingAction is used correctly in the UI layer
      return [];
    }
    notify('error', 'Error de conexión', 'No hemos podido cargar tus productos.');
    return [];
  }
};
