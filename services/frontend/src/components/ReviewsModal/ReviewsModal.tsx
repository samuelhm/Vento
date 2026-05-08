import React, { useEffect, useRef } from 'react';
import { CompactReviewItem } from '../CompactReviewItem';
import { ReviewsSummary } from '../ReviewsSummary';
import type { ReviewWithBuyer, ReviewStats } from '../../types/reviewTypes';

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerName: string;
  reviews: ReviewWithBuyer[];
  stats: ReviewStats;
  initialReviewId?: string;
}

export const ReviewsModal: React.FC<ReviewsModalProps> = ({
  isOpen,
  onClose,
  sellerName,
  reviews,
  stats,
  initialReviewId
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [spacerHeight, setSpacerHeight] = React.useState(0);
  const lastScrollTopRef = useRef(0);

  const handleListScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const currentScrollTop = event.currentTarget.scrollTop;
    if (spacerHeight > 0 && currentScrollTop < lastScrollTopRef.current) {
      setSpacerHeight(0);
    }
    lastScrollTopRef.current = currentScrollTop;
  };

  useEffect(() => {
    if (isOpen && initialReviewId) {
      setSpacerHeight(0);
      lastScrollTopRef.current = 0;

      // Esperar a que el modal se abra y el DOM esté listo
      const timer = setTimeout(() => {
        const listElement = listRef.current;
        const element = document.getElementById(`review-${initialReviewId}`);
        if (!listElement || !element) {
          return;
        }

        const targetTop = (element as HTMLElement).offsetTop;
        const maxScrollTop = listElement.scrollHeight - listElement.clientHeight;
        const requiredExtraScroll = Math.max(0, targetTop - maxScrollTop);

        const alignTargetAtTop = () => {
          element.scrollIntoView({ behavior: 'auto', block: 'start' });
          requestAnimationFrame(() => {
            if (listRef.current) {
              lastScrollTopRef.current = listRef.current.scrollTop;
            }
          });
        };

        if (requiredExtraScroll > 0) {
          setSpacerHeight(requiredExtraScroll + 16);
          requestAnimationFrame(() => {
            requestAnimationFrame(alignTargetAtTop);
          });
          return;
        }

        alignTargetAtTop();
      }, 50);

      return () => clearTimeout(timer);
    } else {
      setSpacerHeight(0);
    }
  }, [isOpen, initialReviewId, reviews]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-10 transition-all animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white z-10 border-b border-slate-100 px-6 py-5 md:px-10 md:py-6 flex justify-between items-center shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-5">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">
              Valoraciones de <span className="text-primary">{sellerName}</span>
            </h2>
            <ReviewsSummary stats={stats} />
          </div>

          <button 
            onClick={onClose}
            className="p-2.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 border border-slate-100 group"
            aria-label="Cerrar modal"
          >
            <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div 
          ref={listRef}
          onScroll={handleListScroll}
          className="flex-1 overflow-y-auto px-6 py-2 md:px-10 scroll-smooth scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
        >
          {reviews.length > 0 ? (
            <div className="flex flex-col pb-8">
              {reviews.map((review) => (
                <CompactReviewItem 
                  key={review.id} 
                  review={review} 
                  onAction={onClose}
                />
              ))}
              {/* Temporary spacer to allow the latest reviews to scroll to the top upon opening */}
              {spacerHeight > 0 && <div className="shrink-0" style={{ height: `${spacerHeight}px` }} />}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Aún no hay valoraciones</h3>
              <p className="text-slate-500 max-w-xs mx-auto">
                Este vendedor no tiene reseñas todavía. ¡Sé el primero en comprarle y valorar su servicio!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
