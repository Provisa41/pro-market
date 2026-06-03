import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Главная", icon: "🏠", end: true },
  { to: "/campaigns", label: "Кампании", icon: "📋" },
  { to: "/post", label: "Пост", icon: "✏️" },
  { to: "/ad", label: "Реклама", icon: "📢" },
  { to: "/promote", label: "Промо", icon: "🚀" },
  { to: "/analytics", label: "Стат.", icon: "📊" },
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
