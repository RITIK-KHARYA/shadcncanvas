import { Route, Routes } from "react-router-dom"

import { BuilderPage } from "@/pages/builder-page"
import { LandingPage } from "@/pages/landing-page"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<BuilderPage />} />
    </Routes>
  )
}
