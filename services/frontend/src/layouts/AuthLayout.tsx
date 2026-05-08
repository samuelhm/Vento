import { Navigate, Outlet, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { usePendingAction } from "../hooks/usePendingAction";

export const AuthLayout = () => {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { getPendingAction } = usePendingAction();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-slate-500">Cargando sesión...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    const pendingAction = getPendingAction();
    const redirectTo = pendingAction?.redirectTo || "/profile";
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-12">
        <div className="relative w-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Cerrar"
            className="absolute right-4 top-4 text-2xl leading-none text-slate-400 transition-colors hover:text-slate-700"
          >
            ×
          </button>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
