import React from 'react';
import { StarRating } from '../StarRating';
import { formatRelativeDate } from '../../utils/dateUtils';

interface ReviewMetaProps {
  stars: number;
  createdAt: string;
  containerClassName?: string;
  dateClassName?: string;
}

export const ReviewMeta: React.FC<ReviewMetaProps> = ({
  stars,
  createdAt,
  containerClassName = 'flex items-center gap-2 mb-2 shrink-0',
  dateClassName = 'text-[11px] text-slate-400 font-semibold italic',
}) => {
  return (
    <div className={containerClassName}>
      <StarRating rating={stars} showText={false} size="sm" />
      <span className={dateClassName}>
        {formatRelativeDate(createdAt)}
      </span>
    </div>
  );
};
