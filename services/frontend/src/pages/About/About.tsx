import { useNavigate } from "react-router";
import logo from "../../../assets/images/logo/vento-name-small.webp";

export const About = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Proyecto", value: "Campus 42" },
    { label: "Ubicación", value: "Barcelona" },
    { label: "Visión", value: "Circular" },
    { label: "Estado", value: "Beta 2026" },
  ];

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
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
      <section className="relative h-[75vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1567113463300-102a7eb3cb26?q=80&w=2070&auto=format&fit=crop" 
          alt="Equipo Vento" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter">
            Hola, somos <span className="italic font-light">Vento.</span>
          </h1>
          <div className="w-12 h-px bg-[var(--color-primary)] mx-auto mb-8"></div>
          <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto font-light leading-relaxed">
            Redefiniendo el intercambio de objetos para un futuro más <span className="text-white">sostenible, humano y circular.</span>
          </p>
        </div>
      </section>

      <div className="flex justify-center border-b border-slate-100 bg-white">
        <div className="mx-auto px-6 py-8">
          <div className="grid sm:grid-cols-4 grid-cols-2 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center md:text-left">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                <p className="text-sm font-bold text-slate-900 uppercase tracking-tighter">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="max-w-3xl mx-auto px-6 py-32">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-[1.1] tracking-tight">
              Dando una segunda vida <br /> 
              <span className="text-slate-400 font-light italic">a lo que amas.</span>
            </h2>
            <div className="space-y-6 text-slate-500 leading-relaxed text-lg border-l-2 border-slate-100 pl-8">
              <p>
                Vento nació en Barcelona bajo una premisa técnica y social: lo que tú ya no utilizas es el recurso de alguien más. 
              </p>
              <p>
                Desarrollado en el ecosistema de <strong>Campus 42</strong>, este proyecto busca optimizar el flujo de bienes entre particulares, eliminando las fricciones del comercio tradicional y fomentando la reutilización consciente.
              </p>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-2 border border-slate-100 rounded-2xl translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500"></div>
            <div className="relative rounded-xl overflow-hidden shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1699898016940-ac6892b79171?q=80&w=2071&auto=format&fit=crop" 
                alt="Proceso creativo" 
                className="w-full h-[550px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-32 px-6 border-y border-slate-100">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <div className="group">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-primary)] mb-8">
                01 / Nuestra Misión
              </h3>
              <p className="text-2xl text-slate-800 leading-tight font-medium mb-6">
                Construir la infraestructura tecnológica para una economía circular sin fricciones.
              </p>
              <p className="text-slate-500 text-base leading-relaxed">
                Facilitamos el intercambio de bienes de manera segura, eliminando las barreras del comercio tradicional y promoviendo el consumo local dentro de la comunidad.
              </p>
            </div>
            <div className="group">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-primary)] mb-8">
                02 / Nuestra Visión
              </h3>
              <p className="text-2xl text-slate-800 leading-tight font-medium mb-6">
                Transformar la reutilización en la primera opción de consumo global.
              </p>
              <p className="text-slate-500 text-base leading-relaxed">
                Aspiramos a liderar un cambio de paradigma donde cada objeto sea valorado por su utilidad potencial, impactando positivamente en el planeta y en la economía de las personas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 text-center bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-slate-900 mb-10 tracking-tight">
            Únete a la evolución <br/> del <span className="text-[var(--color-primary)]">comercio local.</span>
          </h2>
          <button 
            onClick={() => navigate('/register')}
            className="cursor-pointer px-12 py-4 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[var(--color-primary-dark)] transition-all shadow-xl shadow-slate-200"
          >
            Crear cuenta gratuita
          </button>
        </div>
      </section>

      <footer className="py-6 text-center text-slate-400 text-[10px] uppercase tracking-[0.4em] bg-white border-t border-slate-50">
        © 2026 Vento - Campus 42 Barcelona
      </footer>
    </div>
  );
};