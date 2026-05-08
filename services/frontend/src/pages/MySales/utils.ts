import type { Product } from '../../types/searchTypes';

export type SalesListingRow = Partial<Product> & {
  listingId?: string;
  sellerId?: string;
  listinPrice?: number;
  transactionPrice?: number;
  listingDate?: string;
  transactionDate?: string;
};

const toProductState = (value: unknown): Product['state'] => {
  const state = String(value ?? '').toLowerCase();
  if (state === 'pending' || state === 'reserved' || state === 'sold' || state === 'cancelled' || state === 'active' || state === 'inactive') {
    return state;
  }
  return 'sold';
};

const toNumeric = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const isResponseStatus = (error: unknown, status: number): boolean => {
  return Boolean(
    error
    && typeof error === 'object'
    && 'response' in error
    && (error as { response?: { status?: number } }).response?.status === status,
  );
};

export const normalizeSalesRows = (rows: SalesListingRow[], ownerId: string): Product[] => {
  return rows.reduce<Product[]>((acc, row) => {
    const id = String(row.id ?? row.listingId ?? '');
    if (!id) {
      return acc;
    }

    acc.push({
      id,
      userId: String(row.userId ?? row.sellerId ?? ownerId),
      title: String(row.title ?? 'Producto vendido'),
      description: String(row.description ?? ''),
      price: String(row.listinPrice ?? row.price ?? row.transactionPrice ?? 0),
      state: toProductState(row.state),
      createdAt: String(row.transactionDate ?? row.listingDate ?? row.createdAt ?? new Date().toISOString()),
      latitude: toNumeric(row.latitude, Number.NaN),
      longitude: toNumeric(row.longitude, Number.NaN),
      city: row.city,
      categoryId: row.categoryId,
      categoryName: row.categoryName,
      wishlist: Boolean(row.wishlist),
      reviewAvg: toNumeric(row.reviewAvg),
      favoritesCount: row.favoritesCount,
      photos: Array.isArray(row.photos) ? row.photos : null,
    });

    return acc;
  }, []);
};
