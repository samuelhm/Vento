import { useNavigate } from "react-router";
import logo from "../../../assets/images/logo/vento-name-small.webp";
import { useState, useRef } from "react";

export const Help = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const infoSectionRef = useRef<HTMLDivElement>(null);

  // Función que se ejecuta solo al pulsar Enter o hacer Submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      infoSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const categories = [
    { title: "Gestión de Compras", desc: "Procedimientos de contacto, negociación y cierre de transacciones entre particulares." },
    { title: "Protocolo de Venta", desc: "Normativas de publicación, optimización de anuncios y políticas de visibilidad." },
    { title: "Administración de Cuenta", desc: "Seguridad de credenciales, privacidad y gestión técnica del perfil de usuario." },
    { title: "Logística y Entrega", desc: "Pautas de intercambio físico presencial y recomendaciones de seguridad en envíos." },
  ];

  const faqs = [
    {
      q: "¿Cuál es el coste por transaccionar en la plataforma?",
      a: "Vento opera bajo un modelo de economía circular sin ánimo de lucro dentro del entorno académico. No existen tasas, comisiones ni costes de suscripción."
    },
    {
      q: "¿Cómo se gestionan las disputas entre usuarios?",
      a: "Al ser un servicio de contacto directo, Vento no interviene en las desavenencias comerciales. Recomendamos seguir el Protocolo de Seguridad y verificar el producto antes del pago."
    },
    {
      q: "¿Qué criterios rigen la moderación de contenidos?",
      a: "Todo anuncio debe cumplir con el Marco Legal. Se prohíbe estrictamente la publicación de artículos ilícitos, falsificaciones o servicios no autorizados."
    }
  ];

  return (
    <div className="bg-white min-h-screen text-slate-900">
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

      <section className="bg-slate-50 border-b border-slate-200 py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight text-center">
            Centro de Soporte Técnico
          </h1>
          <p className="text-slate-500 text-center mb-10 text-sm">
            Consulte la documentación oficial para resolver incidencias operativas en la plataforma.
          </p>
          
          <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto">
            <input 
              type="text" 
              placeholder="Escribe sobre tus dudas..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pl-12 border border-slate-300 rounded-lg bg-white shadow-sm focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all text-sm" 
            />
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button type="submit" className="hidden border-none">Ejecutar búsqueda</button>
          </form>
          <p className="text-[10px] text-slate-400 mt-4 text-center uppercase tracking-widest">
            Realiza una pregunta cualquiera.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden">
          {categories.map((cat, i) => (
            <div key={i} className="bg-white p-12 hover:bg-slate-50 transition-colors cursor-default">
              <h3 className="font-bold text-slate-900 mb-4 text-lg flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[var(--color-primary)] rounded-full"></span>
                {cat.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed pl-4.5">{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="max-w-3xl mx-auto px-6 py-6">
        <h2 className="text-xl font-bold text-slate-900 mb-10 pb-4 border-b border-slate-100 uppercase tracking-wider">
          Preguntas Frecuentes
        </h2>

        <div className="space-y-12">
          {faqs.map((faq, i) => (
            <div key={i}>
              <h4 className="text-base font-bold text-slate-900 mb-3">
                {faq.q}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed border-l border-slate-200 pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
        <div className="text-center max-w-3xl mx-auto px-6 py-16 mt-24 p-8 bg-[var(--color-primary-dark)] rounded-xl text-white">
          <h3 className="text-lg font-bold mb-2">¿Persiste su incidencia?</h3>
          <p className="text-white text-sm mb-6">
          Vento Marketplace es un proyecto académico. Actualmente, no contamos con soporte para resolver tus dudas.          </p>
          <button 
            onClick={() => navigate('/safetytips')}
            className="cursor-pointer px-8 py-2 bg-white text-[var(--color-primary)] font-bold rounded-full"
          >
            Consejos de Seguridad
          </button>
        </div>
        <footer className="py-6 text-center text-slate-400 text-[10px] uppercase tracking-[0.4em] bg-white border-t border-slate-50">
        © 2026 Vento - Campus 42 Barcelona
      </footer>
    </div>
  );
};