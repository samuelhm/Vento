import type { Message } from "../../components/chat/ChatWindow";

export interface InboxChat {
  id: string;
  productId: string;
  productUserId: string;
  contactName: string;
  avatar?: string;
  productName: string;
  productImage?: string;
  productPhotoPath?: string;
  productPrice: string;
  productState: "pending" | "reserved" | "sold" | "cancelled" | "active" | "inactive";
  productReviewAvg: number;
  productCity?: string;
  productLatitude: number;
  productLongitude: number;
  lastMessage?: string;
  productDescription?: string;
}

export interface ChatSummary {
  id: string;
  buyerId: string;
  productOwner: string;
  productId: string;
  messages?: Array<{ content?: string }>;
}

export interface UserProfileResponse {
  user?: {
    name?: string;
    last_names?: string;
    avatar_url?: string;
    avatarUrl?: string;
    avatar?: string;
  };
  data?: {
    name?: string;
    last_names?: string;
    avatar_url?: string;
    avatarUrl?: string;
    avatar?: string;
  };
  name?: string;
  last_names?: string;
  avatar_url?: string;
  avatarUrl?: string;
  avatar?: string;
}

export interface ProductDetailsResponse {
  data?: {
    id?: string;
    userId?: string;
    user_id?: string;
    title?: string;
    description?: string;
    price?: string | number;
    state?: string;
    reviewAvg?: number;
    city?: string;
    latitude?: number;
    longitude?: number;
    lat?: number;
    lng?: number;
    location?: {
      city?: string;
      latitude?: number;
      longitude?: number;
      lat?: number;
      lng?: number;
    };
    address?: {
      city?: string;
      municipality?: string;
      town?: string;
    };
    photos?: Array<{ path: string }>;
  };
}

export interface ChatMessageApi {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  read?: boolean;
}

export interface IncomingSocketMessage {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
}

export interface UseInboxReturn {
  inbox: InboxChat[];
  setActiveChatId: (id: string | null) => void;
  activeChatId: string | null;
}

export interface UseChatReturn {
  messages: Message[];
  handleSendMessage: (text: string) => void;
}
