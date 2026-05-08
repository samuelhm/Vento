export interface RawProduct {
  id: string;
  userId?: string;
  user_id?: string;
  title: string;
  description: string;
  price: string | number;
  state: string;
  reviewAvg?: number;
  createdAt?: string;
  created_at?: string;
  latitude?: number;
  longitude?: number;
  categoryId?: number;
  categorie_id?: number;
  categoryName?: string;
  photos?: { path: string; position: number }[];
}

export interface RawUser {
  id: string;
  name: string;
  email?: string;
  created_at?: string;
  createdAt?: string;
}

export interface ProductDetail {
  id: string;
  title: string;
  description: string;
  priceFormatted: string;
  priceValue: number;
  category: {
    id: number;
    name: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  hasExactLocation: boolean;
  images: string[];
  state: "pending" | "reserved" | "sold" | "cancelled";
  reviewAvg: number;
  seller: {
    id: string;
    name: string;
    memberSince: string;
  };
  createdAtFormatted: string;
}

// Component Props Interfaces
export interface ProductGalleryProps {
  images: string[];
  title: string;
}

export interface ProductDescriptionProps {
  description: string;
}

export interface ProductLocationProps {
  latitude: number;
  longitude: number;
  hasExactLocation: boolean;
}

export interface ProductSidebarInfoProps {
  title: string;
  priceFormatted: string;
  categoryName?: string;
  state: ProductDetail["state"];
}

export interface ProductActionButtonsProps {
  product: ProductDetail;
  onOffer: () => void;
  onContact: () => void;
  isAuthenticated?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onReserve?: () => void;
  onSell?: () => void;
  isCreatingChat: boolean;
  isReserving?: boolean;
  isSelling?: boolean;
  isOwner?: boolean;
  favoritesCount?: number;
}

export interface SaleCandidate {
  id: string;
  name: string;
}

export interface SellerPreviewProps {
  id: string;
  name: string;
  memberSince: string;
}
