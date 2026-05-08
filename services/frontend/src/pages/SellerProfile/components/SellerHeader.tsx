import { StarRating } from '../../../components/StarRating';
import type { SellerInfo } from '../types';
import type { ReviewStats } from '../../../types/reviewTypes';

interface SellerHeaderProps {
  seller: SellerInfo;
  stats: ReviewStats;
  onOpenReviews?: () => void;
}

export const SellerHeader = ({ seller, stats, onOpenReviews }: SellerHeaderProps) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 md:p-5 flex flex-col md:flex-row items-center md:items-start gap-4 mb-5">
    {/* Avatar */}
    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-4xl shadow-inner border border-primary/20">
      {seller.name.charAt(0).toUpperCase()}
    </div>

    {/* Seller Info */}
    <div className="flex-1 text-center md:text-left flex flex-col justify-center">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
        {seller.name}
      </h1>

      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-600 mb-4">
        {/* Rating Stars - Clickable to open reviews modal */}
        <button 
          type="button"
          onClick={onOpenReviews}
          disabled={!onOpenReviews}
          className="flex items-center gap-1 hover:opacity-80 transition-opacity disabled:opacity-100 disabled:cursor-default cursor-pointer group/rating"
        >
          <StarRating 
            rating={stats.reviewAvg} 
            totalReviews={stats.totalReviews} 
            size="md"
          />
          {/* El StarRating ya tiene un texto con el total, pero podemos añadir un pequeño efecto hover si es necesario */}
        </button>

        <span className="hidden md:inline text-slate-300">•</span>

        {/* Location */}
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span>{seller.location}</span>
        </div>

        <span className="hidden md:inline text-slate-300">•</span>

        {/* Member Since */}
        <span>{seller.memberSince}</span>
      </div>
    </div>
  </div>
);
