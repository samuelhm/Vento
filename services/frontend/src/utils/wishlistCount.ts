import httpClient from './httpClient';

const wishlistCountCache = new Map<string, number>();
const wishlistCountRequests = new Map<string, Promise<number>>();

const parseWishlistCount = (value: unknown): number => {
  const parsed = Number.parseInt(String(value ?? 0), 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const seedWishlistCount = (productId: string, count: number) => {
  if (!productId) {
    return;
  }
  wishlistCountCache.set(productId, Math.max(0, parseWishlistCount(count)));
};

export const getWishlistCount = async (productId: string): Promise<number> => {
  const cachedCount = wishlistCountCache.get(productId);
  if (typeof cachedCount === 'number') {
    return cachedCount;
  }

  const inFlightRequest = wishlistCountRequests.get(productId);
  if (inFlightRequest) {
    return inFlightRequest;
  }

  const request = (async () => {
    const response = await httpClient.get(`/catalog/wishlist/count/${productId}`);
    const count = parseWishlistCount(response.data.data?.TotalWishlistCount);
    wishlistCountCache.set(productId, count);
    return count;
  })().finally(() => {
    wishlistCountRequests.delete(productId);
  });

  wishlistCountRequests.set(productId, request);
  return request;
};
