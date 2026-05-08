import { redirect, type LoaderFunctionArgs } from "react-router";
import httpClient from "../../utils/httpClient";
import { enrichReviews } from "../../utils/reviewUtils";
import { enrichProductsWithCity } from "../../utils/productLocation";
import type { SellerProfileLoaderData } from "./types";
import { canRequestAuthMe } from "../../utils/authHint";
import { notify } from "../../utils/notifications";

export const sellerLoader = async ({ params }: LoaderFunctionArgs): Promise<SellerProfileLoaderData | Response> => {
  try {
    const { id: sellerId } = params;

    if (!sellerId) {
      return redirect("/");
    }

    let currentUser = null;
    if (canRequestAuthMe()) {
      try {
        const meResponse = await httpClient.get("/auth/me");
        currentUser = meResponse.data?.data;
      } catch {
        // Public view
      }
    }

    if (currentUser && currentUser.id === sellerId) {
      return redirect("/my-products");
    }

    const [userResponse, productsResponse, reviewsResponse, statsResponse] = await Promise.all([
      httpClient.get(`/auth/user/${sellerId}`),
      httpClient.get(`/catalog/listings/user/${sellerId}`).catch(() => ({ data: { data: [] } })),
      httpClient.get(`/catalog/reviews/${sellerId}`).catch(() => ({ data: { data: [] } })),
      httpClient.get(`/catalog/reviews/user/${sellerId}/stats`).catch(() => ({ data: { data: { totalReviews: 0, reviewAvg: 0 } } }))
    ]);

    const user = userResponse.data;
    if (!user) {
      return redirect("/");
    }

    const rawProducts = productsResponse.data?.data || [];
    const rawReviews = reviewsResponse.data?.data || [];
    const rawStats = statsResponse.data?.data || { totalReviews: 0, reviewAvg: 0 };

    // Use shared utilities for enrichment
    const enrichedProducts = await enrichProductsWithCity(Array.isArray(rawProducts) ? rawProducts : []);
    const enrichedReviews = await enrichReviews(rawReviews);

    return {
      seller: {
        id: user.id,
        name: `${user.name || ''} ${user.lastNames || ''}`.trim() || "Vendedor de Vento",
        location: user.location || "Barcelona",
        memberSince: user.createdAt || user.created_at
          ? `Miembro desde ${new Date(user.createdAt || user.created_at).getFullYear()}`
          : "Nuevo miembro",
      },
      products: enrichedProducts,
      reviews: enrichedReviews,
      stats: {
        userId: sellerId,
        totalReviews: parseInt(String(rawStats.totalReviews || 0), 10),
        reviewAvg: parseFloat(String(rawStats.reviewAvg || 0))
      }
    };

  } catch {
    notify('error', 'Error de perfil', 'No se ha podido cargar el perfil del vendedor.');
    return redirect("/");
  }
};
