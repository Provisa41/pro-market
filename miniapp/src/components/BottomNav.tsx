import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Главная", icon: "🏠", end: true },
  { to: "/post", label: "Пост", icon: "✏️" },
  { to: "/ad", label: "Реклама", icon: "📢" },
  { to: "/promote", label: "Продвижение", icon: "🚀" },
  { to: "/analytics", label: "Статистика", icon: "📊" },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Меню">
      {items.map(({ to, label, icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `bottom-nav__item${isActive ? " bottom-nav__item--active" : ""}`
          }
        >
          <span className="bottom-nav__icon" aria-hidden>
            {icon}
          </span>
          <span className="bottom-nav__label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
