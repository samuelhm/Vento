import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { SellerHeader } from "./components/SellerHeader";
import { SellerProducts } from "./components/SellerProducts";
import { ReviewsCarousel } from "../../components/ReviewsCarousel";
import { ReviewsModal } from "../../components/ReviewsModal";
import type { SellerProfileLoaderData } from "./types";
import { useAuth } from "../../contexts/AuthContext";

export const SellerProfile = () => {
  const { seller, products, reviews, stats } = useLoaderData() as SellerProfileLoaderData;
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | undefined>(undefined);

  const handleOpenReviews = (reviewId?: string) => {
    setSelectedReviewId(reviewId);
    setIsReviewsModalOpen(true);
  };

  const handleCloseReviews = () => {
    setIsReviewsModalOpen(false);
    setSelectedReviewId(undefined);
  };

  useEffect(() => {
    handleCloseReviews();
  }, [seller?.id]);

  useEffect(() => {
    if (user && seller && user.id === seller.id) {
      navigate("/my-products", { replace: true });
    }
  }, [user, seller, navigate]);

  if (!seller) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-slate-500">Error cargando el perfil del vendedor.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
      <SellerHeader 
        seller={seller} 
        stats={stats} 
        onOpenReviews={() => handleOpenReviews()} 
      />

      <ReviewsCarousel 
        key={seller.id}
        reviews={reviews} 
        title={`Valoraciones sobre ${seller.name}`} 
        onOpenReviews={handleOpenReviews}
      />

      <div className="mt-8">
        <SellerProducts products={products} sellerName={seller.name} />
      </div>

      <ReviewsModal
        isOpen={isReviewsModalOpen}
        onClose={handleCloseReviews}
        sellerName={seller.name}
        reviews={reviews}
        stats={stats}
        initialReviewId={selectedReviewId}
      />
    </div>
  );
};
