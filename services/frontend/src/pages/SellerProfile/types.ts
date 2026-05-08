import type { Product } from '../../types/searchTypes';
import type { ReviewWithBuyer, ReviewStats } from '../../types/reviewTypes';

export interface SellerInfo {
  id: string;
  name: string;
  location: string;
  memberSince: string;
}

export interface SellerProfileLoaderData {
  seller: SellerInfo;
  products: Product[];
  reviews: ReviewWithBuyer[];
  stats: ReviewStats;
}
