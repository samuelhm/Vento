import { useEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router';
import { ProductCard } from '../../components/ProductCard';
import { useSyncedFavorites } from '../../hooks/useSyncedFavorites';
import type { Product } from '../../types/searchTypes';
import { useFavorites } from '../../contexts/FavoritesContext';

export const Favorites = () => {
  const initialFavorites = useLoaderData() as Product[];
  const navigate = useNavigate();
  const { syncWishlistFromProducts } = useFavorites();
  const displayedFavorites = useSyncedFavorites(initialFavorites);

  useEffect(() => {
    syncWishlistFromProducts(initialFavorites);
  }, [initialFavorites, syncWishlistFromProducts]);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-6 pb-20 lg:px-10 lg:pt-10 lg:pb-16">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Guardado</p>
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Favoritos</h1>
        <p className="text-sm text-slate-500">Tus productos favoritos guardados en un solo lugar</p>
      </div>
      
      {displayedFavorites.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50 p-12 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200/50">
            <span className="text-4xl">❤️</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">No hay favoritos guardados</h3>
          <p className="mt-1 max-w-xs text-sm text-slate-500">
            Explora el catálogo y guarda los productos que más te gusten.
          </p>
          <button 
            onClick={() => navigate('/search')}
            className="cursor-pointer mt-6 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
          >
            Explorar catálogo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedFavorites.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
            />
          ))}
        </div>
      )}
    </div>
  );
};
