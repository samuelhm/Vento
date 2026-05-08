import type { CSSProperties } from 'react';
import '../../assets/css/avatar.css';

type AvatarInitialsProps = {
  name?: string;
  size?: number;
  className?: string;
};

const AVATAR_COLORS: string[] = [
  '#d32f2f',
  '#c2185b',
  '#7b1fa2',
  '#512da8',
  '#303f9f',
  '#1976d2',
  '#0288d1',
  '#0097a7',
  '#00796b',
  '#388e3c',
  '#689f38',
  '#afb42b',
  '#fbc02d',
  '#ffa000',
  '#f57c00',
  '#e64a19',
  '#5d4037',
  '#616161',
  '#455a64',
];

const stringToHash = (str: string): number => {
  let hash = 0;
  if (!str.length) return hash;

  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    hash = (hash << 5) - hash + charCode;
    hash |= 0;
  }

  return hash;
};

const getInitials = (name: string): string => {
  if (!name) return '';

  const parts = name.trim().split(/\s+/);
  let initials = '';

  if (parts.length > 0 && parts[0]) {
    initials += parts[0][0];
  }

  if (parts.length > 1 && parts[1]) {
    initials += parts[1][0];
  }

  return initials.toUpperCase();
};

const AvatarInitials = ({ name, size = 50, className = '' }: AvatarInitialsProps) => {
  const safeName = name?.trim() ? name : '?';
  const initials = getInitials(safeName);
  const hash = stringToHash(safeName);
  const colorIndex = Math.abs(hash % AVATAR_COLORS.length);
  const backgroundColor = AVATAR_COLORS[colorIndex];

  const dynamicStyle: CSSProperties = {
    backgroundColor,
    width: `${size}px`,
    height: `${size}px`,
    fontSize: `${size * 0.4}px`,
  };

  return (
    <div className={`avatar-initials-container ${className}`.trim()} style={dynamicStyle}>
      {initials}
    </div>
  );
};

export default AvatarInitials;