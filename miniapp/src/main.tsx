import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import App from "./App";
import "./styles.css";

WebApp.ready();
WebApp.expand();

const scheme = WebApp.colorScheme;
document.documentElement.dataset.theme = scheme;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
