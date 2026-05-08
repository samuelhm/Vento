import React, { useState, useRef, useEffect } from 'react';
import { ReviewMeta } from '../../ReviewMeta';

interface ReviewContentProps {
  stars: number;
  createdAt: string;
  reviewText?: string;
  onReadMore?: () => void;
}

export const ReviewContent: React.FC<ReviewContentProps> = ({ stars, createdAt, reviewText, onReadMore }) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        // Añadimos 5px de tolerancia para evitar falsos positivos por letras con descendentes (p, g, y)
        setIsTruncated(textRef.current.scrollHeight > textRef.current.clientHeight + 5);
      }
    };
    const timeoutId = setTimeout(checkTruncation, 150);
    window.addEventListener('resize', checkTruncation);
    return () => {
      window.removeEventListener('resize', checkTruncation);
      clearTimeout(timeoutId);
    };
  }, [reviewText]);

  return (
    <div className="flex flex-col min-h-0">
      <ReviewMeta
        stars={stars}
        createdAt={createdAt}
      />

      {/* Body Text */}
      <div className="text-slate-700 text-[13px] md:text-[14px] leading-[1.35] h-[56px] md:h-[60px] overflow-hidden">
        {reviewText ? (
          <div className="h-full flex flex-col justify-between">
            <div className="h-[2.7em] overflow-hidden">
              <p 
                className="leading-[1.35]"
                ref={textRef}
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                "{reviewText}"
              </p>
            </div>
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onReadMore) onReadMore();
              }}
              className={`mt-0.5 text-xs font-bold text-primary leading-4 h-4 text-left hover:underline transition-all ${isTruncated ? 'opacity-100 cursor-pointer' : 'opacity-0 pointer-events-none'}`}
              disabled={!isTruncated}
            >
              Leer reseña completa
            </button>
          </div>
        ) : (
          <div className="h-full" />
        )}
      </div>
    </div>
  );
};
