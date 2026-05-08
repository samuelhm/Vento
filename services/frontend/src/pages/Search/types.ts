import type { RefObject } from 'react';
import type { Product } from '../../types/searchTypes';

export type OriginType = 'my_location' | 'capital';

export type SearchParams = {
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  timeFilter?: 'today' | 'lastWeek' | 'lastMonth';
  keywords?: string;
  radius?: string;
  lat?: string;
  lng?: string;
  originType?: OriginType;
  capitalId?: string;
  orderBy?: 'price_low_to_high' | 'price_high_to_low' | 'newest' | 'closest';
  page?: string;
};

export type SearchLoaderData = {
  products: Product[];
  totalItems: number;
  currentPage: number;
  filters: SearchParams;
};

export type LocalFilters = {
  categoryId: string;
  minPrice: string;
  maxPrice: string;
  timeFilter: NonNullable<SearchParams['timeFilter']> | '';
  keywords: string;
  radius: string;
  lat: string;
  lng: string;
  originType: OriginType;
  capitalId: string;
  orderBy: NonNullable<SearchParams['orderBy']>;
};

export type UseSearchLogicResult = {
  allProducts: Product[];
  totalItems: number;
  isLoading: boolean;
  hasMore: boolean;
  observerTarget: RefObject<HTMLDivElement | null>;
  localFilters: LocalFilters;
  priceError: string;
  userHasCoordinates: boolean;
  currentRadius: number;
  currentRadiusStep: number;
  handleFilterChange: (key: keyof LocalFilters, value: string) => void;
  handleRadiusPreviewChange: (value: string) => void;
  commitRadiusFilter: () => void;
  clearFilters: () => void;
};
