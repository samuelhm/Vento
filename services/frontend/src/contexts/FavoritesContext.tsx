import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import httpClient from '../utils/httpClient';
import { useAuth } from './AuthContext';
import { usePendingAction } from '../hooks/usePendingAction';
import type { Product } from '../types/searchTypes';
import { notify } from '../utils/notifications';

interface FavoritesContextType {
  favoriteIds: Set<string>;
  isWishlistLoading: boolean;
  isWishlistHydrated: boolean;
  toggleFavorite: (product: Product) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  syncWishlistFromProducts: (products: Product[]) => void;
  refreshWishlist: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isWishlistHydrated, setIsWishlistHydrated] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { setPendingAction, getPendingAction, clearPendingAction } = usePendingAction();
  const navigate = useNavigate();
  const location = useLocation();
  const togglingIdsRef = useRef<Set<string>>(new Set());

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setFavoriteIds(new Set());
      setIsWishlistHydrated(true);
      return;
    }

    setIsWishlistHydrated(false);
    setIsWishlistLoading(true);
    try {
      const response = await httpClient.get('/catalog/wishlist');
      const wishlist: Product[] = response.data.data ?? [];
      const ids = new Set(wishlist.map((p) => p.id));
      setFavoriteIds(ids);
    } catch {
      setFavoriteIds(new Set());
    } finally {
      setIsWishlistLoading(false);
      setIsWishlistHydrated(true);
    }
  }, [isAuthenticated]);

  const syncWishlistFromProducts = useCallback((products: Product[]) => {
    const ids = new Set(products.map((product) => product.id));
    setFavoriteIds(ids);
    setIsWishlistLoading(false);
    setIsWishlistHydrated(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated && location.pathname === '/favorites') {
      return;
    }
    fetchWishlist();
  }, [fetchWishlist, isAuthenticated, location.pathname]);

  useEffect(() => {
    const handlePendingAction = async () => {
      if (isAuthenticated && user && isWishlistHydrated) {
        const pendingAction = getPendingAction();

        if (pendingAction?.type === 'TOGGLE_FAVORITE' && pendingAction.payload) {
          const productId = pendingAction.payload;
          const ownerId = pendingAction.ownerId;

          if (ownerId && String(user.id) === String(ownerId)) {
            clearPendingAction();
            return;
          }

          if (favoriteIds.has(productId)) {
            clearPendingAction();
            return;
          }

          try {
            await httpClient.post('/catalog/wishlist', { listingId: productId });
            await fetchWishlist();
          } catch {
            // Silent
          }
          clearPendingAction();
        }
      }
    };

    handlePendingAction();
  }, [isAuthenticated, user, isWishlistHydrated, getPendingAction, clearPendingAction, favoriteIds, fetchWishlist]);

  const toggleFavorite = useCallback(async (product: Product) => {
    const productId = product.id;
    const ownerId = product.userId;

    if (isAuthenticated && user && ownerId && String(user.id) === String(ownerId)) {
      return;
    }

    if (!isAuthenticated) {
      setPendingAction({
        type: 'TOGGLE_FAVORITE',
        payload: productId,
        ownerId: ownerId,
        redirectTo: location.pathname + location.search,
      });
      navigate('/login');
      return;
    }

    if (togglingIdsRef.current.has(productId)) {
      return;
    }

    const isFav = favoriteIds.has(productId);

    if (!isFav && product.state === 'sold') {
      notify('info', 'Producto vendido', 'Este producto ya no está disponible y no se puede añadir a favoritos.');
      return;
    }

    togglingIdsRef.current.add(productId);

    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (isFav) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });

    try {
      if (isFav) {
        await httpClient.delete(`/catalog/wishlist/${productId}`);
      } else {
        await httpClient.post('/catalog/wishlist', { listingId: productId });
      }
    } catch {
      notify('error', 'Favoritos', 'No se pudo actualizar tu lista de favoritos.');
      // Revert on error
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (isFav) {
          next.add(productId);
        } else {
          next.delete(productId);
        }
        return next;
      });
    } finally {
      togglingIdsRef.current.delete(productId);
    }
  }, [isAuthenticated, user, setPendingAction, location.pathname, location.search, navigate, favoriteIds]);

  const isFavorite = useCallback((productId: string) => favoriteIds.has(productId), [favoriteIds]);
  const value = useMemo(
    () => ({
      favoriteIds,
      isWishlistLoading,
      isWishlistHydrated,
      toggleFavorite,
      isFavorite,
      syncWishlistFromProducts,
      refreshWishlist: fetchWishlist,
    }),
    [favoriteIds, isWishlistLoading, isWishlistHydrated, toggleFavorite, isFavorite, syncWishlistFromProducts, fetchWishlist]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
