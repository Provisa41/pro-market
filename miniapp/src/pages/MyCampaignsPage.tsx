import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  formatCampaignDate,
  loadCampaigns,
} from "../lib/campaignsStorage";
import type { SavedCampaign } from "../types/campaign";
import {
  CAMPAIGN_STATUS_LABELS,
  CAMPAIGN_TYPE_LABELS,
} from "../types/campaign";

export default function MyCampaignsPage() {
  const [campaigns, setCampaigns] = useState<SavedCampaign[]>([]);

  useEffect(() => {
    setCampaigns(loadCampaigns());
  }, []);

  const active = campaigns.filter((c) => c.status !== "completed").length;

  return (
    <>
      <section className="page-head">
        <h2 className="page-head__title">Мои кампании</h2>
        <p className="page-head__sub">
          {campaigns.length === 0
            ? "Здесь появятся посты и реклама после публикации"
            : `${campaigns.length} кампаний · ${active} в работе`}
        </p>
      </section>

      {campaigns.length > 0 && (
        <div className="stats-row" style={{ marginBottom: 14 }}>
          <div className="stat-pill">
            <span className="stat-pill__val">
              {campaigns.filter((c) => c.type === "post").length}
            </span>
            <span className="stat-pill__lbl">посты</span>
          </div>
          <div className="stat-pill">
            <span className="stat-pill__val">
              {campaigns.filter((c) => c.type === "ad").length}
            </span>
            <span className="stat-pill__lbl">реклама</span>
          </div>
          <div className="stat-pill">
            <span className="stat-pill__val">
              {campaigns.filter((c) => c.type === "promote").length}
            </span>
            <span className="stat-pill__lbl">промо</span>
          </div>
        </div>
      )}

      {campaigns.length === 0 ? (
        <section className="panel empty-campaigns">
          <span className="empty-campaigns__icon">📋</span>
          <p>Пока нет кампаний</p>
          <p className="panel__text">
            Создайте пост, рекламу или запустите продвижение — они сохранятся
            здесь автоматически.
          </p>
          <Link to="/post" className="btn btn--primary">
            Создать первую кампанию
          </Link>
        </section>
      ) : (
        <ul className="campaign-list">
          {campaigns.map((c) => {
            const meta = CAMPAIGN_TYPE_LABELS[c.type];
            return (
              <li key={c.id} className="campaign-card">
                <div className="campaign-card__head">
                  <span className="campaign-card__type">
                    {meta.icon} {meta.label}
                  </span>
                  <span
                    className={`campaign-card__status campaign-card__status--${c.status}`}
                  >
                    {CAMPAIGN_STATUS_LABELS[c.status]}
                  </span>
                </div>
                <h3 className="campaign-card__title">{c.title}</h3>
                <p className="campaign-card__summary">{c.summary}</p>
                <div className="campaign-card__meta">
                  <span>CTR {c.ctrScore}</span>
                  {c.budget && <span>{c.budget} ₽/день</span>}
                  <span>{formatCampaignDate(c.createdAt)}</span>
                </div>
                {c.platforms.length > 0 && (
                  <div className="campaign-card__platforms">
                    {c.platforms.map((p) => (
                      <span key={p} className="tag">
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <Link to="/post" className="btn btn--ghost">
        + Новая кампания
      </Link>
    </>
  );
}
