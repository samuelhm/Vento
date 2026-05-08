import { useNavigate } from 'react-router';
import logo from '../../../assets/images/logo/vento-name-small.webp';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <section className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl p-8 md:p-10 text-center shadow-sm">
        <img
          src={logo}
          alt="Vento"
          className="h-8 mx-auto mb-8 cursor-pointer"
          onClick={() => navigate('/')}
        />

        <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 mb-3">ERROR 404</p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Página no encontrada</h1>
        <p className="text-slate-600 mb-8">
          La ubicación que intentas abrir no existe o fue movida.
        </p>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="cursor-pointer inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          Volver al inicio
        </button>
      </section>
    </main>
  );
};