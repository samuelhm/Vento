import type { Product } from '../../types/searchTypes';

const apiBaseUrl = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '');

export const getProductImages = (photos: Product['photos']): string[] => {
  if (!photos || photos.length === 0) {
    return ["/placeholder-product.webp"];
  }
  return photos.map(photo => `${apiBaseUrl}/media/${photo.path}`);
};
