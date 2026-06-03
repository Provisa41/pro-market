import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import CreatePostPage from "./pages/CreatePostPage";
import PublishAdPage from "./pages/PublishAdPage";
import PromotePostPage from "./pages/PromotePostPage";
import AnalyticsPage from "./pages/AnalyticsPage";

function routeFromStartParam(): string | null {
  const param = WebApp.initDataUnsafe.start_param;
  if (!param) return null;
  if (param === "demo" || param.startsWith("demo")) return "/ad";
  if (param === "analytics" || param.startsWith("analytics")) return "/analytics";
  if (param === "post" || param.startsWith("post")) return "/post";
  if (param === "promote" || param.startsWith("promote")) return "/promote";
  return null;
}

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const target = routeFromStartParam();
    if (target) navigate(target, { replace: true });
  }, [navigate]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/post" element={<CreatePostPage />} />
        <Route path="/ad" element={<PublishAdPage />} />
        <Route path="/promote" element={<PromotePostPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Route>
    </Routes>
  );
}
