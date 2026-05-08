import type { Product } from '../types/searchTypes';

const CACHE_KEY = 'vento_city_cache_v1';

// Load cache from sessionStorage on initialization
const loadCacheFromStorage = (): Map<string, string> => {
  try {
    const stored = sessionStorage.getItem(CACHE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Record<string, string>;
      return new Map(Object.entries(parsed));
    }
  } catch {
    // Silent
  }
  return new Map();
};

// Save cache to sessionStorage
const saveCacheToStorage = (cache: Map<string, string>) => {
  try {
    const obj = Object.fromEntries(cache.entries());
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(obj));
  } catch {
    // Silent
  }
};

const cityCache = loadCacheFromStorage();
const inFlightRequests = new Map<string, Promise<string | undefined>>();

const toCoordinateKey = (latitude: number, longitude: number) => {
  return `${latitude.toFixed(3)},${longitude.toFixed(3)}`;
};

const getBestCityLabel = (address: Record<string, string | undefined>) => {
  return (
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    address.county ||
    address.state
  );
};

const reverseGeocodeCity = async (latitude: number, longitude: number): Promise<string | undefined> => {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return undefined;
  }

  const cacheKey = toCoordinateKey(latitude, longitude);

  if (cityCache.has(cacheKey)) {
    const cachedCity = cityCache.get(cacheKey);
    return cachedCity || undefined;
  }

  const existingRequest = inFlightRequests.get(cacheKey);
  if (existingRequest) {
    return existingRequest;
  }

  const request = fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
    {
      headers: {
        Accept: 'application/json',
      },
    },
  )
    .then(async (response) => {
      if (!response.ok) {
        return undefined;
      }

      const data = (await response.json()) as {
        address?: Record<string, string | undefined>;
      };

      const city = getBestCityLabel(data.address ?? {});
      cityCache.set(cacheKey, city ?? '');
      saveCacheToStorage(cityCache);
      return city;
    })
    .catch(() => {
      cityCache.set(cacheKey, '');
      saveCacheToStorage(cityCache);
      return undefined;
    })
    .finally(() => {
      inFlightRequests.delete(cacheKey);
    });

  inFlightRequests.set(cacheKey, request);

  return request;
};

export const enrichProductsWithCity = async (products: Product[]): Promise<Product[]> => {
  if (products.length === 0) {
    return products;
  }

  const cityByCoordinate = new Map<string, string>();
  const uniqueCoordinates = new Map<string, { latitude: number; longitude: number }>();

  for (const product of products) {
    if (product.city) {
      continue;
    }

    if (!Number.isFinite(product.latitude) || !Number.isFinite(product.longitude)) {
      continue;
    }

    const key = toCoordinateKey(product.latitude, product.longitude);
    if (!uniqueCoordinates.has(key)) {
      uniqueCoordinates.set(key, {
        latitude: product.latitude,
        longitude: product.longitude,
      });
    }
  }

  await Promise.all(
    Array.from(uniqueCoordinates.entries()).map(async ([key, coordinates]) => {
      const city = await reverseGeocodeCity(coordinates.latitude, coordinates.longitude);
      if (city) {
        cityByCoordinate.set(key, city);
      }
    }),
  );

  return products.map((product) => {
    if (product.city) {
      return product;
    }

    const key = toCoordinateKey(product.latitude, product.longitude);
    const city = cityByCoordinate.get(key);
    if (!city) {
      return product;
    }

    return {
      ...product,
      city,
    };
  });
};
