import { redirect, type LoaderFunctionArgs } from "react-router";
import httpClient from "../../utils/httpClient";
import type { RawProduct } from "../Product/types";
import type { AuthSuccessResponse } from "../../types/authTypes";
import type { EditProductLoaderData } from "./types";
import { canRequestAuthMe } from "../../utils/authHint";
import { notify } from "../../utils/notifications";

const FALLBACK_LAT = 41.3851;
const FALLBACK_LNG = 2.1734;

export const editProductLoader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  if (!id) {
    return redirect("/404");
  }

  if (!canRequestAuthMe()) {
    return redirect("/login");
  }

  try {
    const [listingResponse, authResponse] = await Promise.all([
      httpClient.get(`/catalog/listings/${id}`),
      httpClient.get<AuthSuccessResponse>("/auth/me"),
    ]);

    const listing = listingResponse.data?.data as RawProduct | undefined;
    const currentUser = authResponse.data?.data;

    if (!listing?.id || !currentUser?.id) {
      return redirect("/404");
    }

    const ownerId = listing.userId || listing.user_id;
    if (!ownerId || ownerId !== currentUser.id) {
      return redirect(`/product/${id}`);
    }

    if (listing.state === "sold") {
      return redirect(`/product/${id}`);
    }

    const data: EditProductLoaderData = {
      id: listing.id,
      title: listing.title ?? "",
      description: listing.description ?? "",
      price: Number(listing.price ?? 0),
      categoryId: Number(listing.categoryId || listing.categorie_id || 0),
      latitude: Number(listing.latitude ?? FALLBACK_LAT),
      longitude: Number(listing.longitude ?? FALLBACK_LNG),
      existingPhotos: (listing.photos ?? [])
        .sort((a, b) => a.position - b.position)
        .map((photo) => photo.path)
        .filter(Boolean),
    };

    return data;
  } catch {
    notify('error', 'Error de edición', 'No se ha podido cargar el anuncio para editar.');
    return redirect("/404");
  }
};
