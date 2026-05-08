export type Product = {
  id: string;
  userId: string;
  title: string;
  description: string;
  price: string;
  state: 'pending' | 'reserved' | 'sold' | 'cancelled' | 'active' | 'inactive';
  createdAt: string;
  latitude: number;
  longitude: number;
  city?: string;
  categoryId?: number;
  categoryName?: string;
  wishlist: boolean;
  reviewAvg: number;
  favoritesCount?: number;
  canReview?: boolean;
  alreadyReviewed?: boolean;
  photos: ProductPhoto[] | null;
};

export type ProductPhoto = {
  photoId?: number;
  path: string;
  position: number;
};

export type CategoryTree = {
  id: number;
  name: string;
  count: number;
  path: string;
  subcategories: CategoryTree[];
};
