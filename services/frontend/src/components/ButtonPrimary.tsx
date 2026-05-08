import type { ButtonProps } from '../types/buttonTypes.ts';

export const ButtonPrimary = ({ className = '', children, ...props }: ButtonProps) => {
  return (
    <button className={`cursor-pointer px-4 py-2 rounded ${className}`} {...props}>
      {children}
    </button>
  );
};
