import { useFavorites } from "../../../contexts/FavoritesContext";
import { ActionButton } from "./ActionButton";
import { FavoriteIcon } from "../../../components/ProductCard/assets/FavoriteIcon";
import { mapProductDetailToProduct } from "../utils";
import type { ProductActionButtonsProps } from "../types";

export const ProductActionButtons = ({
  product,
  onOffer,
  onContact,
  isAuthenticated = false,
  onEdit,
  onDelete,
  onReserve,
  onSell,
  isCreatingChat,
  isReserving = false,
  isSelling = false,
  isOwner,
  favoritesCount = 0,
}: ProductActionButtonsProps) => {
  const { isFavorite: isFavoriteContext, toggleFavorite } = useFavorites();
  const isFavorite = isFavoriteContext(product.id);
  const isSold = product.state === "sold";

  const handleToggleFavorite = () => {
    const productForFavorites = mapProductDetailToProduct(product, isFavorite);
    toggleFavorite(productForFavorites);
  };

  if (isOwner) {
    const isReserved = product.state === "reserved";

    return (
      <div className="flex flex-col gap-3 mb-12">
        {!isSold && (
          <>
            <ActionButton onClick={onEdit} variant="primary">
              Editar anuncio
            </ActionButton>

            <ActionButton onClick={onReserve} disabled={isReserving} variant="outline">
              {isReserving ? "Actualizando..." : isReserved ? "Quitar reserva" : "Marcar como reservado"}
            </ActionButton>

            <ActionButton onClick={onSell} disabled={isSelling} variant="secondary">
              {isSelling ? "Procesando..." : "Marcar como vendido"}
            </ActionButton>

            <ActionButton onClick={onDelete} variant="danger">
              Eliminar anuncio
            </ActionButton>
          </>
        )}
        <ActionButton variant="static" className="mt-2">
          Favoritos: {favoritesCount}
        </ActionButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 mb-12">
      {isAuthenticated && !isSold && (
        <ActionButton onClick={onOffer} variant="primary">
          Hacer oferta
        </ActionButton>
      )}
      
      {isAuthenticated && (
        <ActionButton
          onClick={onContact}
          disabled={isCreatingChat || isSold}
          variant="outline"
        >
          {isCreatingChat ? "Cargando..." : isSold ? "No disponible" : "Contactar al vendedor"}
        </ActionButton>
      )}

      <ActionButton
        onClick={handleToggleFavorite}
        variant="ghost"
        icon={<FavoriteIcon isFavorite={isFavorite} className="w-5 h-5" />}
        className="mt-2"
      >
        {isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
      </ActionButton>
    </div>
  );
};
