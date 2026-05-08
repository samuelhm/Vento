import { useNavigate, Link, useLocation } from "react-router";
import { useAuth } from "../../contexts/AuthContext";


export const User = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading} = useAuth();
  const apiBaseUrl = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '');
  const avatarUrl = user?.avatarUrl ? `${apiBaseUrl}/media/${user.avatarUrl}` : null;
  const fullName = `${user?.name.split(" ")[0] ?? ''} ${user?.lastNames.split(" ")[0] ?? ''}`.trim() || 'Usuario';

  const handleLogin = () => {
    navigate("/login", { state: { from: location.pathname + location.search } });
  };

  const handleRegister = () => {
    navigate("/register", { state: { from: location.pathname + location.search } });
  };


  if (isLoading) {
    return (
      <button
        type="button"
        disabled
        className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-500"
      >
        Cargando...
      </button>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleLogin}
          className="cursor-pointer flex items-center hidden md:block rounded-full h-8 border border-[var(--color-primary)] border-2 px-3 text-md font-medium font-semi-bold transition hover:border-[var(--color-primary-light)]"
        >
          Iniciar Sesión
        </button>
        <button
          type="button"
          onClick={handleRegister}
          className="cursor-pointer hidden md:block rounded-full h-8 px-3 text-md font-medium font-bold text-white transition bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)]"
        >
          Registrarse
        </button>

        <div className="md:hidden">
          <Link
            to="/login"
            state={{ from: location.pathname + location.search }}
            aria-label="Ir a iniciar sesión"
          >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 w-14 h-10 text-[var(--color-primary)]">
        <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
         </svg>
         </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link to="/profile" className="flex items-center gap-2 mx-2 transition hover:opacity-80">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`Avatar de ${user?.name ?? 'Usuario'}`}
            className="h-9 w-9 rounded-full object-contain"
          />
        ) :
        (
          <div
            className={`flex h-10 w-10 rounded-full items-center  justify-center bg-primary/10 font-bold text-primary transition-all duration-300"
            }`}
          >
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
        )
      }
        <span className="hidden text-sm font-medium text-slate-700 sm:inline">
          {fullName ?? 'Usuario'}
        </span>
      </Link>
    </div>
  );
};
