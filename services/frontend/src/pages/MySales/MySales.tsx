import { ProductCard } from '../../components/ProductCard';
import { useMySales } from './hooks/useMySales';

export const MySales = () => {
  const { products, handleStartSelling } = useMySales();

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-6 pb-20 lg:px-10 lg:pt-10 lg:pb-16">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Ventas
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Mis ventas
          </h1>
          <p className="text-sm text-slate-500">
            Consulta el historial de productos que has vendido satisfactoriamente
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50 p-12 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200/50">
            <span className="text-4xl">💰</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Aún no has vendido ningún producto
          </h3>
          <p className="mt-1 max-w-xs text-sm text-slate-500">
            Publica nuevos productos y empieza a ganar dinero hoy mismo.
          </p>
          <button
            onClick={handleStartSelling}
            className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:bg-primary-dark active:scale-95"
          >
            Publicar producto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isPrivateView={true} 
            />
          ))}
        </div>
      )}
    </div>
  );
};
