import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { SliderPrev } from './assets/SliderPrev';
import { SliderNext } from './assets/SliderNext';
import { FavoriteIcon } from './assets/FavoriteIcon';
import { getProductImages } from './utils';
import { type ProductCardProps } from './types';
import { formatCurrency } from '../../utils/formatCurrency';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useAuth } from '../../contexts/AuthContext';
import { getWishlistCount, seedWishlistCount } from '../../utils/wishlistCount';
import { notify } from '../../utils/notifications';

export const ProductCard = ({ 
  product, 
  isFavorite: isFavoriteProp, 
  onToggleFavorite: onToggleFavoriteProp,
  isPrivateView = false
}: ProductCardProps) => {
  const { title, price, description, photos, city, userId } = product;
  const images = getProductImages(photos);
  const { user } = useAuth();
  const isOwner = !!user && user.id === userId;
  const shouldShowFavoriteControl = !isPrivateView && !isOwner;

  const { isFavorite: isFavoriteContext, toggleFavorite } = useFavorites();
  const isFavorite = isFavoriteProp ?? isFavoriteContext(product.id);
  const [favoritesCount, setFavoritesCount] = useState<number>(product.favoritesCount ?? 0);

  const fetchFavCount = useCallback(async () => {
    if (!shouldShowFavoriteControl) {
      return;
    }
    try {
      const count = await getWishlistCount(product.id);
      setFavoritesCount(count);
    } catch {
      // Silent fail
    }
  }, [product.id, shouldShowFavoriteControl]);

  useEffect(() => {
    if (!shouldShowFavoriteControl) {
      return;
    }

    if (typeof product.favoritesCount === 'number') {
      setFavoritesCount(product.favoritesCount);
      seedWishlistCount(product.id, product.favoritesCount);
      return;
    }

    fetchFavCount();
  }, [fetchFavCount, product.id, product.favoritesCount, shouldShowFavoriteControl]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onToggleFavoriteProp) {
      onToggleFavoriteProp(product.id);
    } else {
      try {
        const nextCount = Math.max(0, favoritesCount + (isFavorite ? -1 : 1));
        setFavoritesCount(nextCount);
        seedWishlistCount(product.id, nextCount);

        await toggleFavorite(product);
      } catch {
        setFavoritesCount(favoritesCount);
        seedWishlistCount(product.id, favoritesCount);
        notify('error', 'Favoritos', 'No se pudo actualizar tu lista de favoritos.');
      }
    }
  };

  const [activeThumb, setActiveThumb] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const statusBadge =
    product.state === 'reserved'
      ? { label: 'Reservado', className: 'bg-amber-500/90 text-white' }
      : product.state === 'sold'
        ? { label: 'Vendido', className: 'bg-emerald-600/90 text-white' }
        : null;

  const handleScroll = () => {
    if (scrollRef.current) {
      const width = scrollRef.current.offsetWidth;
      const index = Math.round(scrollRef.current.scrollLeft / width);
      setActiveThumb(index);
    }
  };

  const scrollToIndex = (direction: 'next' | 'prev') => {
    if (scrollRef.current) {
      const width = scrollRef.current.offsetWidth;
      const scrollAmount = direction === 'next' ? width : -width;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="group w-full h-full flex flex-col bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Contenedor de Imagen con Aspect Ratio Forzado (4:3) */}
      <div className="relative w-full pt-[75%] bg-gray-100 overflow-hidden">
        <div className="absolute inset-0">
          <Link to={`/product/${product.id}`} className="block h-full">
            <div 
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {images.map((img, index) => (
                <div key={index} className="min-w-full h-full snap-center">
                  <img src={img} alt={title} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 px-1.5 py-1 bg-black/10 backdrop-blur-sm rounded-full z-10">
              {images.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 w-1 rounded-full transition-all ${
                    activeThumb === i ? "bg-white w-2.5" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </Link>

          {/* Controles de Slider */}
          <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {activeThumb > 0 && (
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollToIndex('prev'); }}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white text-gray-800 z-20 cursor-pointer"
              >
                <SliderPrev className="w-2 h-2" />
              </button>
            )}

            {activeThumb < images.length - 1 && (
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollToIndex('next'); }}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white text-gray-800 z-20 cursor-pointer"
              >
                <SliderNext className="w-2 h-2" />
              </button>
            )}
          </div>

          {/* Badges y Favoritos */}
          {!isPrivateView && (
            isOwner ? (
              <div className="absolute top-1.5 right-1.5 px-2 py-1 bg-primary-dark/90 backdrop-blur-sm rounded-md shadow-sm z-10">
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Tu anuncio</span>
              </div>
            ) : (
              <button 
                onClick={handleToggleFavorite}
                className={`absolute top-1.5 right-1.5 flex items-center gap-1.5 p-1.5 bg-white/70 backdrop-blur-md rounded-full shadow-sm hover:scale-105 transition-all z-10 cursor-pointer ${favoritesCount > 0 ? 'px-2.5' : ''}`}
              >
                <FavoriteIcon className="w-4 h-4" isFavorite={isFavorite} />
                {favoritesCount > 0 && (
                  <span className="text-[12px] font-bold text-gray-700 leading-none">{favoritesCount}</span>
                )}
              </button>
            )
          )}

          {statusBadge && (
            <div className={`absolute top-1.5 left-1.5 px-2 py-1 backdrop-blur-sm rounded-md shadow-sm z-10 ${statusBadge.className}`}>
              <span className="text-[10px] font-bold uppercase tracking-wider">{statusBadge.label}</span>
            </div>
          )}
        </div>
      </div>

      {/* Contenido de Texto */}
      <Link to={`/product/${product.id}`} className="flex flex-col flex-1 p-2.5">
        <div className="text-base font-bold text-gray-900 leading-tight">
          {formatCurrency(price)}
        </div>
        <h2 className="text-[14px] font-semibold text-gray-900 truncate mt-1">
          {title}
        </h2>
        <p className="mt-1 min-h-[34px] line-clamp-2 text-[12px] leading-[17px] font-normal text-gray-500">
          {description}
        </p>
        
        <div className="mt-auto pt-2 flex items-center gap-2">
          <div className="flex shrink-0 items-center gap-1 whitespace-nowrap">
            <span aria-hidden className="text-[11px] font-bold text-gray-600">★</span>
            <span className="text-[11px] font-bold text-gray-600">{product.reviewAvg}</span>
          </div>
          <span className="min-w-0 flex-1 truncate text-right text-[10px] text-gray-400 font-medium">
            {city ?? 'Ubicación no disponible'}
          </span>
        </div>
      </Link>
    </div>
  );
};
