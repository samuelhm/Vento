import type { Product } from '../../types/searchTypes';

export interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
  isPrivateView?: boolean;
}
