import { Route, Routes } from "react-router-dom"
import { Analytics } from "@vercel/analytics/react"
import { BuilderPage } from "@/pages/builder-page"
import { LandingV2 } from "./components/landing-v2/landing"

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingV2 />} />
        <Route path="/app" element={<BuilderPage />} />
      </Routes>
      <Analytics />
    </>
  )
}
