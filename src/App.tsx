import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import { Analytics } from "@vercel/analytics/react"
import { LandingV2 } from "./components/landing-v2/landing"
import { RequireAuth } from "./components/auth/require-auth"
import { AuthPage } from "./pages/auth-page"

const BuilderPage = lazy(() =>
  import("@/pages/builder-page").then((m) => ({ default: m.BuilderPage })),
)

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingV2 />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<RequireAuth />}>
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
      <Analytics />
    </>
  )
}
