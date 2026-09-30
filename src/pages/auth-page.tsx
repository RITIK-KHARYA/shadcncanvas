import { Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Github, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthForm } from "@/hooks/use-auth-form";
import { authClient } from "@/lib/auth-client";

const REDIRECT = "/app";

export function AuthPage() {
  const { data, isPending } = authClient.useSession();
  const {
    email,
    setEmail,
    password,
    setPassword,
    mode,
    error,
    pending,
    signInWith,
    submit,
    toggleMode,
  } = useAuthForm();

  if (!isPending && data?.session) {
    return <Navigate to={REDIRECT} replace />;
  }

  return (
    <>
      {/* Authentication route: noindex, and not a share target, so it carries
          only the essentials. Global tags live in index.html. */}
      <Helmet>
        <title>Sign in — Shadcn Canvas</title>
        <meta
          name="description"
          content="Sign in to Shadcn Canvas to access your saved projects and continue building shadcn/ui components."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <Link
              to="/"
              className="lp-tracking-tight text-sm font-semibold text-foreground"
            >
              Shadcn Canvas
            </Link>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
              {mode === "sign-in"
                ? "Sign in to your account"
                : "Create your account"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "sign-in"
                ? "Continue to the builder to start dragging components."
                : "Sign up to save and continue building."}
            </p>
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={pending.providers}
              onClick={() => signInWith("github")}
            >
              <Github />
              Continue with GitHub
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={pending.providers}
              onClick={() => signInWith("discord")}
            >
              Continue with Discord
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={pending.providers}
              onClick={() => signInWith("google")}
            >
              Continue with Google
            </Button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            or with email
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-4">
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
              disabled={pending.submit || pending.providers}
            >
              {pending.submit && <Loader2 className="animate-spin" />}
              {mode === "sign-in" ? "Sign in" : "Sign up"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "sign-in"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              className="font-medium text-foreground underline-offset-4 hover:underline"
              onClick={toggleMode}
            >
              {mode === "sign-in" ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </main>
    </>
  );
}
