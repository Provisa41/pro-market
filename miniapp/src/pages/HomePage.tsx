import { Link } from "react-router-dom";
import WebApp from "@twa-dev/sdk";

const actions = [
  {
    to: "/post",
    icon: "✏️",
    title: "Добавить пост",
    desc: "Текст, ссылка и хештеги для Telegram и соцсетей",
    color: "card-action--violet",
  },
  {
    to: "/ad",
    icon: "📢",
    title: "Выложить рекламу",
    desc: "Заголовок, текст, CTA и ключевые фразы для высокого CTR",
    color: "card-action--orange",
  },
  {
    to: "/promote",
    icon: "🚀",
    title: "Продвижение поста",
    desc: "Таргет в Telegram, VK, Instagram и др.",
    color: "card-action--cyan",
  },
];

export default function HomePage() {
  const user = WebApp.initDataUnsafe.user;

  return (
    <>
      <section className="panel panel--highlight">
        <h2 className="panel__title">
          {user ? `Привет, ${user.first_name}!` : "Добро пожаловать"}
        </h2>
        <p className="panel__text">
          Создайте креатив, мы разместим в Telegram и соцсетях с фокусом на
          клики и конверсию — по лучшим практикам performance-рекламы.
        </p>
        <div className="stats-row">
          <div className="stat-pill">
            <span className="stat-pill__val">+34%</span>
            <span className="stat-pill__lbl">ср. CTR</span>
          </div>
          <div className="stat-pill">
            <span className="stat-pill__val">Telegram</span>
            <span className="stat-pill__lbl">+ 4 сети</span>
          </div>
          <div className="stat-pill">
            <span className="stat-pill__val">AI</span>
            <span className="stat-pill__lbl">подсказки</span>
          </div>
        </div>
      </section>

      <p className="section-label">Быстрые действия</p>
      <div className="action-grid">
        {actions.map((a) => (
          <Link key={a.to} to={a.to} className={`card-action ${a.color}`}>
            <span className="card-action__icon">{a.icon}</span>
            <strong>{a.title}</strong>
            <span className="card-action__desc">{a.desc}</span>
          </Link>
        ))}
      </div>

      <section className="panel">
        <h3 className="panel__title panel__title--sm">Как это работает</h3>
        <ol className="steps">
          <li>
            <span>1</span> Заполните пост или рекламу — подсказки по конверсии
          </li>
          <li>
            <span>2</span> Проверьте индекс CTR перед публикацией
          </li>
          <li>
            <span>3</span> Pro Market размещает в выбранных каналах и сетях
          </li>
        </ol>
        <Link to="/analytics" className="btn btn--ghost">
          Смотреть статистику →
        </Link>
      </section>
    </>
  );
}
