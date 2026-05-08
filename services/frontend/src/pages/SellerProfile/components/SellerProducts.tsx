import { useLoaderData } from 'react-router';
import { ProductCard } from '../../../components/ProductCard';
import type { Product } from '../../../types/searchTypes';

interface SellerProductsProps {
  products: Product[];
  sellerName: string;
}

export const SellerProducts = ({ products, sellerName }: SellerProductsProps) => {
  const { seller } = useLoaderData() as { seller: { id: string } };
  
  const productsWithUserId = products.map(product => ({
    ...product,
    userId: product.userId || seller.id
  }));

  return (
  <div>
    <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-200 pb-2">
      Anuncios de {sellerName} ({products?.length || 0})
    </h2>

    {!products || products.length === 0 ? (
      <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-200 border-dashed">
        <p className="text-slate-500">Este vendedor no tiene productos publicados en este momento.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productsWithUserId.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
          />
        ))}
      </div>
    )}
  </div>
);
};
