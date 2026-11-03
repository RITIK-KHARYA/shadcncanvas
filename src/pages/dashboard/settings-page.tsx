import { Check, LogOut, Moon, ShieldCheck, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/dashboard-widgets";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { authClient, signOut } from "@/lib/auth-client";
import { formatSavedStatus, getInitials } from "@/lib/dashboard";
import { cn } from "@/lib/utils";
import { useThemeModeStore } from "@/store/theme-mode-store";

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
] as const;

export function SettingsPage() {
  const { data } = authClient.useSession();
  const user = data?.user;
  const dataSummary = useDashboardData();
  const mode = useThemeModeStore((state) => state.mode);
  const setMode = useThemeModeStore((state) => state.setMode);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut({ callbackURL: "/auth" });
      toast.success("Signed out");
    } catch (error) {
      console.error(error);
      toast.error("Could not sign out");
    } finally {
      navigate("/auth", { replace: true });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account, dashboard appearance, and the workspace saved on this device."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="gap-5 py-5">
          <CardHeader className="pb-1">
            <CardTitle className="text-base">Profile</CardTitle>
            <CardDescription>The account signed in to this browser.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarImage src={user?.image ?? undefined} alt="" />
              <AvatarFallback className="text-sm">
                {getInitials(user?.name, user?.email)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-semibold">
                {user?.name ?? "Account"}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {user?.email ?? "No email on file"}
              </p>
              <Badge variant="outline" className="mt-2">
                Authenticated
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-5 py-5">
          <CardHeader className="pb-1">
            <CardTitle className="text-base">Appearance</CardTitle>
            <CardDescription>
              The theme is shared with the builder and dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((theme) => {
                const Icon = theme.icon;
                const active = mode === theme.value;
                return (
                  <button
                    key={theme.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setMode(theme.value)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-3 py-3 text-sm font-medium transition-colors",
                      active
                        ? "border-foreground/25 bg-surface-strong text-foreground"
                        : "border-hairline bg-surface/50 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span className="grid size-8 place-items-center rounded-lg border border-hairline bg-card">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    {theme.label}
                    {active ? (
                      <Check className="ml-auto size-4" aria-hidden="true" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="gap-5 py-5">
          <CardHeader className="pb-1">
            <CardTitle className="text-base">Workspace</CardTitle>
            <CardDescription>
              The canvas snapshot stored locally for this account session.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-hairline bg-surface/50 px-3 py-2.5">
              <p className="text-sm font-medium">{dataSummary.projectName}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {dataSummary.nodes} components · {dataSummary.edges} edges ·{" "}
                {formatSavedStatus(dataSummary.lastSaved)}
              </p>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link to="/dashboard/projects">Manage projects</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="gap-5 py-5">
          <CardHeader className="pb-1">
            <CardTitle className="text-base">Session</CardTitle>
            <CardDescription>
              The dashboard and builder are only available while signed in.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="flex items-start gap-2 rounded-xl border border-hairline bg-surface/50 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              Signing out sends you back to the login page and unmounts every
              protected dashboard component.
            </p>
            <Button variant="outline" size="sm" onClick={() => void handleSignOut()}>
              <LogOut />
              Sign out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
