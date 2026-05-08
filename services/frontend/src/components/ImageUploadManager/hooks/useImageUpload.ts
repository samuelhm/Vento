import { useState, useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import type { UploadedImage } from '../types';

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

export const useImageUpload = (
  initialExistingImages: string[] = [],
  onImagesChange?: (images: UploadedImage[]) => void,
  maxFiles: number = 10
) => {
  const apiBaseUrl = useMemo(
    () => (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, ""),
    []
  );

  const [images, setImages] = useState<UploadedImage[]>(() =>
    initialExistingImages.map((path) => ({
      id: path,
      previewUrl: `${apiBaseUrl}/media/${path}`,
      existingPath: path,
    }))
  );

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    onImagesChange?.(images);
  }, [images, onImagesChange]);

  const addFiles = useCallback((incomingFiles: File[]) => {
    setImages((prev) => {
      const remainingSlots = maxFiles - prev.length;
      if (remainingSlots <= 0) return prev;

      const filesToProcess = incomingFiles.slice(0, remainingSlots);
      const newItems: UploadedImage[] = filesToProcess.map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        previewUrl: URL.createObjectURL(file),
        file,
      }));

      const acceptedItems: UploadedImage[] = [];
      let rejectedOversizeCount = 0;

      newItems.forEach((item) => {
        if ((item.file?.size ?? 0) > MAX_IMAGE_SIZE_BYTES) {
          rejectedOversizeCount += 1;
          URL.revokeObjectURL(item.previewUrl);
          return;
        }

        acceptedItems.push(item);
      });

      if (rejectedOversizeCount > 0) {
        toast.warning('imagen demasiado grande');
      }

      return [...prev, ...acceptedItems];
    });
  }, [maxFiles]);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const item = prev.find((img) => img.id === id);
      if (item?.file) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return prev.filter((img) => img.id !== id);
    });
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const moveImage = useCallback((fromId: string, toId: string) => {
    setImages((prev) => {
      const oldIndex = prev.findIndex((img) => img.id === fromId);
      const newIndex = prev.findIndex((img) => img.id === toId);

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return prev;
      }

      const newImages = [...prev];
      const [movedItem] = newImages.splice(oldIndex, 1);
      newImages.splice(newIndex, 0, movedItem);
      return newImages;
    });
  }, []);

  const handleSelect = useCallback((id: string) => {
    if (selectedId === id) {
      setSelectedId(null);
    } else if (selectedId) {
      moveImage(selectedId, id);
      setSelectedId(null);
    } else {
      setSelectedId(id);
    }
  }, [selectedId, moveImage]);

  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.file) URL.revokeObjectURL(img.previewUrl);
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    images,
    addFiles,
    removeImage,
    moveImage,
    draggedId,
    setDraggedId,
    selectedId,
    handleSelect,
  };
};
