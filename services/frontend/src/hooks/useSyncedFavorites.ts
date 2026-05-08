import { useMemo } from 'react';
import { useFavorites } from '../contexts/FavoritesContext';
import type { Product } from '../types/searchTypes';

export const useSyncedFavorites = (initialProducts: Product[]) => {
  const { favoriteIds, isWishlistHydrated, isWishlistLoading } = useFavorites();

  return useMemo(() => {
    if (!isWishlistHydrated || isWishlistLoading) {
      return initialProducts;
    }

    return initialProducts.filter((product) => favoriteIds.has(product.id));
  }, [initialProducts, favoriteIds, isWishlistHydrated, isWishlistLoading]);
};
