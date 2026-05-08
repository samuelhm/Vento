import React from 'react';
import { Link } from 'react-router';

interface ReviewProductAttachmentProps {
  listingId: string;
  title: string;
  imagePath?: string;
  categoryName?: string;
  isSmall?: boolean;
}

export const ReviewProductAttachment: React.FC<ReviewProductAttachmentProps> = ({ 
  listingId, 
  title, 
  imagePath, 
  categoryName,
  isSmall = false
}) => {
  const apiBaseUrl = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "");
  const productImageUrl = imagePath ? `${apiBaseUrl}/media/${imagePath}` : null;

  return (
    <Link 
      to={`/product/${listingId}`}
      onClick={(e) => e.stopPropagation()}
      className={`flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-slate-50 transition-colors w-full group/product ${isSmall ? 'p-2' : 'p-2.5'}`}
    >
      {/* Product Image - Responsive Size */}
      <div className={`${isSmall ? 'w-12 h-12' : 'w-14 h-14 md:w-20 md:h-20'} rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-white shadow-sm transition-all`}>
        {productImageUrl ? (
          <img src={productImageUrl} alt={title} className="w-full h-full object-cover group-hover/product:scale-110 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xl md:text-3xl">📦</div>
        )}
      </div>

      {/* Info Column */}
      <div className="min-w-0 flex-1 flex flex-col justify-center py-1">
        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest leading-none mb-1.5">Compró:</span>
        <h5 className={`${isSmall ? 'text-[13px]' : 'text-[13px] md:text-[15px]'} font-bold text-slate-700 group-hover/product:text-primary transition-colors leading-tight line-clamp-2 mb-1`}>
          {title}
        </h5>
        {!isSmall && (
          <p className="text-[11px] md:text-[12px] text-slate-400 font-medium leading-none">
            {categoryName || 'Categoría general'}
          </p>
        )}
      </div>

      {/* Action Icon (Desktop only sutil) */}
      <div className="shrink-0 text-slate-300 group-hover/product:text-primary transition-colors ml-1">
        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
};
