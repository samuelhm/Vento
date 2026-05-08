import { Logo } from "./Logo";
import { Icon } from "./Logo"
import { SearchBar } from "./SearchBar";
import { User } from "./User";

export const Header = () => {
  return (
    <header className="flex justify-center p-4 h-18 sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex-none flex items-center">
          <div className="hidden md:block">
            <Logo />
          </div>
          <div className="md:hidden">
            <Icon />
          </div>
        </div>
        <div className="flex-1 flex justify-center">
            <SearchBar/>
        </div>
        <div className="flex-none flex align-items">
          <div className="flex items-center">
            <User/>
          </div>
        </div>
    </header>
  );
};