import { useEffect, useState } from "react";
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

  if (loading) return <p className="hint">Loading analytics…</p>;
  if (error) return <p className="hint">Error: {error}</p>;
  if (!data) return null;

  const max = Math.max(...data.series.map((s) => s.engagement), 1);

  return (
    <>
      <section className="card">
        <h2 style={{ marginTop: 0 }}>Campaign analytics</h2>
        <p className="hint">{data.period.replaceAll("_", " ")}</p>
        <div className="metric">{data.summary.avgEngagement}%</div>
        <p className="hint">
          {data.summary.campaigns} active campaign(s) · {data.summary.spendStars}{" "}
          Stars spent
        </p>
      </section>

      <section className="card">
        <h3 style={{ marginTop: 0 }}>Engagement by day</h3>
        <div className="bar-chart">
          {data.series.map((point) => (
            <div key={point.day} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
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

      <p className="hint">{data.note}</p>
    </>
  );
}
