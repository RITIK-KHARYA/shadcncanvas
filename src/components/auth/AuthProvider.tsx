"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { authClient } from "@/lib/auth-client";

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  loginDialogOpen: boolean;
  pendingAction: (() => void) | null;
  requireAuth: (action: () => void | Promise<void>) => void;
  setLoginDialogOpen: (open: boolean) => void;
  handleLoginSuccess: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isPending } = authClient.useSession();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const isAuthenticated = !isPending && !!data?.session;
  const isLoading = isPending;

  const handleLoginSuccess = useCallback(() => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [pendingAction]);

  const requireAuth = useCallback(
    (action: () => void | Promise<void>) => {
      if (isAuthenticated) {
        return action();
      }

      // Store the action to execute after login
      setPendingAction(() => action);
      setLoginDialogOpen(true);
    },
    [isAuthenticated],
  );

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      loginDialogOpen,
      pendingAction,
      requireAuth,
      setLoginDialogOpen,
      handleLoginSuccess,
    }),
    [isAuthenticated, isLoading, loginDialogOpen, pendingAction, requireAuth, setLoginDialogOpen, handleLoginSuccess],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
