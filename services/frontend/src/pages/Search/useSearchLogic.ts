import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import httpClient from '../../utils/httpClient';
import { useAuth } from '../../contexts/AuthContext';
import { enrichProductsWithCity } from '../../utils/productLocation';
import type { Product } from '../../types/searchTypes';
import { notify } from '../../utils/notifications';
import {
  DEFAULT_RADIUS_KM,
  MADRID_CAPITAL_ID,
  MADRID_CENTER,
  MAX_RADIUS_KM,
  MIN_RADIUS_KM,
  SPANISH_CAPITAL_BY_ID,
} from './constants';
import type { LocalFilters, SearchLoaderData, SearchParams, UseSearchLogicResult } from './types';

const toSafeCapitalId = (capitalId?: string) => {
  if (!capitalId) return MADRID_CAPITAL_ID;
  return SPANISH_CAPITAL_BY_ID[capitalId] ? capitalId : MADRID_CAPITAL_ID;
};

const getRadiusStep = (radius: number) => {
  if (radius <= 20) return 1;
  if (radius <= 100) return 5;
  if (radius <= 300) return 10;
  return 25;
};

const snapRadius = (value: number) => {
  const clamped = Math.min(MAX_RADIUS_KM, Math.max(MIN_RADIUS_KM, value));
  const step = getRadiusStep(clamped);
  return Math.min(MAX_RADIUS_KM, Math.max(MIN_RADIUS_KM, Math.round(clamped / step) * step));
};

const normalizeRadius = (value?: string) => {
  if (!value) return DEFAULT_RADIUS_KM;

  const numericRadius = Number.parseInt(value, 10);
  if (!Number.isFinite(numericRadius)) {
    return DEFAULT_RADIUS_KM;
  }

  return snapRadius(numericRadius).toString();
};

const hasUserCoordinates = (lat?: number | null, lng?: number | null) =>
  typeof lat === 'number' && typeof lng === 'number';

const buildInitialFilters = (filters: SearchParams, userHasCoordinates: boolean): LocalFilters => {
  const capitalId = toSafeCapitalId(filters.capitalId);
  const initialOriginType = userHasCoordinates
    ? (filters.originType === 'capital' ? 'capital' : 'my_location')
    : 'capital';

  return {
    categoryId: filters.categoryId || '',
    minPrice: filters.minPrice || '',
    maxPrice: filters.maxPrice || '',
    timeFilter: filters.timeFilter || '',
    keywords: filters.keywords || '',
    radius: normalizeRadius(filters.radius),
    lat: filters.lat || '',
    lng: filters.lng || '',
    originType: initialOriginType,
    capitalId,
    orderBy: filters.orderBy || 'newest',
  };
};

const validatePriceFilters = (filters: { minPrice: string; maxPrice: string }) => {
  if (!filters.maxPrice) {
    return '';
  }

  const maxPrice = Number(filters.maxPrice);
  if (Number.isNaN(maxPrice) || maxPrice <= 0) {
    return 'El precio maximo debe ser un numero positivo.';
  }

  if (filters.minPrice) {
    const minPrice = Number(filters.minPrice);
    if (!Number.isNaN(minPrice) && maxPrice <= minPrice) {
      return 'El precio maximo debe ser mayor al precio minimo.';
    }
  }

  return '';
};

const dedupeProductsById = (products: Product[]) => {
  const seen = new Set<string>();
  return products.filter((product) => {
    if (seen.has(product.id)) {
      return false;
    }
    seen.add(product.id);
    return true;
  });
};

export const useSearchLogic = (initialData: SearchLoaderData): UseSearchLogicResult => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userHasCoordinates = hasUserCoordinates(user?.coordinates?.lat, user?.coordinates?.lng);

  const [allProducts, setAllProducts] = useState<Product[]>(() => dedupeProductsById(initialData.products));
  const [currentPage, setCurrentPage] = useState(initialData.currentPage);
  const [totalItems, setTotalItems] = useState(initialData.totalItems);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialData.products.length < initialData.totalItems);
  const observerTarget = useRef<HTMLDivElement>(null);
  const currentPageRef = useRef(initialData.currentPage);
  const isFetchingRef = useRef(false);

  const [localFilters, setLocalFilters] = useState<LocalFilters>(() =>
    buildInitialFilters(initialData.filters, userHasCoordinates)
  );
  const [priceError, setPriceError] = useState('');

  useEffect(() => {
    setAllProducts(dedupeProductsById(initialData.products));
    setCurrentPage(initialData.currentPage);
    setTotalItems(initialData.totalItems);
    setHasMore(dedupeProductsById(initialData.products).length < initialData.totalItems);
    currentPageRef.current = initialData.currentPage;
    isFetchingRef.current = false;
    setLocalFilters(buildInitialFilters(initialData.filters, userHasCoordinates));
    setPriceError(validatePriceFilters({
      minPrice: initialData.filters.minPrice || '',
      maxPrice: initialData.filters.maxPrice || '',
    }));
  }, [initialData, userHasCoordinates]);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  const normalizeFilters = useCallback((filters: LocalFilters) => {
    const normalizedFilters = { ...filters };
    const userLat = user?.coordinates?.lat;
    const userLng = user?.coordinates?.lng;

    normalizedFilters.radius = normalizeRadius(normalizedFilters.radius);

    if (
      normalizedFilters.originType === 'my_location'
      && typeof userLat === 'number'
      && typeof userLng === 'number'
    ) {
      normalizedFilters.lat = userLat.toString();
      normalizedFilters.lng = userLng.toString();
      normalizedFilters.capitalId = '';
    } else {
      normalizedFilters.originType = 'capital';
      normalizedFilters.capitalId = toSafeCapitalId(normalizedFilters.capitalId);
      const selectedCapital = SPANISH_CAPITAL_BY_ID[normalizedFilters.capitalId] || MADRID_CENTER;
      normalizedFilters.lat = selectedCapital.lat;
      normalizedFilters.lng = selectedCapital.lng;
    }

    return normalizedFilters;
  }, [user]);

  const buildQueryFromFilters = useCallback((filters: LocalFilters, page: number) => {
    const params = new URLSearchParams();

    if (filters.categoryId) params.set('categoryId', filters.categoryId);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.timeFilter) params.set('timeFilter', filters.timeFilter);
    if (filters.keywords) params.set('keywords', filters.keywords);
    if (filters.orderBy) params.set('orderBy', filters.orderBy);
    if (filters.originType) params.set('originType', filters.originType);
    if (filters.originType === 'capital' && filters.capitalId) {
      params.set('capitalId', filters.capitalId);
    }

    params.set('lat', filters.lat);
    params.set('lng', filters.lng);
    params.set('radius', filters.radius);

    params.set('page', page.toString());

    return params;
  }, []);

  const loadMoreProducts = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      const nextPage = currentPageRef.current + 1;
      const normalizedFilters = normalizeFilters(localFilters);
      const queryString = buildQueryFromFilters(normalizedFilters, nextPage);

      const response = await httpClient.get(`/catalog/listings/search?${queryString.toString()}`);

      const fetchedProducts: Product[] = response.data.data?.listings ?? [];
      const newProducts = await enrichProductsWithCity(fetchedProducts);
      const newTotalItems = parseInt(response.data.data?.total_items?.[0]?.count ?? '0', 10);

      setAllProducts((prev: Product[]) => {
        const mergedProducts = dedupeProductsById([...prev, ...newProducts]);
        setHasMore(mergedProducts.length < newTotalItems);
        return mergedProducts;
      });
      setCurrentPage(nextPage);
      currentPageRef.current = nextPage;
      setTotalItems(newTotalItems);
    } catch {
      notify('error', 'Error de búsqueda', 'No se han podido cargar más productos.');
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  }, [hasMore, localFilters, normalizeFilters, buildQueryFromFilters]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    const target = observerTarget.current;

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [hasMore, isLoading, loadMoreProducts]);

  const applyFilters = (filters: LocalFilters) => {
    const normalizedFilters = normalizeFilters(filters);
    setLocalFilters(normalizedFilters);

    const params = buildQueryFromFilters(normalizedFilters, 0);

    setAllProducts([]);
    setCurrentPage(0);
    currentPageRef.current = 0;
    isFetchingRef.current = false;
    setHasMore(true);

    navigate(`/search?${params.toString()}`);
  };

  const handleFilterChange = (key: keyof LocalFilters, value: string) => {
    const updatedFilters: LocalFilters = { ...localFilters, [key]: value };

    if (key === 'radius') {
      updatedFilters.radius = normalizeRadius(value);
    }

    if (key === 'originType' && value === 'my_location' && !userHasCoordinates) {
      updatedFilters.originType = 'capital';
    }

    if (key === 'capitalId') {
      if (value === 'my_location' && userHasCoordinates) {
        updatedFilters.originType = 'my_location';
        setLocalFilters(updatedFilters);

        const priceValidationError = validatePriceFilters({
          minPrice: updatedFilters.minPrice,
          maxPrice: updatedFilters.maxPrice,
        });
        setPriceError(priceValidationError);
        if (priceValidationError) {
          return;
        }

        applyFilters(updatedFilters);
        return;
      }

      updatedFilters.capitalId = toSafeCapitalId(value);
      updatedFilters.originType = 'capital';
    }

    setLocalFilters(updatedFilters);

    const priceValidationError = validatePriceFilters({
      minPrice: updatedFilters.minPrice,
      maxPrice: updatedFilters.maxPrice,
    });
    setPriceError(priceValidationError);
    if (priceValidationError) {
      return;
    }

    applyFilters(updatedFilters);
  };

  const handleRadiusPreviewChange = (value: string) => {
    setLocalFilters((prevFilters: LocalFilters) => ({
      ...prevFilters,
      radius: normalizeRadius(value),
    }));
  };

  const commitRadiusFilter = () => {
    const normalizedRadius = normalizeRadius(localFilters.radius);
    const updatedFilters: LocalFilters = {
      ...localFilters,
      radius: normalizedRadius,
    };

    setLocalFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  const clearFilters = () => {
    const resetFilters: LocalFilters = {
      categoryId: '',
      minPrice: '',
      maxPrice: '',
      timeFilter: '',
      keywords: '',
      radius: DEFAULT_RADIUS_KM,
      lat: '',
      lng: '',
      originType: userHasCoordinates ? 'my_location' : 'capital',
      capitalId: MADRID_CAPITAL_ID,
      orderBy: 'newest',
    };

    applyFilters(resetFilters);
    setPriceError('');
  };

  const currentRadius = Number.parseInt(localFilters.radius, 10) || Number.parseInt(DEFAULT_RADIUS_KM, 10);
  const currentRadiusStep = getRadiusStep(currentRadius);

  return {
    allProducts,
    totalItems,
    isLoading,
    hasMore,
    observerTarget,
    localFilters,
    priceError,
    userHasCoordinates,
    currentRadius,
    currentRadiusStep,
    handleFilterChange,
    handleRadiusPreviewChange,
    commitRadiusFilter,
    clearFilters,
  };
};
