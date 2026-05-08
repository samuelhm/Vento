import { useState } from "react";
import { useNavigate } from "react-router";
import logo from "../../../assets/images/logo/vento-name-small.webp";

export const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState<'sell' | 'buy'>('sell');
  const navigate = useNavigate();

  const steps = {
    sell: [
      {
        number: "01",
        label: "Documentación",
        title: "Captura y Registro",
        desc: "Registre su artículo mediante material gráfico de alta fidelidad. Una representación visual precisa acelera el proceso de validación por parte de los interesados."
      },
      {
        number: "02",
        label: "Valoración",
        title: "Tasación y Publicación",
        desc: "Defina un valor de mercado competitivo y una descripción técnica detallada. En Vento, el proceso de exposición de anuncios es íntegramente gratuito."
      },
      {
        number: "03",
        label: "Cierre",
        title: "Intercambio Directo",
        desc: "Gestione las consultas entrantes y coordine la entrega. Una vez verificado el interés, proceda a la formalización del trato de forma presencial."
      }
    ],
    buy: [
      {
        number: "01",
        label: "Búsqueda",
        title: "Filtrado de Activos",
        desc: "Explore el catálogo utilizando parámetros de proximidad y categoría. Identifique los bienes que mejor se adapten a sus necesidades actuales."
      },
      {
        number: "02",
        label: "Negociación",
        title: "Protocolo de Contacto",
        desc: "Establezca comunicación directa con el titular para resolver dudas técnicas y acordar los términos finales de la adquisición."
      },
      {
        number: "03",
        label: "Adquisición",
        title: "Recepción y Verificación",
        desc: "Coordine el punto de encuentro para la inspección física del artículo. Una vez validado el estado, finalice la transacción con seguridad."
      }
    ]
  };

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <img 
            src={logo} 
            alt="Vento" 
            className="h-8 cursor-pointer" 
            onClick={() => navigate('/')} 
          />
          <button 
            onClick={() => navigate('/')}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-[var(--color-primary)] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Inicio
          </button>
        </div>
      </header>

      <section className="bg-slate-50 border-b border-slate-200 py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">
            Metodología Vento
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tighter">
            ¿Cómo funciona <span className="italic font-light">el ecosistema?</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Un flujo de trabajo optimizado para facilitar la economía circular. 
            Seleccione su perfil de usuario para ver el protocolo de actuación.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex justify-center mb-24">
          <div className="inline-flex p-1 bg-slate-100 rounded-full border border-slate-200">
            <button
              onClick={() => setActiveTab('sell')}
              className={`px-12 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                activeTab === 'sell' 
                ? "bg-[var(--color-primary-dark)] text-white shadow-lg" 
                : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Protocolo Venta
            </button>
            <button
              onClick={() => setActiveTab('buy')}
              className={`px-12 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                activeTab === 'buy' 
                ? "bg-[var(--color-primary-dark)] text-white shadow-lg" 
                : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Protocolo Compra
            </button>
          </div>
        </div>
        <section className="flex justify-center">
        <div className="max-w-3xl grid md:grid-cols-3 gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {steps[activeTab].map((step, index) => (
            <div 
              key={index} 
              className="bg-white p-12 transition-colors duration-500 group"
            >
              <div className="flex justify-between items-start mb-12">
                <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest">{step.label}</span>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-6 leading-tight">
                {step.title}
              </h3>
              
              <div className="w-8 h-px bg-slate-200 mb-6 group-hover:w-full group-hover:bg-[var(--color-primary)] transition-all duration-500"></div>
              
              <p className="text-slate-500 leading-relaxed text-sm font-light">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
        </section>

        <div className="mt-32 text-center border-t border-slate-100 pt-20">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              ¿Listo para integrarse en la comunidad?
            </h2>
            <button 
              onClick={() => navigate(activeTab === 'sell' ? '/my-products/new' : '/search')}
              className="px-14 py-4 bg-slate-800 text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-[var(--color-primary-dark)] transition-all shadow-xl shadow-slate-200 cursor-pointer"
            >
              {activeTab === 'sell' ? "Iniciar Publicación" : "Consultar Catálogo"}
            </button>
          </div>
        </div>
      </main>

 <footer className="py-6 text-center text-slate-400 text-[10px] uppercase tracking-[0.4em] bg-white border-t border-slate-50">
        © 2026 Vento - Campus 42 Barcelona
      </footer>
    </div>
  );
};