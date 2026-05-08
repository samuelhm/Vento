import placeholderProductImage from "/placeholder-product.webp";
import { formatCurrency } from "../../utils/formatCurrency";
import type { ProductDetail, RawProduct, RawUser } from "./types";
import type { Product } from "../../types/searchTypes";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export const mapProductDetailToProduct = (product: ProductDetail, isFavorite: boolean): Product => {
  return {
    id: product.id,
    userId: product.seller.id,
    title: product.title,
    description: product.description,
    price: product.priceFormatted,
    state: product.state,
    createdAt: product.createdAtFormatted,
    latitude: product.location.lat,
    longitude: product.location.lng,
    wishlist: isFavorite,
    reviewAvg: product.reviewAvg,
    photos: product.images.map((img, index) => ({ path: img, position: index })),
  };
};

export const formatProductPageData = (product: RawProduct, user: RawUser): ProductDetail => {
  const baseUrl = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "");

  const images = (product.photos ?? [])
    .sort((a, b) => a.position - b.position)
    .map((photo) => `${baseUrl}/media/${photo.path}`);

  const userDate = user.created_at || user.createdAt || new Date().toISOString();
  const productDate = product.createdAt || product.created_at || new Date().toISOString();
  const finalCategoryId = product.categoryId || product.categorie_id || 0;
  const hasExactLocation = typeof product.latitude === "number" && typeof product.longitude === "number";

  return {
    id: product.id,
    title: product.title,
    description: product.description,
    priceFormatted: formatCurrency(product.price),
    priceValue: Number(product.price) || 0,
    category: {
      id: finalCategoryId,
      name: product.categoryName || "Otros",
    },
    location: {
      lat: product.latitude ?? 41.3851,
      lng: product.longitude ?? 2.1734,
    },
    hasExactLocation,
    images: images.length > 0 ? images : [placeholderProductImage],
    state: (product.state || "pending") as "pending" | "reserved" | "sold" | "cancelled",
    reviewAvg: product.reviewAvg ?? 0,
    seller: {
      id: user.id,
      name: user.name || "Usuario",
      memberSince: `Miembro desde ${new Date(userDate).getFullYear()}`,
    },
    createdAtFormatted: formatDate(productDate),
  };
};
