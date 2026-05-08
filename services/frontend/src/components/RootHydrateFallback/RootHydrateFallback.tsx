import ventoLogo from '../../../assets/images/logo/vento-icon.webp';

export const RootHydrateFallback = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-background-soft z-[9999]">
    <div className="relative flex flex-col items-center">
      {/* Círculo de progreso animado alrededor del logo */}
      <div className="absolute -inset-4 rounded-full border-4 border-primary/10 border-t-primary animate-spin"></div>
      
      {/* Logo con pulso suave */}
      <div className="relative h-20 w-20 animate-pulse">
        <img src={ventoLogo} alt="Vento" className="h-full w-full object-contain" />
      </div>

      {/* Marca con tracking ancho y color corporativo dark */}
      <p className="mt-10 text-[10px] font-bold uppercase tracking-[0.4em] text-primary-dark animate-pulse">
        Vento
      </p>
    </div>
  </div>
);
