import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { UserSidebar } from '../../components/UserSidebar/UserSidebar';
import { useIsMobile } from '../../hooks/useIsMobile';

export const Dashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) {
      // Redirigir a la primera ruta del UserLayout cuando no es mobile
      navigate('/my-products', { replace: true });
    }
  }, [isMobile, navigate]);

  // No renderizar nada mientras redirige
  if (!isMobile) {
    return null;
  }

  return (
    <div className="flex h-[calc(100vh-179px)] w-full items-center justify-center">
      <UserSidebar />
    </div>
  );
};
