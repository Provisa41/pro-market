import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAnalytics, type AnalyticsResponse } from "../api/client";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchAnalytics()
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="loading-state">Загрузка статистики…</p>;
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <p className="form-note" style={{ marginTop: 12 }}>
          Откройте приложение из Telegram. Локально можно смотреть формы постов и
          рекламы — они работают без API.
        </p>
        <Link to="/" className="btn btn--ghost">
          На главную
        </Link>
      </div>
    );
  }

  if (!data) return null;

  const max = Math.max(...data.series.map((s) => s.engagement), 1);

  return (
    <>
      <section className="page-head">
        <h2 className="page-head__title">Статистика</h2>
        <p className="page-head__sub">Клики, CTR и эффективность кампаний</p>
      </section>

      <section className="panel panel--highlight">
        <p className="section-label" style={{ marginTop: 0 }}>
          {data.period.replaceAll("_", " ")}
        </p>
        <div className="metric">{data.summary.avgEngagement}%</div>
        <p className="panel__text" style={{ marginBottom: 0 }}>
          Средний CTR · {data.summary.campaigns} кампаний · {data.summary.spendStars}{" "}
          Stars
        </p>
      </section>

      <section className="panel">
        <h3 className="panel__title panel__title--sm">CTR по дням</h3>
        <div className="bar-chart">
          {data.series.map((point) => (
            <div
              key={point.day}
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              <div
                className="bar"
                style={{ height: `${(point.engagement / max) * 100}%` }}
                title={`${point.engagement}%`}
              />
              <div className="bar-label">{point.day}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h3 className="panel__title panel__title--sm">Быстрые действия</h3>
        <Link to="/ad" className="btn btn--primary" style={{ marginBottom: 8 }}>
          Новая реклама
        </Link>
        <Link to="/promote" className="btn btn--ghost">
          Продвинуть пост
        </Link>
      </section>

      <p className="form-note">{data.note}</p>
    </>
  );
}
