import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/header/Header';
import { usePendingAction } from '../hooks/usePendingAction';
import { useEffect } from 'react';

export const ProtectedLayout = () => {
  const { isLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  const { setPendingAction } = usePendingAction();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setPendingAction({
        type: 'REDIRECT_ONLY',
        redirectTo: location.pathname + location.search,
      });
    }
  }, [isLoading, isAuthenticated, location, setPendingAction]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-slate-500">Cargando sesión...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-dvh flex-col">
      <Header />
      <div className="min-h-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
};
