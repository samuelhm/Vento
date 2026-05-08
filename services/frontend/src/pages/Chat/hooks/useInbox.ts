import { useState, useEffect, useCallback } from "react";
import httpClient from "../../../utils/httpClient";
import { enrichProductsWithCity } from "../../../utils/productLocation";
import { fetchSellerReviewAverages } from "../../../utils/productCardEnrichment";
import type {
  InboxChat,
  ChatSummary,
  UserProfileResponse,
  ProductDetailsResponse,
} from "../types";

interface UseInboxProps {
  currentUserId?: string;
  autoSelect?: boolean;
}

export const useInbox = ({ currentUserId, autoSelect = true }: UseInboxProps) => {
  const [inbox, setInbox] = useState<InboxChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const apiBaseUrl = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "");

  const loadInbox = useCallback(async () => {
    if (!currentUserId) return;

    try {
      const res = await httpClient.get("/chats");
      const data = res.data as ChatSummary[];

      if (Array.isArray(data)) {
        const formattedInbox = await Promise.all(
          data.map(async (chat: ChatSummary) => {
            const otherUserId =
              chat.buyerId === currentUserId ? chat.productOwner : chat.buyerId;

            let contactName =
              chat.buyerId === currentUserId ? "Vendedor" : "Comprador";
            let avatar = undefined;
            let productName = `Producto ID: ${chat.productId}`;
            let productImage = undefined;
            let productPhotoPath = undefined;
            let productDescription = "Sin descripción";
            let productUserId = String(chat.productOwner || "");
            let productPrice = "0";
            let productState: InboxChat["productState"] = "active";
            let productReviewAvg = 0;
            let productCity: string | undefined = undefined;
            let productLatitude = 0;
            let productLongitude = 0;

            try {
              const userRes = await httpClient.get(`/auth/user/${otherUserId}`);
              const userResponse = userRes.data as UserProfileResponse;
              const userData =
                userResponse.user || userResponse.data || userResponse;

              if (userData) {
                contactName = userData.name
                  ? `${userData.name} ${userData.last_names || ""}`.trim()
                  : contactName;
                const rawAvatar =
                  userData.avatar_url || userData.avatarUrl || userData.avatar;
                if (rawAvatar) {
                  if (rawAvatar.startsWith("http")) {
                    avatar = rawAvatar;
                  } else if (rawAvatar.startsWith("/api/media")) {
                    avatar = `${apiBaseUrl.replace("/api", "")}${rawAvatar}`;
                  } else {
                    const cleanPath = rawAvatar.startsWith("/")
                      ? rawAvatar.slice(1)
                      : rawAvatar;
                    avatar = `${apiBaseUrl}/media/${cleanPath}`;
                  }
                }
              }
            } catch {
              console.warn("Failed to load user profile for ID:", otherUserId);
            }

            try {
              const productRes = await httpClient.get(
                `/catalog/listings/${chat.productId}`
              );
              const productData = (productRes.data as ProductDetailsResponse)
                .data;

              if (productData) {
                productUserId = String(
                  productData.userId || productData.user_id || productUserId
                );
                productName = productData.title || productName;
                productDescription =
                  productData.description || productDescription;
                productPrice = String(productData.price ?? productPrice);

                const rawState = String(productData.state ?? "").toLowerCase();
                if (
                  rawState === "pending" ||
                  rawState === "reserved" ||
                  rawState === "sold" ||
                  rawState === "cancelled" ||
                  rawState === "active" ||
                  rawState === "inactive"
                ) {
                  productState = rawState;
                }

                productReviewAvg = Number(productData.reviewAvg ?? productReviewAvg);
                productCity =
                  productData.city ||
                  productData.location?.city ||
                  productData.address?.city ||
                  productData.address?.municipality ||
                  productData.address?.town ||
                  productCity;

                const latitudeCandidate = Number(
                  productData.latitude ??
                    productData.lat ??
                    productData.location?.latitude ??
                    productData.location?.lat
                );
                const longitudeCandidate = Number(
                  productData.longitude ??
                    productData.lng ??
                    productData.location?.longitude ??
                    productData.location?.lng
                );

                if (Number.isFinite(latitudeCandidate)) {
                  productLatitude = latitudeCandidate;
                }

                if (Number.isFinite(longitudeCandidate)) {
                  productLongitude = longitudeCandidate;
                }

                if (
                  productData.photos &&
                  Array.isArray(productData.photos) &&
                  productData.photos.length > 0
                ) {
                  const rawPath = productData.photos[0].path;

                  if (rawPath.startsWith("http")) {
                    productImage = rawPath;
                  } else if (rawPath.startsWith("/api/media")) {
                    productPhotoPath = rawPath
                      .replace(/^\/?api\/media\//, "")
                      .replace(/^\/+/, "");
                    productImage = `${apiBaseUrl.replace("/api", "")}${rawPath}`;
                  } else {
                    const cleanPath = rawPath.startsWith("/")
                      ? rawPath.slice(1)
                      : rawPath;
                    productPhotoPath = cleanPath;
                    productImage = `${apiBaseUrl}/media/${cleanPath}`;
                  }
                }

                if (
                  !productCity &&
                  Number.isFinite(productLatitude) &&
                  Number.isFinite(productLongitude)
                ) {
                  const [enrichedProduct] = await enrichProductsWithCity([
                    {
                      id: String(chat.productId),
                      userId: productUserId,
                      title: productName,
                      description: productDescription,
                      price: productPrice,
                      state: productState,
                      createdAt: "",
                      latitude: productLatitude,
                      longitude: productLongitude,
                      wishlist: false,
                      reviewAvg: productReviewAvg,
                      photos: null,
                    },
                  ]);

                  productCity = enrichedProduct?.city || productCity;
                }
              }
            } catch {
              console.warn("Failed to load product details for ID:", chat.productId);
            }

            return {
              id: chat.id,
              productId: String(chat.productId),
              productUserId,
              contactName,
              avatar,
              productName,
              productImage,
              productPhotoPath,
              productPrice,
              productState,
              productReviewAvg,
              productCity,
              productLatitude,
              productLongitude,
              productDescription,
              lastMessage:
                chat.messages && chat.messages.length > 0
                  ? chat.messages[0].content
                  : "Sin mensajes",
            };
          })
        );

        const reviewAvgBySellerId = await fetchSellerReviewAverages(
          formattedInbox.map((chat) => chat.productUserId)
        );
        const inboxWithRating = formattedInbox.map((chat) => ({
          ...chat,
          productReviewAvg: reviewAvgBySellerId.get(chat.productUserId) ?? chat.productReviewAvg,
        }));

        setInbox(inboxWithRating);
        if (autoSelect && formattedInbox.length > 0 && !activeChatId) {
          setActiveChatId(formattedInbox[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching inbox data:", err);
    }
  }, [currentUserId, activeChatId, apiBaseUrl, autoSelect]);

  useEffect(() => {
    loadInbox();
  }, [loadInbox]);

  return {
    inbox,
    activeChatId,
    setActiveChatId,
  };
};
