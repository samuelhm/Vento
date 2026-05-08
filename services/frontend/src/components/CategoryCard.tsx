interface CategoryCardProps {
  title: string;
  altText: string;
  totalAds: number;
  imageUrl: string;
  onClick?: () => void;
}


export const CategoryCard = ({ title, altText, totalAds, imageUrl, onClick }: CategoryCardProps) => {
  return (
    <div
    onClick={onClick}
    className="
      group relative flex flex-col w-full 
      bg-white 
      rounded-xl
      cursor-pointer 
      border border-slate-100
      transition-all duration-50
      sm:hover:-translate-y-1
    "
  >
      <div className="
        flex items-center justify-center 
        h-52 w-full 
        mb-3 
        overflow-hidden 
        bg-slate-50 
        rounded-t-xl
      ">
        <img 
          src={imageUrl} 
          alt={altText} 
          className="
            h-48 w-42 
            object-contain 
          " 
          loading="lazy"
        />
      </div>

      <div className="flex flex-col items-start pb-2 px-2">
        <h3 className="text-slate-900 font-bold text-[12px]">
          <span className="absolute inset-0" aria-hidden="true"></span>
          {title}
        </h3>
        <span className="text-slate-400 text-[10px] font-bold">
          {new Intl.NumberFormat('es-ES').format(totalAds)} {totalAds === 1 ? 'anuncio' : 'anuncios'}
        </span>
      </div>
    </div>
  );
};