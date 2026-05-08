import type { Product } from '../types/searchTypes';
import httpClient from './httpClient';
import { enrichProductsWithCity } from './productLocation';

type ListingDetailLike = {
  id?: string;
  userId?: string;
  user_id?: string;
  title?: string;
  description?: string;
  price?: string | number;
  state?: string;
  createdAt?: string;
  created_at?: string;
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
  city?: string;
  categoryId?: number;
  categorie_id?: number;
  categoryName?: string;
  wishlist?: boolean;
  reviewAvg?: number;
  photos?: Product['photos'];
  location?: {
    city?: string;
    latitude?: number;
    longitude?: number;
    lat?: number;
    lng?: number;
  };
  address?: {
    city?: string;
    municipality?: string;
    town?: string;
  };
};

const toNumeric = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const pickFirstFiniteNumber = (...candidates: unknown[]): number => {
  for (const candidate of candidates) {
    const parsed = Number(candidate);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return 0;
};

const normalizeState = (value: unknown, fallback: Product['state']): Product['state'] => {
  const state = String(value ?? '').toLowerCase();
  if (state === 'pending' || state === 'reserved' || state === 'sold' || state === 'cancelled' || state === 'active' || state === 'inactive') {
    return state;
  }
  return fallback;
};

const getSellerIdFromProduct = (product: Product, detail?: ListingDetailLike): string => {
  return String(
    product.userId
    || detail?.userId
    || detail?.user_id
    || '',
  );
};

const fetchListingDetailsMap = async (listingIds: string[]): Promise<Map<string, ListingDetailLike>> => {
  const uniqueListingIds = Array.from(new Set(listingIds.filter(Boolean)));
  if (uniqueListingIds.length === 0) {
    return new Map<string, ListingDetailLike>();
  }

  const entries = await Promise.all(
    uniqueListingIds.map(async (listingId) => {
      try {
        const response = await httpClient.get(`/catalog/listings/${listingId}`);
        const detail = (response.data?.data ?? null) as ListingDetailLike | null;
        return [listingId, detail] as const;
      } catch {
        return [listingId, null] as const;
      }
    }),
  );

  const detailsMap = new Map<string, ListingDetailLike>();
  entries.forEach(([listingId, detail]) => {
    if (detail) {
      detailsMap.set(listingId, detail);
    }
  });

  return detailsMap;
};

export const fetchSellerReviewAverages = async (sellerIds: string[]): Promise<Map<string, number>> => {
  const uniqueSellerIds = Array.from(new Set(sellerIds.filter(Boolean)));
  if (uniqueSellerIds.length === 0) {
    return new Map<string, number>();
  }

  const entries = await Promise.all(
    uniqueSellerIds.map(async (sellerId) => {
      try {
        const response = await httpClient.get(`/catalog/reviews/user/${sellerId}/stats`);
        const stats = response.data?.data ?? {};
        return [sellerId, toNumeric(stats.reviewAvg)] as const;
      } catch {
        return [sellerId, null] as const;
      }
    }),
  );

  const reviewAvgBySellerId = new Map<string, number>();
  entries.forEach(([sellerId, reviewAvg]) => {
    if (typeof reviewAvg === 'number' && Number.isFinite(reviewAvg)) {
      reviewAvgBySellerId.set(sellerId, reviewAvg);
    }
  });
  return reviewAvgBySellerId;
};

interface EnrichProductsForCardOptions {
  listingDetailsById?: Map<string, ListingDetailLike>;
}

export const enrichProductsForCard = async (
  products: Product[],
  options?: EnrichProductsForCardOptions,
): Promise<Product[]> => {
  if (products.length === 0) {
    return products;
  }

  const listingDetailsById = options?.listingDetailsById
    ?? await fetchListingDetailsMap(products.map((product) => product.id));

  const mergedProducts = products.map((product) => {
    const detail = listingDetailsById.get(product.id);

    const latitude = pickFirstFiniteNumber(
      detail?.latitude,
      detail?.lat,
      detail?.location?.latitude,
      detail?.location?.lat,
      product.latitude,
    );
    const longitude = pickFirstFiniteNumber(
      detail?.longitude,
      detail?.lng,
      detail?.location?.longitude,
      detail?.location?.lng,
      product.longitude,
    );

    return {
      ...product,
      userId: getSellerIdFromProduct(product, detail),
      title: String(product.title ?? detail?.title ?? 'Producto de Vento'),
      description: String(product.description ?? detail?.description ?? ''),
      price: String(product.price ?? detail?.price ?? 0),
      state: normalizeState(detail?.state ?? product.state, product.state),
      createdAt: String(product.createdAt ?? detail?.createdAt ?? detail?.created_at ?? new Date().toISOString()),
      latitude,
      longitude,
      city: product.city
        ?? detail?.city
        ?? detail?.location?.city
        ?? detail?.address?.city
        ?? detail?.address?.municipality
        ?? detail?.address?.town,
      categoryId: product.categoryId ?? detail?.categoryId ?? detail?.categorie_id,
      categoryName: product.categoryName ?? detail?.categoryName,
      wishlist: Boolean(product.wishlist ?? detail?.wishlist),
      reviewAvg: toNumeric(product.reviewAvg ?? detail?.reviewAvg),
      photos: Array.isArray(product.photos)
        ? product.photos
        : Array.isArray(detail?.photos)
          ? detail.photos
          : null,
    };
  });

  const reviewAvgBySellerId = await fetchSellerReviewAverages(
    mergedProducts.map((product) => product.userId),
  );

  const productsWithReviewAvg = mergedProducts.map((product) => ({
    ...product,
    reviewAvg: reviewAvgBySellerId.get(product.userId) ?? product.reviewAvg,
  }));

  return enrichProductsWithCity(productsWithReviewAvg);
};
