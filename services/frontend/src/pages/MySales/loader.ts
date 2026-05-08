import httpClient from '../../utils/httpClient';
import type { Product } from '../../types/searchTypes';
import { enrichProductsForCard } from '../../utils/productCardEnrichment';
import { canRequestAuthMe } from '../../utils/authHint';
import { isResponseStatus, normalizeSalesRows, type SalesListingRow } from './utils';
import { notify } from '../../utils/notifications';

const getOwnerId = async (): Promise<string> => {
  if (!canRequestAuthMe()) {
    return '';
  }

  const meResponse = await httpClient
    .get('/auth/me')
    .catch(() => ({ data: { data: null } }));

  return String(meResponse.data?.data?.id ?? '');
};

const loadSoldRows = async (): Promise<SalesListingRow[]> => {
  const soldResponse = await httpClient.get('/catalog/listings/mine/sold');
  return (soldResponse.data?.data ?? []) as SalesListingRow[];
};

const loadSoldProductsFallback = async (): Promise<Product[]> => {
  const mineResponse = await httpClient.get('/catalog/listings/mine');
  const allProducts = (mineResponse.data?.data ?? []) as Product[];
  return allProducts.filter((product) => product.state === 'sold');
};

const loadSoldProducts = async (ownerId: string): Promise<Product[]> => {
  try {
    const soldRows = await loadSoldRows();
    const soldProducts = normalizeSalesRows(soldRows, ownerId);
    if (soldProducts.length > 0) {
      return soldProducts;
    }
  } catch (error: unknown) {
    if (isResponseStatus(error, 401)) {
      throw error;
    }
  }

  return loadSoldProductsFallback();
};

export const mySalesLoader = async () => {
  try {
    const ownerId = await getOwnerId();
    const soldProducts = await loadSoldProducts(ownerId);
    return await enrichProductsForCard(soldProducts);
  } catch (error: unknown) {
    if (isResponseStatus(error, 401)) {
      return [];
    }
    notify('error', 'Error de conexión', 'No hemos podido cargar tus ventas.');
    return [];
  }
};
