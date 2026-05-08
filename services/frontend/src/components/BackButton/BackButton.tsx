import { NavLink } from 'react-router';
import { ArrowLeft } from './assets/ArrowLeft';

interface BackButtonProps {
  link: string;
}

export const BackButton = ({ link }: BackButtonProps) => {
  return (
    <NavLink
      to={link}
      className="flex items-center p-4 text-sm font-medium text-gray-700 hover:text-gray-900"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Atrás
    </NavLink>
  );
};
