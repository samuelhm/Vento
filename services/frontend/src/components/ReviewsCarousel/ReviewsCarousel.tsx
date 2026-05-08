import React, { useRef, useState, useCallback } from 'react';
import { ReviewCard } from '../ReviewCard';
import type { ReviewWithBuyer } from '../../types/reviewTypes';

interface ReviewsCarouselProps {
  reviews: ReviewWithBuyer[];
  title?: string;
  onOpenReviews?: (reviewId: string) => void;
}

export const ReviewsCarousel: React.FC<ReviewsCarouselProps> = ({ 
  reviews, 
  title,
  onOpenReviews 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    }
  }, [activeIndex]);

  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      scrollRef.current.scrollTo({
        left: index * clientWidth,
        behavior: 'smooth'
      });
    }
  };

  if (reviews.length === 0) return null;

  const isAtStart = activeIndex === 0;
  const isAtEnd = activeIndex === reviews.length - 1;

  return (
    <div className="relative mb-8 group/carousel">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          {title || 'Valoraciones'} <span className="text-sm font-normal text-slate-500">({reviews.length})</span>
        </h2>
        
        {/* Navigation Buttons */}
        <div className="hidden md:flex gap-2">
          <button 
            onClick={() => scrollTo(activeIndex - 1)}
            disabled={isAtStart}
            className={`p-2 rounded-full border border-slate-200 transition-all ${
              !isAtStart ? "bg-white text-slate-700 hover:border-primary hover:text-primary shadow-sm" : "bg-slate-50 text-slate-300 cursor-not-allowed opacity-50"
            }`}
            aria-label="Anterior valoración"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={() => scrollTo(activeIndex + 1)}
            disabled={isAtEnd}
            className={`p-2 rounded-full border border-slate-200 transition-all ${
              !isAtEnd ? "bg-white text-slate-700 hover:border-primary hover:text-primary shadow-sm" : "bg-slate-50 text-slate-300 cursor-not-allowed opacity-50"
            }`}
            aria-label="Siguiente valoración"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reviews.map((review) => (
          <div 
            key={review.id || `${review.listingId}-${review.buyerId}`} 
            className="min-w-full snap-center px-1"
          >
            <ReviewCard 
              review={review} 
              onClick={onOpenReviews && review.id ? () => onOpenReviews(review.id!) : undefined}
            />
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-1.5 mt-2">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeIndex === i ? "bg-primary w-6" : "bg-slate-200 w-1.5 hover:bg-slate-300"
            }`}
            aria-label={`Ir a reseña ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
