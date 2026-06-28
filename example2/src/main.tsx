import { createRoot } from "react-dom/client";
import "@deva-me/login-with-deva/style.css";
import "./index.css";
import App from "./App.tsx";
import { StrictMode } from "react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
