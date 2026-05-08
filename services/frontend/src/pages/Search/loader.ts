import type { LoaderFunctionArgs } from 'react-router';
import httpClient from '../../utils/httpClient';
import { enrichProductsWithCity } from '../../utils/productLocation';
import type { Product } from '../../types/searchTypes';
import type { SearchLoaderData, SearchParams } from './types';
import { notify } from '../../utils/notifications';

export const searchLoader = async ({ request }: LoaderFunctionArgs): Promise<SearchLoaderData> => {
  const url = new URL(request.url);
  const searchParams: SearchParams = {
    categoryId: url.searchParams.get('categoryId') || undefined,
    minPrice: url.searchParams.get('minPrice') || undefined,
    maxPrice: url.searchParams.get('maxPrice') || undefined,
    timeFilter: (url.searchParams.get('timeFilter') as SearchParams['timeFilter']) || undefined,
    keywords: url.searchParams.get('keywords') || undefined,
    radius: url.searchParams.get('radius') || undefined,
    lat: url.searchParams.get('lat') || undefined,
    lng: url.searchParams.get('lng') || undefined,
    originType: (url.searchParams.get('originType') as SearchParams['originType']) || undefined,
    capitalId: url.searchParams.get('capitalId') || undefined,
    orderBy: (url.searchParams.get('orderBy') as SearchParams['orderBy']) || 'newest',
    page: url.searchParams.get('page') || '0',
  };

  try {
    const queryString = new URLSearchParams();

    if (searchParams.categoryId) queryString.append('categoryId', searchParams.categoryId);
    if (searchParams.minPrice) queryString.append('minPrice', searchParams.minPrice);
    if (searchParams.maxPrice) queryString.append('maxPrice', searchParams.maxPrice);
    if (searchParams.timeFilter) queryString.append('timeFilter', searchParams.timeFilter);
    if (searchParams.keywords) queryString.append('keywords', searchParams.keywords);
    if (searchParams.radius) queryString.append('radius', searchParams.radius);
    if (searchParams.lat) queryString.append('lat', searchParams.lat);
    if (searchParams.lng) queryString.append('lng', searchParams.lng);
    if (searchParams.originType) queryString.append('originType', searchParams.originType);
    if (searchParams.capitalId) queryString.append('capitalId', searchParams.capitalId);
    if (searchParams.orderBy) queryString.append('orderBy', searchParams.orderBy);
    queryString.append('page', searchParams.page || '0');

    const response = await httpClient.get(`/catalog/listings/search?${queryString.toString()}`);

    const rawProducts: Product[] = response.data.data?.listings ?? [];
    const products = await enrichProductsWithCity(rawProducts);
    const totalItems = parseInt(response.data.data?.total_items?.[0]?.count ?? '0', 10);
    const currentPage = parseInt(searchParams.page || '0', 10);

    return {
      products,
      totalItems,
      currentPage,
      filters: searchParams,
    };
  } catch {
    notify('error', 'Error de búsqueda', 'No se han podido cargar los productos.');
    return {
      products: [],
      totalItems: 0,
      currentPage: 0,
      filters: searchParams,
    };
  }
};
