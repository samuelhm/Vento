import  { useState, useEffect, useCallback} from 'react';
import { useNavigate } from "react-router";

const SLIDES = [
  {
    id: 1,
    title: 'Encuentra lo que necesitas',
    subtitle: 'El mejor mercado de segunda mano en tu bolsillo.',
    cta: 'Comprar',
    link: '/search',
    bgColor: 'bg-teal-500',
    image:
      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'Dale otra oportunidad a tus cosas',
    subtitle: 'Vende lo que no usas en menos de un minuto.',
    cta: 'Vender',
    link: '/my-products/new',
    bgColor: 'bg-indigo-600',
    image:
      'https://images.unsplash.com/photo-1510672277783-ea03bdd8b602?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 3,
    title: 'Compra y vende de forma consciente',
    subtitle: 'Se parte del consumo responsable.',
    cta: 'Vender',
    link: '/my-products/new',
    bgColor: 'bg-indigo-600',
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];
export const HeroSlider = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(timer);
  }, [current, nextSlide]);

  const goToSlide = (index: number) => {
    setCurrent(index);
  };

  return (
    <div className="relative w-full h-[450px] md:h-[400px] overflow-hidden bg-slate-900">
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="absolute inset-0">
            <img src={slide.image} className="w-full h-full object-cover" alt={slide.title} />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="relative z-20 w-full max-w-5xl mx-auto pr-12 pl-24 text-white">
            <div className="flex flex-col justify-end min-h-[220px]"> 
              <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter max-w-2xl">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl mb-8 text-slate-200 max-w-md font-light">
                {slide.subtitle}
              </p>
              
              <div className="h-14 flex items-center">
                <button 
                  onClick={() => navigate(slide.link)} 
                  className="rounded-full h-10 px-6 text-md font-bold text-white transition bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] cursor-pointer"
                >
                  {slide.cta}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
              current === i ? "w-12 bg-white" : "w-3 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
