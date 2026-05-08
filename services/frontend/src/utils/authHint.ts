export const VENTO_AUTH_HINT_KEY = 'vento_auth_hint';

export const getAuthHint = (): boolean => {
  const hint = localStorage.getItem(VENTO_AUTH_HINT_KEY);
  return hint === 'true';
};

export const setAuthHint = (isAuthenticated: boolean): void => {
  localStorage.setItem(VENTO_AUTH_HINT_KEY, isAuthenticated ? 'true' : 'false');
};

export const canRequestAuthMe = (): boolean => {
  return getAuthHint();
};
