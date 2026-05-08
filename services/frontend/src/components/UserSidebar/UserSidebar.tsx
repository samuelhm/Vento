import { NavLink } from "react-router";
import { useUserSidebar } from "./hooks/useUserSidebar";
import { ExitIcon } from "./icons/SidebarIcons";
 
export const UserSidebar = () => {
  const {
    isExpanded,
    toggleSidebar,
    currentAvatarUrl,
    links,
    logout,
    user,
  } = useUserSidebar();

  return (
    <aside
      className={`relative h-full shrink-0 border-r border-slate-100 bg-white transition-all duration-300 ease-in-out md:sticky md:top-0 ${
        isExpanded ? "w-full md:w-72" : "w-0 overflow-hidden md:w-20 md:overflow-visible"
      }`}
    >
      <button
        onClick={toggleSidebar}
        className="cursor-pointer absolute -right-4 top-1/2 z-50 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-transform hover:bg-slate-50 md:flex"
      >
        <span className={`text-xs text-slate-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
          ❯
        </span>
      </button>

      <div className="flex flex-col h-full py-8">
        <div className={`mb-8 flex flex-col items-center gap-4 px-4 text-center transition-all duration-300 ${!isExpanded && "md:px-2"}`}>
          <div
            className={`overflow-hidden rounded-full ring-4 ring-slate-50 shadow-md transition-all duration-300 ${
              isExpanded ? "h-24 w-24" : "md:h-12 md:w-12"
            }`}
          >
            {currentAvatarUrl ? (
              <img src={currentAvatarUrl} alt={user?.name} className="h-full w-full object-contain" />
            ) : (
              <div
                className={`flex h-full w-full  items-center justify-center bg-primary/10 font-bold text-primary transition-all duration-300 ${
                  isExpanded ? "text-3xl" : "md:text-lg"
                }`}
              >
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>
            )}
          </div>
          
          <div className={`transition-all duration-300 ${!isExpanded ? "md:opacity-0 md:h-0 overflow-hidden" : "opacity-100"}`}>
            <h3 className="whitespace-nowrap text-lg font-bold text-slate-900">
              {user?.name.split(" ")[0]} {user?.lastNames.split(" ")[0]}
            </h3>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 mx-1">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.disabled ? "#" : link.path}
              onClick={(e) => link.disabled && e.preventDefault()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 text-[15px] font-medium transition-all ${
                  isActive && !link.disabled
                    ? "bg-slate-50 text-primary shadow-sm shadow-primary/20"
                      : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                } ${link.disabled ? "opacity-50 cursor-not-allowed" : ""}`
              }
            >
              <span className={`text-xl transition-all duration-300 ${!isExpanded && "md:mx-auto"}`}>
                {link.icon}
              </span>
              <span
                className={`whitespace-nowrap transition-all duration-300 ${
                  !isExpanded ? "hidden" : "w-auto opacity-100"
                }`}
              >
                {link.name}
              </span>
              {link.disabled && isExpanded && (
                <span className="ml-auto text-[10px] uppercase font-bold text-slate-400">Pronto</span>
              )}
            </NavLink>
          ))}

          <div className="mt-4 border-t border-slate-100 pt-4 mx-1">
            <button
              onClick={() => void logout()}
              className="cursor-pointer flex w-full items-center gap-3 px-3 py-3 text-[15px] text-slate-600 font-medium hover:bg-slate-50 hover:text-primary hover:shadow-sm hover:shadow-primary/20"
            >
              <ExitIcon />
              <span
                className={`whitespace-nowrap transition-all duration-300 ${
                  !isExpanded ? "hidden" : "w-auto opacity-100"
                }`}
              >
                Cerrar sesión
              </span>
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
};
