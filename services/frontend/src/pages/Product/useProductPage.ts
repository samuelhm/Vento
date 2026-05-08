import { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router";
import axios from "axios";
import { toast } from "sonner";
import httpClient from "../../utils/httpClient";
import { useAuth } from "../../contexts/AuthContext";
import type { ProductDetail, SaleCandidate } from "./types";
import { getWishlistCount, seedWishlistCount } from "../../utils/wishlistCount";

type ChatSummaryForSale = {
  productId?: string | number;
  productOwner?: string;
  buyerId?: string;
};

export const useProductPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isSendingOffer, setIsSendingOffer] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSellConfirm, setShowSellConfirm] = useState(false);
  const [saleCandidates, setSaleCandidates] = useState<SaleCandidate[]>([]);
  const [selectedBuyerId, setSelectedBuyerId] = useState("");
  const [favoritesCount, setFavoritesCount] = useState<number>(0);
  const loadedData = useLoaderData() as ProductDetail;
  const [data, setData] = useState<ProductDetail>(loadedData);
  const { user } = useAuth();
  const navigate = useNavigate();
  const buyerDisplayName = [user?.name, user?.lastNames].filter(Boolean).join(" ").trim() || "usuario";

  useEffect(() => {
    setData(loadedData);
  }, [loadedData]);

  const isOwner = !!user && user.id === data.seller.id;

  useEffect(() => {
    if (!data.id || !isOwner) return;

    const fetchFavCount = async () => {
      try {
        const count = await getWishlistCount(data.id);
        setFavoritesCount(count);
        seedWishlistCount(data.id, count);
      } catch {
        // Silently fail for background stats
      }
    };

    fetchFavCount();
  }, [data.id, isOwner]);

  const handleOpenChat = async () => {
    if (!user || data.state === "sold") return;

    try {
      setIsCreatingChat(true);
      const response = await httpClient.post("/chats", {
        productId: data.id,
        productOwner: data.seller.id,
      });

      setConversationId(response.data.id);
      setIsChatOpen(true);
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError<{ message?: string; error?: string }>(error)
        ? error.response?.data?.message || error.response?.data?.error || error.message
        : error instanceof Error
          ? error.message
          : "Error desconocido";

      toast.error(`No se pudo iniciar el chat: ${errorMessage}`);
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleOpenOfferModal = () => {
    if (!user || isOwner || data.state === "sold") return;
    setIsOfferModalOpen(true);
  };

  const handleSendOffer = async (payload: { price: number; message: string }) => {
    if (!user || isOwner || data.state === "sold") {
      toast.error("Este producto ya no acepta ofertas");
      return;
    }

    try {
      setIsSendingOffer(true);

      const response = await httpClient.post("/chats", {
        productId: data.id,
        productOwner: data.seller.id,
      });

      const nextConversationId = String(response.data.id);

      await httpClient.post(`/chats/${nextConversationId}/messages`, {
        receiverId: data.seller.id,
        productId: data.id,
        conversationId: nextConversationId,
        content: payload.message,
      });

      setConversationId(nextConversationId);
      setIsOfferModalOpen(false);
      toast.success("Oferta enviada");
    } catch (error) {
      const errorMessage = axios.isAxiosError<{ message?: string; error?: string }>(error)
        ? error.response?.data?.message || error.response?.data?.error || error.message
        : "No se pudo enviar la oferta";

      toast.error(errorMessage);
    } finally {
      setIsSendingOffer(false);
    }
  };

  const handleDelete = async () => {
    if (!data.id || data.state === "sold") {
      toast.error("No puedes eliminar un anuncio vendido");
      setShowDeleteConfirm(false);
      return;
    }

    try {
      setIsDeleting(true);
      await httpClient.delete(`/catalog/listings/${data.id}`);
      toast.success("Anuncio eliminado");
      navigate("/my-products");
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError<{ message?: string; error?: string }>(error)
        ? error.response?.data?.message || error.response?.data?.error || error.message
        : error instanceof Error
          ? error.message
          : "Error desconocido";

      toast.error(`No se pudo eliminar el anuncio: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleEdit = () => {
    if (data.state === "sold") {
      toast.error("No puedes editar un anuncio vendido");
      return;
    }

    navigate(`/my-products/${data.id}/edit`);
  };

  const handleToggleReserve = async () => {
    if (!isOwner || data.state === "sold") {
      if (data.state === "sold") {
        toast.error("No puedes cambiar el estado de un anuncio vendido");
      }
      return;
    }

    try {
      setIsReserving(true);
      const response = await httpClient.patch(`/catalog/listings/${data.id}/reserve`);
      const nextState = response.data?.data?.state as ProductDetail["state"] | undefined;

      if (nextState) {
        setData((prev) => ({ ...prev, state: nextState }));
        toast.success(nextState === "reserved" ? "Producto marcado como reservado" : "Reserva removida");
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message || error.message
        : "No se pudo actualizar el estado del anuncio";

      toast.error(errorMessage);
    } finally {
      setIsReserving(false);
    }
  };

  const handleOpenSellModal = async () => {
    if (!isOwner || data.state === "sold") return;

    try {
      setIsSelling(true);

      const chatsResponse = await httpClient.get("/chats");
      const rawChats = Array.isArray(chatsResponse.data)
        ? chatsResponse.data
        : Array.isArray(chatsResponse.data?.data)
          ? chatsResponse.data.data
          : [];

      const participants = (rawChats as ChatSummaryForSale[])
        .filter((chat) => {
          return (
            String(chat.productId) === String(data.id) &&
            String(chat.productOwner) === String(data.seller.id) &&
            !!chat.buyerId
          );
        })
        .map((chat) => chat.buyerId as string);

      const uniqueBuyerIds = Array.from(new Set(participants));

      if (uniqueBuyerIds.length === 0) {
        toast.error("No hay usuarios con conversación para este producto");
        return;
      }

      const buyerProfiles = await Promise.all(
        uniqueBuyerIds.map(async (buyerId) => {
          try {
            const userResponse = await httpClient.get(`/auth/user/${buyerId}`);
            const userData = userResponse.data?.user || userResponse.data?.data || userResponse.data;
            const fullName = userData?.name
              ? `${userData.name} ${userData.last_names || ""}`.trim()
              : "Usuario";

            return { id: buyerId, name: fullName };
          } catch {
            return { id: buyerId, name: "Usuario" };
          }
        })
      );

      setSaleCandidates(buyerProfiles);
      setSelectedBuyerId((prev) => prev || buyerProfiles[0].id);
      setShowSellConfirm(true);
    } catch (error) {
      const errorMessage = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message || error.message
        : "No se pudieron cargar las conversaciones del producto";

      toast.error(errorMessage);
    } finally {
      setIsSelling(false);
    }
  };

  const handleConfirmSell = async () => {
    if (!selectedBuyerId || !isOwner || data.state === "sold") return;

    try {
      setIsSelling(true);

      await httpClient.post("/catalog/transactions", {
        listingId: data.id,
        sellerId: data.seller.id,
        buyerId: selectedBuyerId,
        price: data.priceValue,
      });

      setData((prev) => ({ ...prev, state: "sold" }));
      setShowSellConfirm(false);
      toast.success("Producto marcado como vendido");
      navigate("/my-sales");
    } catch (error) {
      const errorMessage = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message || error.message
        : "No se pudo completar la venta";

      toast.error(errorMessage);
    } finally {
      setIsSelling(false);
    }
  };

  return {
    data,
    isChatOpen,
    setIsChatOpen,
    conversationId,
    isCreatingChat,
    handleOpenChat,
    isOfferModalOpen,
    setIsOfferModalOpen,
    handleOpenOfferModal,
    handleSendOffer,
    isSendingOffer,
    isAuthenticated: Boolean(user),
    buyerDisplayName,
    isOwner,
    isDeleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleDelete,
    handleEdit,
    isReserving,
    isSelling,
    handleToggleReserve,
    handleOpenSellModal,
    handleConfirmSell,
    showSellConfirm,
    setShowSellConfirm,
    saleCandidates,
    selectedBuyerId,
    setSelectedBuyerId,
    favoritesCount,
  };
};
