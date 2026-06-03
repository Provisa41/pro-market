import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import { fetchDemo, type DemoResponse } from "../api/client";

export default function DemoPage() {
  const [data, setData] = useState<DemoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchDemo()
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

  useEffect(() => {
    if (data && data.metrics.engagementRate >= 50) {
      WebApp.HapticFeedback?.notificationOccurred("success");
    }
  }, [data]);

  if (loading) return <p className="hint">Loading demo campaign…</p>;
  if (error) return <p className="hint">Error: {error}</p>;
  if (!data) return null;

  const won = data.metrics.engagementRate >= 50;

  return (
    <>
      <section className="card">
        <h2 style={{ marginTop: 0 }}>{data.title}</h2>
        <p>{data.preview.headline}</p>
        <div>
          {data.preview.segments.map((s) => (
            <span key={s} className="tag">
              {s}
            </span>
          ))}
        </div>
        <button type="button" className="btn" style={{ marginTop: 12 }}>
          {data.preview.cta}
        </button>
      </section>

      <section className="card">
        <p className="hint">Engagement rate (demo)</p>
        <div className="metric">{data.metrics.engagementRate}%</div>
        {won && (
          <p style={{ color: "var(--accent)" }}>
            First win: over 50% engagement with personalized preview.
          </p>
        )}
        <p className="hint">
          {data.metrics.impressions.toLocaleString()} impressions ·{" "}
          {data.metrics.clicks.toLocaleString()} clicks
        </p>
      </section>

      <p className="hint">{data.message}</p>
    </>
  );
}
