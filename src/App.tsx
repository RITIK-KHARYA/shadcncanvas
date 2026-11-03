import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { RequireAuth } from "@/components/auth/require-auth";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { GlobalLoginDialog } from "@/components/auth/GlobalLoginDialog";
import { LandingV2 } from "@/components/landing-v2/landing";
import { AuthPage } from "@/pages/auth-page";
import { AnalyticsPage } from "@/pages/dashboard/analytics-page";
import { OverviewPage } from "@/pages/dashboard/overview-page";
import { ProjectsPage } from "@/pages/dashboard/projects-page";
import { SettingsPage } from "@/pages/dashboard/settings-page";

const BuilderPage = lazy(() =>
  import("@/pages/builder-page").then((m) => ({ default: m.BuilderPage })),
);

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingV2 />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<Navigate to="/auth" replace />} />

        {/* Every dashboard and builder route is gated. Unauthenticated
            visitors are sent to /auth, and no protected component mounts
            until a session exists. */}
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>

          <Route
            path="/app"
            element={
              <Suspense
                fallback={
                  <div className="flex h-screen items-center justify-center bg-background text-muted-foreground">
                    Loading builder…
                  </div>
                }
              >
                <BuilderPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
      <GlobalLoginDialog />
      <Analytics />
      <SpeedInsights />
    </AuthProvider>
  );
}
