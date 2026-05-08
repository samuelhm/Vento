import { useNavigate } from "react-router";

export const ActionSection = () => {

const navigate = useNavigate();


  return (
    <section className="mx-auto max-w-5xl px-6 py-12 bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col justify-between p-8 rounded-[2rem] bg-[var(--color-primary-dark)] border border-[#e6f4ea] sm:max-h-[250px]">
          <div className="space-y-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm text-[var(--color-primary)]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-white">Vender en Vento</h3>
              <p className="text-white/90 leading-snug max-w-[260px] text-sm">
                Publica lo que ya no usas y conecta con personas cerca de ti.
              </p>
            </div>
          </div>

          <button 
            onClick={() => navigate('/my-products/new')}
            className="mt-6 cursor-pointer flex items-center justify-center w-fit px-6 py-2.5 rounded-full bg-white text-[var(--color-primary-dark)] text-sm font-bold"
          >
            Subir un anuncio 
          </button>
        </div>

        <div className="group relative flex flex-col justify-between p-8 rounded-[2rem] bg-[#f8fafc] border border-[#f1f5f9] sm:max-h-[250px] overflow-hidden ">
          
          <div className="absolute -right-16 -bottom-16 w-64 h-64 pointer-events-none z-0">
            <div className="absolute inset-0 bg-[var(--color-primary)] rounded-full opacity-10" />
            
            <div className="absolute right-10 bottom-10 w-40 h-40 bg-[var(--color-primary)] rounded-full opacity-10" />
            
            <div className="absolute right-20 bottom-20 w-32 h-32 border-2 border-[var(--color-primary)] rounded-[3rem] opacity-5 rotate-12 " />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.048 8.287 8.287 0 0 0 9 9.6a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
              </svg>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-lg text-gray-900">Segunda Vida</h3>
              <p className="text-gray-600 leading-snug max-w-[260px] text-sm">
                Creemos en un consumo responsable. Cada objeto reutilizado ayuda al planeta.
              </p>
            </div>
          </div>

          <button 
            onClick={() => navigate('/about')}
            className="relative cursor-pointer z-10 mt-6 flex items-center justify-center w-fit px-6 py-2.5 rounded-full bg-gray-900 text-white text-sm font-bold"
          >
            Nuestra historia
          </button>
        </div>

      </div>
    </section>
  );
};