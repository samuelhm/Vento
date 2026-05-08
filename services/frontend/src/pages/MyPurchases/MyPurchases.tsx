import { ProductCard } from '../../components/ProductCard';
import { useMyPurchases } from './hooks/useMyPurchases';
import { ReviewSellerModal } from './components/ReviewSellerModal';

export const MyPurchases = () => {
  const {
    products,
    handleStartShopping,
    selectedProduct,
    isReviewModalOpen,
    handleOpenReviewModal,
    handleCloseReviewModal,
    handleReviewSubmitted,
  } = useMyPurchases();

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-6 pb-20 lg:px-10 lg:pt-10 lg:pb-16">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Compras
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Mis compras
          </h1>
          <p className="text-sm text-slate-500">
            Consulta el historial de productos que has adquirido
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50 p-12 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200/50">
            <span className="text-4xl">🛍️</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Aún no has comprado nada
          </h3>
          <p className="mt-1 max-w-xs text-sm text-slate-500">
            Explora nuestro catálogo y encuentra lo que buscas hoy mismo.
          </p>
          <button
            onClick={handleStartShopping}
            className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:bg-primary-dark active:scale-95"
          >
            Buscar productos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="flex h-full flex-col gap-3">
              <div className="flex-1">
                <ProductCard product={product} isPrivateView={true} />
              </div>

              {product.canReview ? (
                <button
                  onClick={() => handleOpenReviewModal(product)}
                  className="w-full cursor-pointer rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-primary transition hover:bg-primary/20"
                >
                  Evaluar vendedor
                </button>
              ) : product.alreadyReviewed ? (
                <p className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.15em] text-emerald-700">
                  Vendedor evaluado
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}

      <ReviewSellerModal
        isOpen={isReviewModalOpen}
        product={selectedProduct}
        onClose={handleCloseReviewModal}
        onSubmitted={handleReviewSubmitted}
      />
    </div>
  );
};
