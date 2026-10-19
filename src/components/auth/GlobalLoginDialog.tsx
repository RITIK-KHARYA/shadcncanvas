import { useAuthContext } from "./AuthProvider";
import { LoginDialog } from "./LoginDialog";

/**
 * Global login dialog that uses the shared auth context.
 * Should be rendered once at the root of the app.
 */
export function GlobalLoginDialog() {
  const { loginDialogOpen, setLoginDialogOpen, handleLoginSuccess } = useAuthContext();

  return (
    <LoginDialog
      open={loginDialogOpen}
      onOpenChange={setLoginDialogOpen}
      onSuccess={handleLoginSuccess}
    />
  );
}
