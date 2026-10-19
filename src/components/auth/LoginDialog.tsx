import { useState } from "react";
import { Github, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export type LoginDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

const REDIRECT = "/app";

export function LoginDialog({ open, onOpenChange, onSuccess }: LoginDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password");
      return;
    }

    setPending(true);
    setError(null);

    const { error: authError } = await authClient.signIn.email({
      email,
      password,
      callbackURL: REDIRECT,
    });

    if (authError) {
      console.error("Login failed:", authError);
      setError(authError.message ?? "Invalid email or password");
      setPending(false);
      return;
    }

    // Close dialog and trigger success callback
    onOpenChange(false);
    setEmail("");
    setPassword("");
    onSuccess?.();
    setPending(false);
  };

  const handleSocialSignIn = async (provider: "github" | "discord" | "google") => {
    setPending(true);
    setError(null);

    const { error: authError } = await authClient.signIn.social({
      provider,
      callbackURL: REDIRECT,
    });

    if (authError) {
      console.error("Social login failed:", authError);
      setError(authError.message ?? "Login failed. Please try again.");
      setPending(false);
    } else {
      // Social login will redirect, but if it doesn't, close the dialog
      onOpenChange(false);
      onSuccess?.();
      setPending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignIn();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={!pending}>
        <DialogHeader>
          <DialogTitle>Sign in to continue</DialogTitle>
          <DialogDescription>
            Please sign in to export, copy code, or add comments.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={pending}
            onClick={() => handleSocialSignIn("github")}
          >
            <Github />
            Continue with GitHub
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={pending}
            onClick={() => handleSocialSignIn("discord")}
          >
            Continue with Discord
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={pending}
            onClick={() => handleSocialSignIn("google")}
          >
            Continue with Google
          </Button>
        </div>

        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          or with email
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={pending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={pending}
            />
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={pending || !email.trim() || !password.trim()}
          >
            {pending && <Loader2 className="animate-spin" />}
            Sign in
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
