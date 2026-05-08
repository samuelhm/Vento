import { useMemo, useState, ReactNode } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import type { AuthUser } from '../../../types/userTypes';
import { ProductsIcon, FavoritesIcon, ChatIcon, PurchasesIcon, SalesIcon, ReviewsIcon, ProfileIcon } from '../icons/SidebarIcons';


interface SidebarLink {
  name: string;
  path: string;
  icon: ReactNode;
  disabled?: boolean;
}

interface UserSidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
  currentAvatarUrl: string | null;
  links: SidebarLink[]; 
  logout: () => void;
  user: AuthUser | null;
}

export const useUserSidebar = (): UserSidebarProps => {
  const { user, logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const toggleSidebar = () => setIsExpanded(prev => !prev);
  const apiBaseUrl = useMemo(
    () => (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, ''),
    []
  );

  const currentAvatarUrl = user?.avatarUrl
    ? `${apiBaseUrl}/media/${user.avatarUrl}`
    : null;

const links: SidebarLink[] = [
    { name: 'Mis productos', path: '/my-products', icon: <ProductsIcon /> },
    { name: 'Favoritos', path: '/favorites', icon: <FavoritesIcon /> },
    { name: 'Chat', path: '/chat', icon: <ChatIcon /> },
    { name: 'Compras', path: '/my-purchases', icon: <PurchasesIcon /> },
    { name: 'Ventas', path: '/my-sales', icon: <SalesIcon /> },
    { name: 'Valoraciones', path: '/my-reviews', icon: <ReviewsIcon /> },
    { name: 'Perfil', path: '/profile', icon: <ProfileIcon /> },
  ];


  return {
    isExpanded,
    toggleSidebar,
    currentAvatarUrl,
    links,
    logout,
    user,
  };
};
