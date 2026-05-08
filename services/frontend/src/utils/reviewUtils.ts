import httpClient from './httpClient';
import type { ReviewWithBuyer, RawReview } from '../types/reviewTypes';

export const getReviewBuyerId = (review: RawReview): string =>
  String(review.buyerId ?? review.buyerid ?? review.buyer_id ?? '');

export const getReviewListingId = (review: RawReview): string =>
  String(review.listingId ?? review.listingid ?? '');

export const isReceivedReview = (review: RawReview): boolean => {
  const stars = Number(review.stars ?? 0);
  return stars >= 1 && Boolean(getReviewListingId(review));
};

type BuyerProfile = {
  id: string;
  name?: string;
  lastNames?: string;
  avatarUrl?: string | null;
  createdAt?: string;
};

const normalizeReview = (
  review: RawReview,
  options?: {
    buyer?: BuyerProfile;
    includeFallbackBuyerMetadata?: boolean;
  }
): ReviewWithBuyer => {
  const buyerId = getReviewBuyerId(review);
  const listingId = getReviewListingId(review);
  const createdAt = (review.createdAt || review.created_at || new Date().toISOString()) as string;
  const buyer = options?.buyer;

  const normalizedReview: ReviewWithBuyer = {
    id: review.id || `${listingId}-${buyerId}`,
    listingId,
    buyerId,
    stars: Number(review.stars || 0),
    review: review.review || '',
    createdAt,
    title: review.title || 'Producto de Vento',
    path: review.path || '',
    categoryName: review.categoryName || 'Varios',
    buyerName: buyer ? `${buyer.name} ${buyer.lastNames || ''}`.trim() : 'Usuario de Vento',
  };

  if (buyer) {
    if (buyer.avatarUrl) {
      normalizedReview.buyerAvatar = buyer.avatarUrl;
    }
    normalizedReview.buyerSince = (buyer.createdAt || review.createdAt || review.created_at || '') as string;
    return normalizedReview;
  }

  if (options?.includeFallbackBuyerMetadata) {
    normalizedReview.buyerSince = (review.createdAt || review.created_at || '') as string;
  }

  return normalizedReview;
};

export const enrichReviews = async (rawReviews: RawReview[]): Promise<ReviewWithBuyer[]> => {
  if (!rawReviews || rawReviews.length === 0) {
    return [];
  }

  try {
    const buyerIds = [...new Set(rawReviews.map(getReviewBuyerId))].filter(Boolean);

    const buyerProfiles = await Promise.all(
      buyerIds.map(async (id): Promise<BuyerProfile | null> => {
        try {
          const res = await httpClient.get(`/auth/user/${id}`);
          const profile = res.data as BuyerProfile | null;
          if (!profile || !profile.id) {
            return null;
          }
          return {
            ...profile,
            id: String(profile.id),
          };
        } catch {
          return null;
        }
      })
    );

    const buyerMap = new Map<string, BuyerProfile>();
    buyerProfiles.forEach((profile) => {
      if (profile?.id) {
        buyerMap.set(profile.id, profile);
      }
    });

    return rawReviews.map((review) =>
      normalizeReview(review, {
        buyer: buyerMap.get(getReviewBuyerId(review)),
        includeFallbackBuyerMetadata: true,
      })
    );
  } catch {
    return rawReviews.map((review) => normalizeReview(review));
  }
};
