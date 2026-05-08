import { useLoaderData, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import type { Product } from '../../../types/searchTypes';

export const useMyPurchases = () => {
  const initialProducts = useLoaderData() as Product[];
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const handleStartShopping = () => {
    navigate('/search');
  };

  const handleOpenReviewModal = (product: Product) => {
    setSelectedProduct(product);
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedProduct(null);
  };

  const handleReviewSubmitted = (listingId: string) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === listingId
          ? { ...product, alreadyReviewed: true, canReview: false }
          : product
      )
    );
  };

  return {
    products,
    handleStartShopping,
    selectedProduct,
    isReviewModalOpen,
    handleOpenReviewModal,
    handleCloseReviewModal,
    handleReviewSubmitted,
  };
};
