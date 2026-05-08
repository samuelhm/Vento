import { useNavigate } from "react-router";
import logo from "../../../assets/images/logo/vento-name-small.webp";

export const Rules = () => {
  const navigate = useNavigate();

  const regulatoryPoints = [
    {
      title: "1. Disposiciones Generales",
      desc: "Vento es una plataforma tecnológica de publicación de anuncios operada bajo un modelo académico en el entorno de Campus 42 Barcelona. El uso de la plataforma implica la aceptación vinculante de estas cláusulas."
    },
    {
      title: "2. Requisitos de Usuario",
      desc: "Los usuarios deben poseer capacidad legal para contraer obligaciones. Toda información proporcionada en el registro debe ser exacta y veraz. El titular es el único responsable de la custodia de sus credenciales de acceso."
    },
    {
      title: "3. Restricciones de Contenido",
      desc: "Queda estrictamente prohibida la publicación de anuncios relacionados con sustancias ilícitas, armas, falsificaciones, medicamentos bajo prescripción o cualquier contenido que vulnere la propiedad intelectual."
    },
    {
      title: "4. Régimen de Responsabilidad",
      desc: "Vento no interviene, garantiza ni se hace responsable de la calidad de los artículos ni del cumplimiento de los pagos. Las transacciones se perfeccionan exclusivamente entre particulares de forma externa."
    }
  ];

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <img 
            src={logo} 
            alt="Logo de Vento" 
            className="h-8 cursor-pointer" 
            onClick={() => navigate('/')} 
          />
          <button 
            onClick={() => navigate('/')}
            className="text-sm font-bold text-gray-600 hover:text-[var(--color-primary)] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="border-b border-slate-100 pb-10 mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
            Términos de Servicio y Normativa
          </h1>
          <p className="text-slate-500 leading-relaxed">
            Este documento rige el marco legal y las normas de convivencia de la comunidad Vento. El cumplimiento de estas reglas es obligatorio para todos los usuarios.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-6 mb-12 rounded-lg text-sm">
          <p className="leading-relaxed text-slate-600">
            <strong className="text-slate-900">Última actualización:</strong> Abril 2026. Vento se reserva el derecho de modificar estas condiciones para adaptar la plataforma a nuevas normativas académicas o legales.
          </p>
        </div>

        <div className="space-y-12">
          {regulatoryPoints.map((point, i) => (
            <section key={i} className="group">
              <h3 className="text-lg font-bold text-slate-900 mb-3 border-l-2 border-[var(--color-primary)] pl-4">
                {point.title}
              </h3>
              <p className="text-slate-600 leading-relaxed pl-5 text-base">
                {point.desc}
              </p>
            </section>
          ))}
        </div>

        <section className="mt-20 pt-12 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Artículos Prohibidos</h2>
          <ul className="space-y-4">
            {[
              "Sustancias estupefacientes e ilegales.",
              "Armas de fuego, blancas o material explosivo.",
              "Réplicas, falsificaciones o productos sin licencia.",
              "Medicamentos o productos sanitarios regulados.",
              "Servicios de naturaleza fraudulenta o engañosa."
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                <span className="text-red-500 mt-1">•</span>
                {text}
              </li>
            ))}
          </ul>
        </section>

        <div className="text-center mt-24 p-8 bg-[var(--color-primary-dark)] rounded-xl text-white">
          <h3 className="text-lg font-bold mb-2">¿Dudas sobre el reglamento?</h3>
          <p className="text-white text-sm mb-6">
            Si tiene alguna consulta técnica o legal sobre estas normas, puede consultar nuestro centro de documentación oficial.
          </p>
          <button 
            onClick={() => navigate('/help')}
            className="cursor-pointer px-8 py-2 bg-white text-[var(--color-primary)] font-black rounded-full"
          >
            Centro de Ayuda
          </button>
        </div>
      </main>

      <footer className="py-6 text-center text-slate-400 text-[10px] uppercase tracking-[0.4em] bg-white border-t border-slate-50">
        © 2026 Vento - Campus 42 Barcelona
      </footer>
    </div>
  );
};