import React from 'react';
import { 
  ReviewUserHeader, 
  ReviewContent, 
  ReviewProductAttachment 
} from './components';
import type { ReviewWithBuyer } from '../../types/reviewTypes';

interface ReviewCardProps {
  review: ReviewWithBuyer;
  onClick?: () => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onClick }) => {
  return (
    <div 
      className="bg-white rounded-2xl border border-slate-100 p-4 md:p-5 shadow-sm flex flex-col relative overflow-hidden transition-all"
    >
      <div className="flex flex-col md:flex-row md:gap-6 min-h-0">
        {/* Main Column: User + Review */}
        <div className="flex-1 flex flex-col min-w-0">
          <ReviewUserHeader 
            buyerId={review.buyerId}
            buyerName={review.buyerName}
            buyerAvatar={review.buyerAvatar}
            buyerSince={review.buyerSince}
          />

          <div className="min-h-0">
            <ReviewContent 
              stars={review.stars}
              createdAt={review.createdAt}
              reviewText={review.review}
              onReadMore={onClick}
            />
          </div>
        </div>

        {/* Side Column: Product Attachment */}
        <div className="md:w-80 shrink-0 flex flex-col md:justify-center mt-2 md:mt-0">
          <ReviewProductAttachment 
            listingId={review.listingId}
            title={review.title}
            imagePath={review.path}
            categoryName={review.categoryName}
          />
        </div>
      </div>
    </div>
  );
};
