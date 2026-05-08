export interface RawReview {
  id?: string;
  listingId?: string;
  listingid?: string;
  buyerId?: string;
  buyerid?: string;
  buyer_id?: string;
  stars: number | string;
  review?: string;
  createdAt?: string;
  created_at?: string;
  title?: string;
  path?: string;
  categoryName?: string;
}

export interface Review {
  listingId: string;
  title: string;
  buyerId: string;
  stars: number;
  review: string;
  createdAt: string;
  path: string;
}

export interface ReviewWithBuyer extends Review {
  id?: string;
  buyerName: string;
  buyerAvatar?: string;
  buyerSince?: string;
  categoryName?: string;
}

export interface ReviewStats {
  userId: string;
  totalReviews: number;
  reviewAvg: number;
}
