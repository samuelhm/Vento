import { useState } from "react";
import type { ProductGalleryProps } from "../types";
import { SliderPrev } from "../../../components/Icons/SliderPrev";
import { SliderNext } from "../../../components/Icons/SliderNext";

export const ProductGallery = ({ images, title }: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Main Image View */}
      <div className="w-full aspect-square md:aspect-[4/3] bg-white rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm relative group">
        <img
          src={images[activeIndex]}
          alt={`${title} - Imagen ${activeIndex + 1}`}
          className="w-full h-full object-contain p-4 transition-all duration-300 ease-in-out"
        />
        
        {/* Navigation Arrows (Visible on hover on desktop) */}
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white text-gray-800 transition-all opacity-0 group-hover:opacity-100 active:scale-90"
            >
              <SliderPrev className="w-4 h-4" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white text-gray-800 transition-all opacity-0 group-hover:opacity-100 active:scale-90"
            >
              <SliderNext className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Image Counter Badge */}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-full font-bold tracking-wider">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails Slider */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x px-1">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 transition-all snap-start
                ${activeIndex === index 
                  ? "border-primary ring-4 ring-primary/10 shadow-sm scale-[1.02]" 
                  : "border-transparent hover:border-gray-300 opacity-60 hover:opacity-100"
                }`}
            >
              <img
                src={img}
                alt={`${title} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Active Overlay */}
              {activeIndex === index && (
                <div className="absolute inset-0 bg-primary/5" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
