import httpClient from '../../utils/httpClient';
import { enrichReviews } from '../../utils/reviewUtils';
import type { ReviewStats, ReviewWithBuyer, RawReview } from '../../types/reviewTypes';
import { canRequestAuthMe, setAuthHint } from '../../utils/authHint';
import { notify } from '../../utils/notifications';

export interface MyReviewsLoaderData {
  reviews: ReviewWithBuyer[];
  stats: ReviewStats;
}

const EMPTY_MY_REVIEWS_DATA: MyReviewsLoaderData = {
  reviews: [],
  stats: {
    userId: '',
    totalReviews: 0,
    reviewAvg: 0,
  },
};

export const myReviewsLoader = async (): Promise<MyReviewsLoaderData> => {
  try {
    if (!canRequestAuthMe()) {
      return EMPTY_MY_REVIEWS_DATA;
    }

    const authMeResponse = await httpClient.get('/auth/me');
    const currentUser = authMeResponse.data.data;

    if (!currentUser) {
      return EMPTY_MY_REVIEWS_DATA;
    }

    const userId = currentUser.id;

    const [reviewsResponse, statsResponse] = await Promise.all([
      httpClient.get(`/catalog/reviews/${userId}`).catch(() => ({ data: { data: [] as RawReview[] } })),
      httpClient.get(`/catalog/reviews/user/${userId}/stats`).catch(() => ({ data: { data: { totalReviews: 0, reviewAvg: 0 } } }))
    ]);

    const rawReviews = (reviewsResponse.data.data ?? []) as RawReview[];
    const rawStats = statsResponse.data.data ?? { totalReviews: 0, reviewAvg: 0 };

    const enrichedReviews = await enrichReviews(rawReviews);

    return {
      reviews: enrichedReviews,
      stats: {
        userId,
        totalReviews: parseInt(String(rawStats.totalReviews ?? 0), 10),
        reviewAvg: parseFloat(String(rawStats.reviewAvg ?? 0))
      }
    };

  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      (error as { response: { status: number } }).response?.status === 401
    ) {
      setAuthHint(false);
      return EMPTY_MY_REVIEWS_DATA;
    }

    notify('error', 'Error de conexión', 'No hemos podido cargar tus valoraciones.');
    return EMPTY_MY_REVIEWS_DATA;
  }
};
