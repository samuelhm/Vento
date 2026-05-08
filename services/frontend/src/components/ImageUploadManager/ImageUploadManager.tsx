import { useRef } from 'react';
import { ButtonPrimary } from '../ButtonPrimary';
import { ImageItem } from './components/ImageItem';
import { useImageUpload } from './hooks/useImageUpload';
import type { ImageUploadManagerProps } from './types';

export const ImageUploadManager = ({
  initialExistingImages = [],
  onImagesChange,
  maxFiles = 10,
}: ImageUploadManagerProps) => {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  
  const {
    images,
    addFiles,
    removeImage,
    moveImage,
    draggedId,
    setDraggedId,
    selectedId,
    handleSelect,
  } = useImageUpload(initialExistingImages, onImagesChange, maxFiles);

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const incomingFiles = Array.from(event.target.files ?? []);
    if (incomingFiles.length > 0) {
      addFiles(incomingFiles);
    }
    event.target.value = '';
  };

  const handleDrop = (targetId: string) => {
    if (draggedId && draggedId !== targetId) {
      moveImage(draggedId, targetId);
    }
    setDraggedId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700">
          Imágenes ({images.length}/{maxFiles})
        </label>
        {images.length < maxFiles && (
          <ButtonPrimary
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="h-9 px-4 text-xs bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Añadir imágenes
          </ButtonPrimary>
        )}
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFilesChange}
        className="sr-only"
      />

      {images.length === 0 ? (
        <div 
          onClick={() => imageInputRef.current?.click()}
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-10 transition hover:border-slate-300 hover:bg-slate-100 cursor-pointer"
        >
          <div className="rounded-full bg-white p-3 shadow-sm mb-3">
            <CameraIcon className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-600">Haz clic para subir fotos</p>
          <p className="text-xs text-slate-400 mt-1">Formatos: JPG, PNG, WEBP (Máx. 2MB)</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image, index) => (
            <ImageItem
              key={image.id}
              image={image}
              index={index}
              isDragged={draggedId === image.id}
              isSelected={selectedId === image.id}
              onRemove={removeImage}
              onDragStart={() => setDraggedId(image.id)}
              onDrop={() => handleDrop(image.id)}
              onDragEnd={() => setDraggedId(null)}
              onClick={() => handleSelect(image.id)}
            />
          ))}
        </div>
      )}

      {images.length > 1 && (
        <p className="text-center text-xs text-slate-400 italic">
          {selectedId 
            ? "Toca otra imagen para moverla aquí" 
            : "Arrastra para ordenar o toca una imagen para moverla."}
        </p>
      )}
    </div>
  );
};

const CameraIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15a2.25 2.25 0 0 0 2.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169a48.324 48.324 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
    />
  </svg>
);
