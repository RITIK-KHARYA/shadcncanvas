import { useAuthContext } from "@/components/auth/AuthProvider";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

/**
 * Provides authentication state and a way to check if user is authenticated.
 * Also provides a way to open login dialog when needed.
 */
export function useAuth() {
  const context = useAuthContext();

  const status: AuthStatus = context.isLoading
    ? "loading"
    : context.isAuthenticated
      ? "authenticated"
      : "unauthenticated";

  return {
    isAuthenticated: context.isAuthenticated,
    status,
    loginDialogOpen: context.loginDialogOpen,
    setLoginDialogOpen: context.setLoginDialogOpen,
    pendingAction: context.pendingAction,
    requireAuth: context.requireAuth,
    handleLoginSuccess: context.handleLoginSuccess,
  };
}
