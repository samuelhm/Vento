export interface UploadedImage {
  id: string;
  previewUrl: string;
  file?: File;
  existingPath?: string;
}

export interface ImageUploadManagerProps {
  initialExistingImages?: string[];
  onImagesChange?: (images: UploadedImage[]) => void;
  maxFiles?: number;
}
