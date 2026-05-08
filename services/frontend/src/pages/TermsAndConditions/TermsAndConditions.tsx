import { useNavigate } from "react-router";
import logo from "../../../assets/images/logo/vento-name-small.webp";

export const TermsAndConditions = () => {
  const navigate = useNavigate();

  const termCards = [
    {
      id: "01",
      title: "Ámbito de Aplicación",
      content: "Vento es un entorno de pruebas académico gestionado por estudiantes de Campus 42. El servicio se ofrece 'tal cual' para facilitar el intercambio entre particulares sin fines de lucro."
    },
    {
      id: "02",
      title: "Estatus del Usuario",
      content: "El acceso requiere ser mayor de edad. Cada usuario es responsable único de la veracidad de su perfil y de mantener la confidencialidad de su acceso a la plataforma."
    },
    {
      id: "03",
      title: "Exención de Comisiones",
      content: "La plataforma es 100% gratuita. Vento no aplica tarifas por publicación, venta o destacados. Cualquier transacción económica es ajena a la infraestructura de la web."
    },
    {
      id: "04",
      title: "Responsabilidad Civil",
      content: "Vento no garantiza la calidad, seguridad o legalidad de los artículos anunciados. La responsabilidad recae íntegramente en las partes que formalizan el intercambio."
    }
  ];

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
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
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4 italic">
            Terminos y Condiciones          </h1>
          <p className="text-slate-500 text-sm leading-relaxed border-l border-slate-200 pl-6">
            Al utilizar los servicios de Vento, usted acepta quedar vinculado por los siguientes términos. 
            Este documento constituye el contrato legal entre el usuario y la plataforma académica.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-20">
          {termCards.map((term) => (
            <div 
              key={term.id} 
              className="group p-8 border border-slate-100 bg-slate-50/30 rounded-2xl hover:border-[var(--color-primary)]/30 transition-all duration-100"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4">{term.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {term.content}
              </p>
            </div>
          ))}
        </div>

        <section className="max-w-3xl border-t border-slate-100 pt-16">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-10">Política de Contenido Prohibido</h2>
          <div className="space-y-4">
            {[
              "Cualquier forma de fraude o engaño en las descripciones.",
              "Venta de artículos prohibidos por la legislación local o nacional.",
              "Suplantación de identidad de otros estudiantes o entidades.",
              "Interferir con el correcto funcionamiento técnico de la plataforma."
            ].map((text, i) => (
              <div key={i} className="flex gap-4 text-sm text-slate-600 items-start">
                <span className="text-[var(--color-primary)] font-bold">0{i+1}.</span>
                <p className="leading-tight">{text}</p>
              </div>
            ))}
          </div>
        </section>
        <div className="text-center max-w-3xl mx-auto px-6 py-16 mt-24 p-8 bg-[var(--color-primary-dark)] rounded-xl text-white">
          <h3 className="text-lg font-bold mb-2">Finalización del Acuerdo</h3>
          <p className="text-white text-sm mb-6">
          Si no está de acuerdo con alguna de estas cláusulas, por favor cese el uso de la plataforma de inmediato.
          </p>
          <button 
            onClick={() => navigate('/safetytips')}
            className="cursor-pointer px-8 py-2 bg-white text-[var(--color-primary)] font-bold rounded-full"
          >
            Contactar con Soporte
          </button>
        </div>
      </main>

      <footer className="py-6 text-center text-slate-400 text-[10px] uppercase tracking-[0.4em] bg-white border-t border-slate-50">
        © 2026 Vento - Campus 42 Barcelona
      </footer>
    </div>
  );
};