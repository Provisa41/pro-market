import { Outlet } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import BottomNav from "./BottomNav";

export default function Layout() {
  const user = WebApp.initDataUnsafe.user;

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero__glow" aria-hidden />
        <div className="hero__content">
          <div className="hero__badge">AI · Telegram · Соцсети</div>
          <h1 className="hero__title">Pro Market</h1>
          <p className="hero__sub">
            {user
              ? `${user.first_name}, продвигаем ваши посты и рекламу`
              : "Продвижение постов и рекламы с высоким CTR"}
          </p>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
