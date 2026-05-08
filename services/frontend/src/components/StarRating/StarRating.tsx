import React from 'react';
import { StarIcon } from './assets/StarIcon';

interface StarRatingProps {
  rating: number; // 0 a 5
  totalReviews?: number;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  totalReviews,
  showText = true,
  size = 'md',
  className = '',
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

  const starSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const containerSizes = {
    sm: 'gap-0.5',
    md: 'gap-1',
    lg: 'gap-1.5',
  };

  return (
    <div className={`flex items-center ${containerSizes[size]} ${className}`}>
      <div className="flex items-center">
        {/* Full Stars */}
        {[...Array(fullStars)].map((_, i) => (
          <StarIcon key={`full-${i}`} fill="#facc15" className={starSizes[size]} />
        ))}

        {/* Half Star */}
        {hasHalfStar && (
          <div className="relative">
            <StarIcon fill="#d1d5db" className={starSizes[size]} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <StarIcon fill="#facc15" className={starSizes[size]} />
            </div>
          </div>
        )}

        {/* Empty Stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <StarIcon key={`empty-${i}`} fill="#d1d5db" className={starSizes[size]} />
        ))}
      </div>
      
      {showText && (
        <div className="flex items-center gap-1.5 ml-1">
          <span className="font-bold text-slate-700 leading-none">
            {rating.toFixed(1)}
          </span>
          {totalReviews !== undefined && (
            <span className="text-slate-500 text-sm leading-none">
              ({totalReviews} {totalReviews === 1 ? 'valoración' : 'valoraciones'})
            </span>
          )}
        </div>
      )}
    </div>
  );
};
