import React, { type ElementType } from 'react';

type Status = 'error' | 'default';

interface HelperProps {
  color: string;
  status: Status;
  text: string;
  icon?: ElementType;
}

const Helper: React.FC<HelperProps> = ({ color, status, text, icon: Icon }) => {
  return (
    <div className={`mt-1 flex items-center gap-x-1 text-justify text-xs leading-4 ${color}`}>
      {status === 'error' && Icon && <Icon size={18} />}
      {text}
    </div>
  );
};

export default Helper;
