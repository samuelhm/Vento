import { Link } from "react-router";
import { SliderNext } from "../../../components/Icons/SliderNext";

interface BreadcrumbsProps {
  category: {
    id: number;
    name: string;
  };
  productTitle: string;
}

export const Breadcrumbs = ({ category, productTitle }: BreadcrumbsProps) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs md:text-sm text-gray-500 mb-6 overflow-hidden whitespace-nowrap px-1">
      <Link 
        to="/" 
        className="hover:text-primary transition-colors flex-shrink-0"
      >
        Inicio
      </Link>
      
      <SliderNext className="w-2.5 h-2.5 text-gray-400 flex-shrink-0 mx-0.5" />
      
      <Link 
        to={`/search?categoryId=${category.id}`} 
        className="hover:text-primary transition-colors truncate flex-shrink-0"
      >
        {category.name}
      </Link>

      <SliderNext className="w-2.5 h-2.5 text-gray-400 flex-shrink-0 mx-0.5" />

      <span className="text-gray-400 truncate font-medium">
        {productTitle}
      </span>
    </nav>
  );
};
