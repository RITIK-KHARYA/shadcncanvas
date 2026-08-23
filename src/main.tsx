import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import App from "./App"
import { Toaster } from "./components/ui/sonner"
import "@xyflow/react/dist/style.css"
import "./global.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="top-center" richColors closeButton />
    </BrowserRouter>
  </StrictMode>,
)
