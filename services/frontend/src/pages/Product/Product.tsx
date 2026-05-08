import { ChatModal } from "../../components/chatModal";
import { ConfirmModal } from "../../components/ConfirmModal";
import { useProductPage } from "./useProductPage";
import { ProductGallery } from "./components/ProductGallery";
import { ProductDescription } from "./components/ProductDescription";
import { ProductLocation } from "./components/ProductLocation";
import { ProductSidebarInfo } from "./components/ProductSidebarInfo";
import { ProductActionButtons } from "./components/ProductActionButtons";
import { SellerPreview } from "./components/SellerPreview";
import { Breadcrumbs } from "./components/Breadcrumbs";
import { SoldProductModal } from "./components/SoldProductModal";
import { OfferModal } from "./components/OfferModal";

export const Product = () => {
  const {
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
    isAuthenticated,
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
  } = useProductPage();

  if (!data) return null;

  const {
    id,
    title,
    description,
    priceFormatted,
    category,
    location,
    hasExactLocation,
    images,
    state,
    seller,
  } = data;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <Breadcrumbs category={category} productTitle={title} />
      <div className="flex flex-col md:flex-row gap-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Main Content Column */}
        <div className="w-full md:w-2/3 flex flex-col gap-6">
          <ProductGallery images={images} title={title} />
          <ProductDescription description={description} />
          <ProductLocation
            latitude={location.lat}
            longitude={location.lng}
            hasExactLocation={hasExactLocation}
          />
        </div>

        <div className="w-full md:w-1/3 flex flex-col pt-2">
          <ProductSidebarInfo
            title={title}
            priceFormatted={priceFormatted}
            categoryName={category?.name}
            state={state}
          />

          <ProductActionButtons
            product={data}
            onOffer={handleOpenOfferModal}
            onContact={handleOpenChat}
            isAuthenticated={isAuthenticated}
            onEdit={handleEdit}
            onReserve={handleToggleReserve}
            onSell={handleOpenSellModal}
            onDelete={() => setShowDeleteConfirm(true)}
            isCreatingChat={isCreatingChat}
            isReserving={isReserving}
            isSelling={isSelling}
            isOwner={isOwner}
            favoritesCount={favoritesCount}
          />

          <SellerPreview
            id={seller.id}
            name={seller.name}
            memberSince={seller.memberSince}
          />
        </div>
      </div>

      {isChatOpen && conversationId && (
        <ChatModal
          seller={seller}
          productId={id}
          conversationId={conversationId}
          onClose={() => setIsChatOpen(false)}
        />
      )}

      <OfferModal
        isOpen={isOfferModalOpen}
        isSubmitting={isSendingOffer}
        buyerName={buyerDisplayName}
        onClose={() => setIsOfferModalOpen(false)}
        onSubmit={handleSendOffer}
      />

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="¿Eliminar este anuncio?"
        message="Esta acción es irreversible y el anuncio dejará de ser visible para otros usuarios."
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        variant="danger"
      />

      <SoldProductModal
        isOpen={showSellConfirm}
        onClose={() => setShowSellConfirm(false)}
        onConfirm={handleConfirmSell}
        candidates={saleCandidates}
        selectedBuyerId={selectedBuyerId}
        onSelectBuyer={setSelectedBuyerId}
        isLoading={isSelling}
      />
    </div>
  );
};
