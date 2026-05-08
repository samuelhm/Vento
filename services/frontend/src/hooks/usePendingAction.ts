import { useCallback } from 'react';

export type PendingAction = {
  type: 'TOGGLE_FAVORITE' | 'REDIRECT_ONLY';
  payload?: string;
  ownerId?: string;
  redirectTo: string;
};

const STORAGE_KEY = 'vento_pending_action';

export const usePendingAction = () => {
  const setPendingAction = useCallback((action: PendingAction) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(action));
  }, []);

  const getPendingAction = useCallback((): PendingAction | null => {
    const data = sessionStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data) as PendingAction;
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }, []);

  const clearPendingAction = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    setPendingAction,
    getPendingAction,
    clearPendingAction,
  };
};
