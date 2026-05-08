export const formatRelativeDate = (date: string | Date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now.getTime() - past.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays < 1) return 'Hoy';
  if (diffInDays === 1) return 'Ayer';
  if (diffInDays < 30) return `Hace ${diffInDays} días`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `Hace ${diffInMonths} ${diffInMonths === 1 ? 'mes' : 'meses'}`;
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `Hace ${diffInYears} ${diffInYears === 1 ? 'año' : 'años'}`;
};

export const formatMemberDuration = (date?: string | Date) => {
  if (!date) return 'Miembro de Vento';
  
  const now = new Date();
  const start = new Date(date);
  const diffInMs = now.getTime() - start.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  const diffInYears = Math.floor(diffInDays / 365);
  if (diffInYears >= 1) {
    return `${diffInYears} ${diffInYears === 1 ? 'año' : 'años'} en Vento`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths >= 1) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'mes' : 'meses'} en Vento`;
  }
  
  return 'Nuevo en Vento';
};
