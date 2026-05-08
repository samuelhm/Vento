import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import httpClient from "../utils/httpClient";
import type { AuthUser } from "../types/userTypes";
import type { AuthSuccessResponse, AuthErrorResponse, AuthContextValue } from "../types/authTypes";
import { AUTH_STATE_CHANGED_EVENT } from "../utils/authEvents";
import { canRequestAuthMe, setAuthHint, VENTO_AUTH_HINT_KEY } from "../utils/authHint";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncSession = useCallback(async (showLoading: boolean) => {
    if (showLoading) {
      setIsLoading(true);
    }

    if (!canRequestAuthMe()) {
      setUser(null);
      if (showLoading) {
        setIsLoading(false);
      }
      return;
    }

    try {
      const response = await httpClient.get<AuthSuccessResponse | AuthErrorResponse>("/auth/me");
      if (response.data.status === "success") {
        setUser(response.data.data);
        setAuthHint(true);
      } else {
        setUser(null);
        setAuthHint(false);
      }
    } catch {
      setUser(null);
      setAuthHint(false);
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, []);

  const refreshSession = useCallback(async () => {
    await syncSession(true);
  }, [syncSession]);

  const logout = useCallback(async () => {
    await httpClient.post("/auth/logout");
    setUser(null);
    setAuthHint(false);
  }, []);

  useEffect(() => {
    void syncSession(true);
  }, [syncSession]);

  useEffect(() => {
    const handleAuthStateChanged = () => {
      void syncSession(false);
    };

    window.addEventListener(AUTH_STATE_CHANGED_EVENT, handleAuthStateChanged);

    return () => {
      window.removeEventListener(AUTH_STATE_CHANGED_EVENT, handleAuthStateChanged);
    };
  }, [syncSession]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== VENTO_AUTH_HINT_KEY) {
        return;
      }

      if (event.newValue === "true") {
        void syncSession(false);
        return;
      }

      setUser(null);
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [syncSession]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      refreshSession,
      logout,
    }),
    [user, isLoading, refreshSession, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
