import React from 'react';
import {
  ReviewUserHeader,
  ReviewProductAttachment
} from '../ReviewCard';
import { ReviewMeta } from '../ReviewMeta';
import type { ReviewWithBuyer } from '../../types/reviewTypes';

interface CompactReviewItemProps {
  review: ReviewWithBuyer;
  onAction?: () => void;
}

export const CompactReviewItem: React.FC<CompactReviewItemProps> = ({ review, onAction }) => {
  return (
    <div
      id={`review-${review.id}`}
      className="py-10 border-b border-slate-100 last:border-0 flex flex-col gap-5 transition-colors"
    >
      <ReviewUserHeader
        buyerId={review.buyerId}
        buyerName={review.buyerName}
        buyerAvatar={review.buyerAvatar}
        buyerSince={review.buyerSince}
        onClick={onAction}
      />

      <div className="flex flex-col gap-3">
        <ReviewMeta
          stars={review.stars}
          createdAt={review.createdAt}
          containerClassName="flex items-center gap-3 shrink-0"
          dateClassName="text-[11px] md:text-xs text-slate-400 font-bold uppercase tracking-wider"
        />

        <div className="text-slate-700 text-[15px] md:text-[16px] leading-relaxed italic mb-1">
          <p className="whitespace-pre-wrap">
            "{review.review}"
          </p>
        </div>

        <div className="mt-2 w-full">
          <ReviewProductAttachment
            listingId={review.listingId}
            title={review.title}
            imagePath={review.path}
            categoryName={review.categoryName}
            isSmall={true}
          />
        </div>
      </div>
    </div>
  );
};
