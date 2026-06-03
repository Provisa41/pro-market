import { useEffect } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import DemoPage from "./pages/DemoPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import HomePage from "./pages/HomePage";

function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? "active" : "";
}

function routeFromStartParam(): string | null {
  const param = WebApp.initDataUnsafe.start_param;
  if (!param) return null;
  if (param === "demo" || param.startsWith("demo")) return "/demo";
  if (param === "analytics" || param.startsWith("analytics")) return "/analytics";
  return null;
}

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const target = routeFromStartParam();
    if (target) navigate(target, { replace: true });
  }, [navigate]);

  return (
    <div className="app">
      <header className="card">
        <h1 style={{ margin: "0 0 4px", fontSize: "1.25rem" }}>Pro Market</h1>
        <p className="hint" style={{ margin: 0 }}>
          AI-driven interactive ad campaigns
        </p>
      </header>

      <nav className="nav">
        <NavLink to="/" end className={navClass}>
          Home
        </NavLink>
        <NavLink to="/demo" className={navClass}>
          Demo
        </NavLink>
        <NavLink to="/analytics" className={navClass}>
          Analytics
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
    </div>
  );
}
