import { useState } from 'react';
import type { UploadedImage } from '../types';

interface ImageItemProps {
  image: UploadedImage;
  index: number;
  isDragged: boolean;
  isSelected: boolean;
  onRemove: (id: string) => void;
  onDragStart: () => void;
  onDrop: () => void;
  onDragEnd: () => void;
  onClick: () => void;
}

export const ImageItem = ({
  image,
  index,
  isDragged,
  isSelected,
  onRemove,
  onDragStart,
  onDrop,
  onDragEnd,
  onClick,
}: ImageItemProps) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    onDragStart();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragged) setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    onDrop();
  };

  const handleItemClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={() => {
        setIsOver(false);
        onDragEnd();
      }}
      onClick={handleItemClick}
      className={`group relative aspect-square overflow-hidden rounded-xl border bg-slate-100 transition-all duration-200 cursor-pointer ${
        isDragged
          ? "border-primary-light scale-90 opacity-40 ring-2 ring-primary-light ring-offset-2"
          : isSelected
          ? "border-primary scale-105 shadow-[0_0_20px_rgba(0,171,228,0.5)] z-20 ring-4 ring-primary"
          : isOver
          ? "border-primary scale-105 shadow-lg z-10 ring-2 ring-primary"
          : "border-slate-200 hover:border-slate-300 hover:shadow-md"
      }`}
    >
      <img
        src={image.previewUrl}
        alt={`Imagen ${index + 1}`}
        className={`h-full w-full object-cover transition-transform duration-500 pointer-events-none ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}
      />
      
      <div className={`absolute inset-0 transition-colors pointer-events-none ${isSelected ? 'bg-primary/10' : isOver ? 'bg-primary/20' : 'bg-black/0 group-hover:bg-black/5'}`} />

      <div className="absolute left-2 top-2 flex items-center gap-1.5 pointer-events-none">
        <span className={`flex h-6 min-w-[1.5rem] items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white backdrop-blur-sm shadow-sm border ${isSelected ? 'bg-primary border-white' : 'bg-black/60 border-white/10'}`}>
          {index === 0 ? "PORTADA" : index + 1}
        </span>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(image.id);
        }}
        className="absolute right-2 top-2 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm transition-all hover:scale-110 hover:bg-red-500 hover:text-white backdrop-blur-sm border border-slate-200/50"
        aria-label="Eliminar imagen"
      >
        <TrashIcon className="w-3.5 h-3.5" />
      </button>

      {image.existingPath && (
        <div className="absolute bottom-2 left-2 pointer-events-none">
          <span className="inline-block rounded bg-primary-dark/80 px-2 py-0.5 text-[8px] font-bold text-white uppercase tracking-wider backdrop-blur-sm border border-white/10 shadow-sm">
            Existente
          </span>
        </div>
      )}

      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-primary/20 animate-pulse absolute inset-0" />
          <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg border border-white/20">
            SELECCIONADA
          </span>
        </div>
      )}
    </div>
  );
};

const TrashIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    />
  </svg>
);
