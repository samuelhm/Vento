import type { ReactNode } from "react";

interface ActionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "static";
  className?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export const ActionButton = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  icon,
  disabled = false,
}: ActionButtonProps) => {
  const baseStyles = "w-full !rounded-full transition-all flex items-center justify-center gap-2 font-semibold";
  
  const variants = {
    primary: "bg-primary text-white py-4 text-lg shadow-md hover:shadow-lg active:scale-95",
    secondary: "bg-primary-dark text-white py-3.5 shadow-sm hover:bg-secondary active:scale-95",
    outline: "bg-white text-primary border-2 border-primary py-3.5 hover:bg-blue-50",
    danger: "bg-white text-red-500 border-2 border-red-500 py-3.5 hover:bg-red-50 active:scale-95",
    ghost: "bg-gray-100 text-gray-800 border-2 border-gray-300 py-3.5 hover:bg-gray-200 active:scale-[0.98]",
    static: "bg-background-soft text-gray-600 border border-gray-200 py-3.5 cursor-default select-none"
  };

  const isStatic = variant === "static";
  const Component = isStatic ? "div" : "button";

  return (
    <Component
      onClick={!isStatic ? onClick : undefined}
      className={`${baseStyles} ${variants[variant]} ${className} ${
        disabled && !isStatic ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
      }`}
      {...(!isStatic ? { disabled, type: "button" } : {})}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </Component>
  );
};
