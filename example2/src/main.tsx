import { createRoot } from "react-dom/client";
import "deva-sdk/style.css";
import "./index.css";
import App from "./App.tsx";
import { StrictMode } from "react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
