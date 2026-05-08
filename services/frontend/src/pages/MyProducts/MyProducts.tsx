import { useLoaderData, useNavigate, useSearchParams } from 'react-router';
import { ProductCard } from '../../components/ProductCard';
import type { Product } from '../../types/searchTypes';
import { useState, useEffect } from 'react';
import { ButtonPrimary } from '../../components/ButtonPrimary';
import { toast } from 'sonner';

export const MyProducts = () => {
  const initialProducts = useLoaderData() as Product[];
  const [products] = useState<Product[]>(initialProducts);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const created = searchParams.get('created');
    const updated = searchParams.get('updated');
    const deleted = searchParams.get('deleted');

    if (created === 'true') {
      toast.success('Producto publicado correctamente');
    } else if (updated === 'true') {
      toast.success('Producto actualizado correctamente');
    } else if (deleted === 'true') {
      toast.success('Producto eliminado correctamente');
    }

    if (created || updated || deleted) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('created');
      newParams.delete('updated');
      newParams.delete('deleted');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-6 pb-20 lg:px-10 lg:pt-10 lg:pb-16">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Ventas</p>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Mis productos</h1>
          <p className="text-sm text-slate-500">Gestiona los productos que tienes a la venta</p>
        </div>

        {products.length > 0 && (
          <ButtonPrimary
            onClick={() => navigate('/my-products/new')}
            className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:bg-primary-dark active:scale-95"
          >
            Agregar producto
          </ButtonPrimary>
        )}
      </div>

      {products.length === 0 ? (
        <div className="flex min-h-75 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50 p-12 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200/50">
            <span className="text-4xl">📦</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">Aún no tienes productos</h3>
          <p className="mt-1 max-w-xs text-sm text-slate-500">
            Sube tu primer producto y empieza a ganar dinero hoy mismo.
          </p>
          <button
            onClick={() => navigate('/my-products/new')}
            className="cursor-pointer mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark hover:scale-105 active:scale-95"
          >
            Subir producto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
