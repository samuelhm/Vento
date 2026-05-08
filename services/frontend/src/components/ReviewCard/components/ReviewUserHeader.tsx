import React from 'react';
import { Link } from 'react-router';
import AvatarInitials from '../../AvtarCss';
import { formatMemberDuration } from '../../../utils/dateUtils';

interface ReviewUserHeaderProps {
  buyerId: string;
  buyerName: string;
  buyerAvatar?: string;
  buyerSince?: string;
  onClick?: () => void;
}

export const ReviewUserHeader: React.FC<ReviewUserHeaderProps> = ({ 
  buyerId, 
  buyerName, 
  buyerAvatar, 
  buyerSince,
  onClick
}) => {
  const apiBaseUrl = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "");
  const avatarUrl = buyerAvatar ? `${apiBaseUrl}/media/${buyerAvatar}` : null;

  return (
    <div className="flex items-center gap-3 mb-2 shrink-0">
      <Link 
        to={`/user/${buyerId}`} 
        className="shrink-0 transition-opacity hover:opacity-80"
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick();
        }}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={buyerName} className="w-9 h-9 rounded-full object-cover shadow-sm" />
        ) : (
          <AvatarInitials name={buyerName} size={36} />
        )}
      </Link>
      <div className="min-w-0">
        <Link 
          to={`/user/${buyerId}`} 
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick();
          }}
          className="font-bold text-slate-800 hover:text-primary transition-colors block leading-tight truncate text-sm"
        >
          {buyerName}
        </Link>
        <span className="text-[11px] text-slate-400 font-medium">
          {formatMemberDuration(buyerSince)}
        </span>
      </div>
    </div>
  );
};
