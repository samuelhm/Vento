import ventoLogo from "../../../assets/images/logo/vento-icon.webp";
import ventoNameSmall from "../../../assets/images/logo/vento-name-small.webp";
import { Link } from "react-router";

export const Logo = () => {
  return (
    <Link to="/" aria-label="Ir al inicio" className="flex items-center gap-2">
      <img src={ventoNameSmall} alt="Nombre de Vento" className="block h-8" />
    </Link>
  );
};

export const Icon = () => {
  return (
    <Link to="/" aria-label="Ir al inicio" className="flex items-center gap-2">
      <img src={ventoLogo} alt="Vento" className="block h-12" />
    </Link>
  );
};