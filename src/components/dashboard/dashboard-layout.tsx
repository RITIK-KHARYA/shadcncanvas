import {
  Activity,
  ArrowUpRight,
  Box,
  ChevronDown,
  ChevronRight,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sparkles,
  Sun,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient, signOut } from "@/lib/auth-client";
import { getInitials } from "@/lib/dashboard";
import { cn } from "@/lib/utils";
import { useThemeModeStore } from "@/store/theme-mode-store";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { to: "/dashboard/analytics", label: "Analytics", icon: Activity },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

function Brand() {
  return (
    <Link to="/dashboard" className="flex items-center gap-2.5 px-2 py-1">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-foreground text-background shadow-sm">
        <Box className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block font-display text-[15px] font-semibold leading-none tracking-[-0.02em]">
          Shadcn Canvas
        </span>
        <span className="mt-1 block font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
          Dashboard
        </span>
      </span>
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Brand />

      <nav className="flex flex-col gap-1" aria-label="Dashboard">
        <span className="px-3 pb-1 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
          Workspace
        </span>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={"end" in item ? item.end : false}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-surface-strong text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      "size-4 shrink-0",
                      isActive ? "text-foreground" : "text-muted-foreground",
                    )}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                  {isActive ? (
                    <span className="ml-auto size-1.5 rounded-full bg-chart-2" />
                  ) : null}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        <div className="rounded-2xl border border-hairline bg-card/60 p-4 backdrop-blur-xl">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="size-4 text-chart-2" aria-hidden="true" />
            Studio is ready
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Jump back into the canvas and keep wiring components.
          </p>
          <Button asChild size="sm" className="mt-3 w-full">
            <Link to="/app" onClick={onNavigate}>
              Open builder
              <ArrowUpRight />
            </Link>
          </Button>
        </div>
        <Link
          to="/"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
        >
          Back to landing page
          <ArrowUpRight className="size-3" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

function UserMenu() {
  const navigate = useNavigate();
  const { data } = authClient.useSession();
  const user = data?.user;
  const initials = getInitials(user?.name, user?.email);

  const handleSignOut = async () => {
    await signOut({ callbackURL: "/auth" });
    navigate("/auth", { replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-hairline bg-surface/60 py-1 pr-2 pl-1 text-left transition-colors hover:bg-surface-strong"
          aria-label="Account menu"
        >
          <Avatar className="size-7">
            <AvatarImage src={user?.image ?? undefined} alt="" />
            <AvatarFallback className="text-[11px]">{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden min-w-0 sm:block">
            <span className="block max-w-32 truncate text-xs font-medium leading-tight">
              {user?.name ?? "Account"}
            </span>
            <span className="block max-w-32 truncate text-[11px] leading-tight text-muted-foreground">
              {user?.email ?? ""}
            </span>
          </span>
          <ChevronDown
            className="size-3.5 text-muted-foreground"
            aria-hidden="true"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="truncate">
          {user?.email ?? "Signed in"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/dashboard/settings">
            <Settings />
            Account settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/app">
            <Box />
            Open builder
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            void handleSignOut();
          }}
        >
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const mode = useThemeModeStore((state) => state.mode);
  const toggleMode = useThemeModeStore((state) => state.toggleMode);

  const current =
    NAV_ITEMS.find((item) =>
      "end" in item && item.end
        ? location.pathname === item.to
        : location.pathname.startsWith(item.to),
    )?.label ?? "Dashboard";

  return (
    <>
      <Helmet>
        <title>{`${current} — Shadcn Canvas`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="flex min-h-screen bg-background text-foreground">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-hairline bg-sidebar/70 lg:flex">
          <SidebarContent />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-hairline bg-background/80 px-4 backdrop-blur-xl sm:px-6">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open dashboard navigation"
                >
                  <Menu aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-72 bg-sidebar p-0"
                showCloseButton={false}
              >
                <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
                <SheetDescription className="sr-only">
                  Switch between dashboard sections or open the builder.
                </SheetDescription>
                <SidebarContent onNavigate={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>

            <div className="flex min-w-0 items-center gap-2 text-sm">
              <Link
                to="/dashboard"
                className="hidden text-muted-foreground transition-colors hover:text-foreground sm:inline"
              >
                Dashboard
              </Link>
              <ChevronRight
                className="hidden size-3.5 text-muted-foreground/60 sm:block"
                aria-hidden="true"
              />
              <span className="truncate font-medium">{current}</span>
            </div>

            <div className="ml-auto flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                aria-label={
                  mode === "dark" ? "Switch to light theme" : "Switch to dark theme"
                }
                title={
                  mode === "dark" ? "Switch to light theme" : "Switch to dark theme"
                }
                onClick={toggleMode}
              >
                {mode === "dark" ? (
                  <Sun aria-hidden="true" />
                ) : (
                  <Moon aria-hidden="true" />
                )}
              </Button>
              <UserMenu />
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-6xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
