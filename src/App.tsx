import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import { Analytics } from "@vercel/analytics/react"
import { LandingV2 } from "./components/landing-v2/landing"

const BuilderPage = lazy(() =>
  import("@/pages/builder-page").then((m) => ({ default: m.BuilderPage })),
)

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingV2 />} />
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
      </Routes>
      <Analytics />
    </>
  )
}
