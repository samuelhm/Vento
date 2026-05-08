import { useNavigate } from "react-router";
import logo from "../../../assets/images/logo/vento-name-small.webp";

export const SafetyTips = () => {
  const navigate = useNavigate();

  const safetyGuidelines = [
    {
      title: "1. Transacciones Presenciales",
      desc: "Recomendamos encarecidamente realizar los intercambios en persona. Elija lugares públicos con afluencia de gente, como cafeterías, estaciones de transporte o zonas comunes. Evite lugares privados o poco iluminados."
    },
    {
      title: "2. Verificación del Producto",
      desc: "Inspeccione minuciosamente el artículo antes de proceder al pago. En el caso de dispositivos electrónicos, verifique su encendido y funciones básicas. Compruebe que el estado físico se corresponde fielmente con la descripción del anuncio."
    },
    {
      title: "3. Métodos de Pago",
      desc: "No realice pagos por adelantado bajo ningún concepto (reservas, señales o fianzas). El método más seguro es el pago en efectivo o transferencia instantánea (Bizum) una vez que el producto ha sido revisado y aceptado."
    },
    {
      title: "4. Protección de Datos",
      desc: "Mantenga sus comunicaciones dentro de la plataforma siempre que sea posible. Desconfíe de usuarios que soliciten de forma inmediata su número de teléfono, correo personal o datos bancarios fuera del contexto de la transacción."
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
            Protocolo de Seguridad y Buenas Prácticas
          </h1>
          <p className="text-slate-500 leading-relaxed">
            La seguridad en Vento es una responsabilidad compartida. Este documento detalla las normas de conducta obligatorias para garantizar una experiencia segura entre particulares.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-6 mb-12 rounded-lg text-sm">
          <p className="leading-relaxed text-slate-600">
            <strong className="text-slate-900">Nota legal:</strong> Vento actúa exclusivamente como un tablón de anuncios técnico. No intervenimos, garantizamos ni nos hacemos responsables de las transacciones, pagos o envíos acordados entre los usuarios.
          </p>
        </div>

        <div className="space-y-12">
          {safetyGuidelines.map((guideline, i) => (
            <section key={i} className="group">
              <h3 className="text-lg font-bold text-slate-900 mb-3 border-l-2 border-[var(--color-primary)] pl-4">
                {guideline.title}
              </h3>
              <p className="text-slate-600 leading-relaxed pl-5 text-base">
                {guideline.desc}
              </p>
            </section>
          ))}
        </div>

        <section className="mt-20 pt-12 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Indicadores de Fraude</h2>
          <ul className="space-y-4">
            {[
              "Solicitud de pagos previos al encuentro físico.",
              "Vendedores que se encuentran en el extranjero o alegan imposibilidad de reunión.",
              "Precios significativamente inferiores al valor de mercado.",
              "Uso de servicios de mensajería externos no oficiales para gestionar pagos."
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                <span className="text-red-500 mt-1">•</span>
                {text}
              </li>
            ))}
          </ul>
        </section>
        <div className="text-center mt-24 p-8 bg-[var(--color-primary-dark)] rounded-xl text-white">
          <h3 className="text-lg font-bold mb-2">Notificar actividad sospechosa</h3>
          <p className="text-white text-sm mb-6">
            Si ha detectado un perfil fraudulento o ha sido víctima de una mala práctica, por favor, póngase en contacto con nosotros para proceder al bloqueo de la cuenta.
          </p>
          <button 
            onClick={() => navigate('/help')}
            className="cursor-pointer px-8 py-2 bg-white text-[var(--color-primary)] font-bold rounded-full"
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