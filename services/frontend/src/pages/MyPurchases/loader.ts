import httpClient from '../../utils/httpClient';
import { getReviewBuyerId, getReviewListingId, isReceivedReview } from '../../utils/reviewUtils';
import type { Product } from '../../types/searchTypes';
import { enrichProductsForCard } from '../../utils/productCardEnrichment';
import type { RawReview } from '../../types/reviewTypes';
import type { RawProduct } from '../Product/types';
import { canRequestAuthMe } from '../../utils/authHint';
import { notify } from '../../utils/notifications';

type PurchaseListingRow = Partial<Product> & {
  listingId?: string;
  buyerId?: string;
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

const getRawProductUserId = (product: RawProduct | undefined): string =>
  String(product?.userId ?? product?.user_id ?? '');

const normalizePurchaseRows = (
  rows: PurchaseListingRow[],
  listingDetailsById: Map<string, RawProduct>
): Product[] => {
  return rows.reduce<Product[]>((acc, row) => {
      const id = String(row.id ?? row.listingId ?? '');
      if (!id) {
        return acc;
      }

      const detail = listingDetailsById.get(id);

      acc.push({
        id,
        userId: getRawProductUserId(detail),
        title: String(row.title ?? detail?.title ?? 'Producto comprado'),
        description: String(row.description ?? detail?.description ?? ''),
        // For purchases, show the listing marked price instead of negotiated transaction price.
        price: String(row.listinPrice ?? detail?.price ?? row.price ?? row.transactionPrice ?? 0),
        state: toProductState(row.state ?? detail?.state),
        createdAt: String(row.transactionDate ?? row.listingDate ?? detail?.createdAt ?? detail?.created_at ?? new Date().toISOString()),
        latitude: toNumeric(row.latitude ?? detail?.latitude),
        longitude: toNumeric(row.longitude ?? detail?.longitude),
        city: row.city,
        categoryId: row.categoryId ?? detail?.categoryId ?? detail?.categorie_id,
        categoryName: row.categoryName ?? detail?.categoryName,
        wishlist: Boolean(row.wishlist),
        reviewAvg: toNumeric(row.reviewAvg ?? detail?.reviewAvg),
        favoritesCount: row.favoritesCount,
        photos: Array.isArray(row.photos)
          ? row.photos
          : Array.isArray(detail?.photos)
            ? detail.photos
            : null,
      });

      return acc;
    }, []);
};

export const myPurchasesLoader = async () => {
  try {
    const purchasesResponse = await httpClient.get('/catalog/listings/mine/bought');
    const currentUserId = canRequestAuthMe()
      ? String((await httpClient.get('/auth/me').catch(() => ({ data: { data: null } }))).data?.data?.id ?? '')
      : '';

    const purchaseRows = (purchasesResponse.data.data ?? []) as PurchaseListingRow[];

    const listingIds = Array.from(
      new Set(purchaseRows.map((product) => String(product.id ?? product.listingId ?? '')).filter(Boolean))
    );

    const listingDetailEntries = await Promise.all(
      listingIds.map(async (listingId) => {
        try {
          const response = await httpClient.get(`/catalog/listings/${listingId}`);
          const detail = (response.data?.data ?? null) as RawProduct | null;
          return [listingId, detail] as const;
        } catch {
          return [listingId, null] as const;
        }
      })
    );

    const listingDetailsById = new Map<string, RawProduct>();
    for (const [listingId, detail] of listingDetailEntries) {
      if (detail) {
        listingDetailsById.set(listingId, detail);
      }
    }

    const normalizedProducts = normalizePurchaseRows(purchaseRows, listingDetailsById);
    const enrichedProducts = await enrichProductsForCard(normalizedProducts, {
      listingDetailsById,
    });

    if (!currentUserId || enrichedProducts.length === 0) {
      return enrichedProducts.map((product) => ({
        ...product,
        alreadyReviewed: false,
        canReview: product.state === 'sold',
      }));
    }

    const sellerIds = Array.from(
      new Set(enrichedProducts.map((product) => product.userId).filter(Boolean))
    );

    const reviewEntries = await Promise.all(
      sellerIds.map(async (sellerId) => {
        try {
          const response = await httpClient.get(`/catalog/reviews/${sellerId}`);
          return [sellerId, (response.data?.data ?? []) as RawReview[]] as const;
        } catch {
          return [sellerId, [] as RawReview[]] as const;
        }
      })
    );

    const reviewsBySeller = new Map<string, RawReview[]>(reviewEntries);

    return enrichedProducts.map((product) => {
      const sellerReviews = (reviewsBySeller.get(product.userId) ?? []).filter(isReceivedReview);
      const alreadyReviewed = sellerReviews.some((review) => {
        const buyerId = getReviewBuyerId(review);
        const listingId = getReviewListingId(review);
        return buyerId === currentUserId && listingId === product.id;
      });

      return {
        ...product,
        alreadyReviewed,
        canReview: product.state === 'sold' && !alreadyReviewed,
      };
    });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      (error as { response: { status: number } }).response?.status === 401
    ) {
      return [];
    }
    notify('error', 'Error de conexión', 'No hemos podido cargar tus compras.');
    return [];
  }
};
