// ===== main.tsx =====
// Entry point: starts React and loads the styles.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// IMPORTANT: themes.css first, then global.css (which uses its variables)
import "./styles/themes.css";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);