import React from 'react';
import { StarRating } from '../StarRating';
import type { ReviewStats } from '../../types/reviewTypes';

interface ReviewsSummaryProps {
  stats: Pick<ReviewStats, 'reviewAvg' | 'totalReviews'>;
  className?: string;
}

export const ReviewsSummary: React.FC<ReviewsSummaryProps> = ({ stats, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 ${className}`}>
      <StarRating rating={stats.reviewAvg} showText={false} size="sm" />
      <span className="font-bold text-slate-700 text-sm">{stats.reviewAvg.toFixed(1)}</span>
      <span className="text-slate-400 text-xs font-medium">•</span>
      <span className="text-slate-600 text-xs font-semibold">{stats.totalReviews} valoraciones</span>
    </div>
  );
};
